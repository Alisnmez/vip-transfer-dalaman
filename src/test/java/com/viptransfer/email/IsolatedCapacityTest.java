package com.viptransfer.email;
import com.viptransfer.booking.dto.BookingRequestDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import java.net.URI;
import java.net.http.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT, properties={
 "app.email.enabled=true","app.email.provider=resend","app.email.api-key=fake-ci-key",
 "app.email.from=CI <sender@example.com>","app.email.reply-to=operator@example.com",
 "app.email.operator=operator@example.com","app.email.initial-delay-ms=86400000",
 "spring.flyway.enabled=true","spring.jpa.hibernate.ddl-auto=validate"})
class IsolatedCapacityTest {
 @LocalServerPort int port;
 @Autowired JdbcTemplate jdbc;
 @Autowired ObjectMapper json;
 @Autowired EmailDispatcher dispatcher;
 @MockitoBean ResendGateway gateway;
 record Sample(double ms, int status) {}
 @Test void benchmarkDisposableDatabaseOnly() throws Exception {
  assertTrue(jdbc.getDataSource().getConnection().getMetaData().getURL().equals("jdbc:postgresql://localhost:5432/capacity_ci"));
  HttpClient client=HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();
  Set<Long> ids=ConcurrentHashMap.newKeySet();
  int total=0;
  for(int concurrency:new int[]{1,5,10,25}) {
   List<Sample> samples=Collections.synchronizedList(new ArrayList<>());
   ExecutorService pool=Executors.newFixedThreadPool(concurrency);
   CountDownLatch start=new CountDownLatch(1);
   List<Future<?>> futures=new ArrayList<>();
   long begun=System.nanoTime();
   for(int t=0;t<concurrency;t++) futures.add(pool.submit(()->{
    start.await();
    for(int i=0;i<4;i++){
     var dto=new BookingRequestDto();
     dto.setCustomerName("CI CAPACITY TEST"); dto.setEmail("customer@example.com"); dto.setPhoneNumber("+447700900123");
     dto.setPassengerCount(2); dto.setPickUpLocation("Dalaman Airport"); dto.setDropOffLocation("Marmaris(Any Hotel)");
     dto.setVehicleId("vip-minivan"); dto.setTripType("one-way");
     dto.setTransferDateTime(LocalDateTime.now(ZoneId.of("Europe/Istanbul")).plusDays(7));
     var req=HttpRequest.newBuilder(URI.create("http://localhost:"+port+"/bookings")).timeout(Duration.ofSeconds(15))
      .header("Content-Type","application/json").header("Idempotency-Key",UUID.randomUUID().toString())
      .POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(dto))).build();
     long before=System.nanoTime(); var response=client.send(req,HttpResponse.BodyHandlers.ofString());
     samples.add(new Sample((System.nanoTime()-before)/1e6,response.statusCode()));
     if(response.statusCode()==200) ids.add(json.readTree(response.body()).get("id").asLong());
    }
    return null;
   }));
   start.countDown();
   try {for(var f:futures) f.get(90,TimeUnit.SECONDS);} finally {pool.shutdownNow();}
   double seconds=(System.nanoTime()-begun)/1e9;
   var times=samples.stream().mapToDouble(Sample::ms).sorted().toArray();
   long errors=samples.stream().filter(s->s.status()!=200).count();
   System.out.printf(Locale.ROOT,"CAPACITY booking concurrency=%d requests=%d rps=%.2f p95_ms=%.2f max_ms=%.2f errors=%d%n",
    concurrency,samples.size(),samples.size()/seconds,times[(int)Math.ceil(times.length*.95)-1],times[times.length-1],errors);
   assertEquals(0,errors,"HTTP errors at concurrency "+concurrency);
   total+=samples.size();
  }
  assertEquals(total,ids.size());
  assertEquals(total,jdbc.queryForObject("SELECT count(*) FROM booking",Integer.class));
  assertEquals(total*2,jdbc.queryForObject("SELECT count(*) FROM booking_email_outbox WHERE status='PENDING'",Integer.class));
  verifyNoInteractions(gateway);
  when(gateway.send(anyString(),anyString())).thenAnswer(inv->{Thread.sleep(100);return "simulated-provider-id";});
  int pending=total*2, cycles=0;
  long begin=System.nanoTime();
  while(jdbc.queryForObject("SELECT count(*) FROM booking_email_outbox WHERE status='PENDING'",Integer.class)>0){
   dispatcher.dispatch(); cycles++; assertTrue(cycles<1000);
  }
  double elapsed=(System.nanoTime()-begin)/1e9;
  assertEquals(pending,jdbc.queryForObject("SELECT count(*) FROM booking_email_outbox WHERE status='ACCEPTED'",Integer.class));
  verify(gateway,times(pending)).send(anyString(),anyString());
  System.out.printf(Locale.ROOT,"CAPACITY email messages=%d cycles=%d active_seconds=%.2f active_messages_per_second=%.2f scheduled_seconds_estimate=%.2f simulated_provider_latency_ms=100%n",
   pending,cycles,elapsed,pending/elapsed,elapsed+Math.max(0,cycles-1)*15);
  for(String table:List.of("booking","booking_email_outbox")){
   var size=jdbc.queryForMap("SELECT count(*) AS rows, avg(pg_column_size(t)) AS avg_row_bytes, pg_total_relation_size('"+table+"') AS total_relation_bytes FROM "+table+" t");
   System.out.println("CAPACITY storage "+table+" "+size);
  }
  System.out.println("CAPACITY database_bytes="+jdbc.queryForObject("SELECT pg_database_size(current_database())",Long.class));
  System.out.println("CAPACITY LIMITATION: isolated GitHub runner PostgreSQL16; simulated email provider; not Render production throughput or inbox delivery.");
 }
}
