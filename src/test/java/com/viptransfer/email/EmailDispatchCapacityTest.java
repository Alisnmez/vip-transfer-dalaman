package com.viptransfer.email;

import com.viptransfer.booking.BookingService;
import com.viptransfer.booking.dto.BookingRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.PlatformTransactionManager;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;
import java.util.concurrent.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest(properties={
 "app.email.enabled=true", "app.email.provider=resend", "app.email.api-key=fake-ci-key",
 "app.email.from=CI <sender@example.com>", "app.email.reply-to=operator@example.com",
 "app.email.operator=operator@example.com", "app.email.initial-delay-ms=86400000"})
class EmailDispatchCapacityTest {
 @Autowired BookingService bookings;
 @Autowired JdbcTemplate jdbc;
 @Autowired EmailDispatcher dispatcher;
 @Autowired PlatformTransactionManager manager;
 @MockitoBean ResendGateway gateway;

 @BeforeEach void clean() { jdbc.update("DELETE FROM booking_email_outbox"); }
 void queue(int count) {
  for(int i=0;i<count;i++){
   var dto=new BookingRequestDto();
   dto.setCustomerName("CI queue capacity"); dto.setEmail("customer@example.com");
   dto.setPhoneNumber("+447700900123"); dto.setPassengerCount(2);
   dto.setPickUpLocation("Dalaman Airport"); dto.setDropOffLocation("Marmaris(Any Hotel)");
   dto.setVehicleId("vip-minivan"); dto.setTripType("one-way");
   dto.setTransferDateTime(LocalDateTime.now(ZoneId.of("Europe/Istanbul")).plusDays(3));
   bookings.createBooking(dto,UUID.randomUUID().toString());
  }
 }
 long count(String status) {
  return jdbc.queryForObject("SELECT count(*) FROM booking_email_outbox WHERE status=?",Long.class,status);
 }
 @Test void defaultBatchRemainsFiveAndConcurrentInvocationsNeverDuplicateSends() throws Exception {
  queue(6);
  when(gateway.send(anyString(),anyString())).thenReturn("simulated-provider-id");
  dispatcher.dispatch();
  assertEquals(5,count("ACCEPTED")); assertEquals(7,count("PENDING"));
  var pool=Executors.newFixedThreadPool(2);
  try {
   var a=pool.submit(()->dispatcher.dispatch());
   var b=pool.submit(()->dispatcher.dispatch());
   a.get(15,TimeUnit.SECONDS); b.get(15,TimeUnit.SECONDS);
  } finally {pool.shutdownNow();}
  assertEquals(12,count("ACCEPTED")); assertEquals(0,count("PENDING"));
  var ids=org.mockito.ArgumentCaptor.forClass(String.class);
  verify(gateway,times(12)).send(ids.capture(),anyString());
  assertEquals(12,new java.util.HashSet<>(ids.getAllValues()).size());
 }
 @Test void elapsedBudgetFinishesCurrentSendAndLeavesRemainingMessagesPending() {
  queue(2);
  when(gateway.send(anyString(),anyString())).thenAnswer(inv->{Thread.sleep(40);return "simulated-provider-id";});
  new EmailDispatcher(jdbc,gateway,manager,20,10).dispatch();
  assertEquals(1,count("ACCEPTED")); assertEquals(3,count("PENDING")); assertEquals(0,count("SENDING"));
 }
 @Test void configurationRejectsUnboundedBatchesAndWorkBudgets() {
  for(int batch:new int[]{0,101}) assertThrows(IllegalArgumentException.class,()->new EmailDispatcher(jdbc,gateway,manager,batch,5000));
  for(long budget:new long[]{0,30001}) assertThrows(IllegalArgumentException.class,()->new EmailDispatcher(jdbc,gateway,manager,5,budget));
 }
 @Test void fiveMessageBatchBenchmarkWithSimulatedProvider() {
  queue(10);
  when(gateway.send(anyString(),anyString())).thenAnswer(inv->{Thread.sleep(100);return "simulated-provider-id";});
  long start=System.nanoTime();
  int cycles=0;
  while(count("PENDING")>0){dispatcher.dispatch(); assertTrue(++cycles<10);}
  double active=(System.nanoTime()-start)/1e9;
  assertEquals(20,count("ACCEPTED")); assertEquals(4,cycles);
  System.out.printf(java.util.Locale.ROOT,
   "EMAIL_CAPACITY messages=20 cycles=%d active_seconds=%.3f old_estimated_seconds=%.3f new_estimated_seconds=%.3f simulated_provider_ms=100%n",
   cycles,active,active+(cycles-1)*15,active+(cycles-1)*2);
 }
}
