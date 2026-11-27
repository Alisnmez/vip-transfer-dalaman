package com.viptransfer.booking;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/bookings/dispatch")
class DispatchController {
  private final BookingRepository bookings;
  private final DispatchRepository dispatch;
  private final NamedParameterJdbcTemplate sql;

  DispatchController(
      BookingRepository bookings, DispatchRepository dispatch, NamedParameterJdbcTemplate sql) {
    this.bookings = bookings;
    this.dispatch = dispatch;
    this.sql = sql;
  }

  // Both legs exist in the queue even before the first operational update.
  private static final String QUEUE =
      """
with legs as (
    select b.*, 'outbound' as leg, transfer_date_time as pickup from booking b
    union all
    select b.*, 'return' as leg, return_date_time as pickup from booking b where return_date_time is not null
), queue as (
    select b.id, b.leg, b.pickup, cast(b.pickup as varchar) as local_pickup, b.customer_name, b.status, b.vehicle_id, b.trip_type,
        b.passenger_count, b.baby_seat_count, b.special_requests, b.created_at,
        case when b.leg='outbound' then b.pick_up_location else b.drop_off_location end as origin,
        case when b.leg='outbound' then b.drop_off_location else b.pick_up_location end as destination,
        (select max(m.created_at) from booking_management_request m where m.booking_id=b.id and m.status='NEW') as last_request,
        d.driver, d.phone, d.plate, d.capacity, d.available_after, cast(d.available_after as varchar) as available_local, d.assigned_at, d.reviewed_at, d.verified_at, d.reviewed_priority,
        coalesce(d.stage,'Unassigned') as stage, coalesce(d.revision,0) as revision,
        case when b.status in ('CANCELLED','COMPLETED') or d.stage='Finished' then 5
             when (b.pickup < :now and coalesce(d.stage,'Unassigned') <> 'In progress') or (b.pickup < :two and coalesce(d.stage,'Unassigned')='Unassigned') then 0
             when b.pickup < :day and coalesce(d.stage,'Unassigned')='Unassigned' then 1
             when d.reviewed_at is null or exists (select 1 from booking_management_request m where m.booking_id=b.id and m.status='NEW') then 2
             when b.pickup < :twoDays and coalesce(d.stage,'Unassigned')='Unassigned' then 3
             else 4 end as priority
    from legs b left join dispatch_leg d on b.id=d.booking_id and b.leg=d.leg
)
""";

  private static Map<String, Object> times() {
    var now = LocalDateTime.now(ZoneId.of("Europe/Istanbul"));
    var p = new HashMap<String, Object>();
    p.put("now", now);
    p.put("two", now.plusHours(2));
    p.put("day", now.plusDays(1));
    p.put("twoDays", now.plusDays(2));
    p.put("today", now.toLocalDate().atStartOfDay());
    p.put("tomorrow", now.toLocalDate().plusDays(1).atStartOfDay());
    return p;
  }

  private static final String UNREAD =
      "(reviewed_at is null or last_request>reviewed_at or priority<reviewed_priority)";
  private static final Map<String, String> VIEWS =
      Map.of(
          "all",
          "1=1",
          "critical",
          "priority=0",
          "urgent",
          "priority=1",
          "unassigned",
          "stage='Unassigned' and priority<5",
          "unread",
          UNREAD + " and priority<5",
          "today",
          "pickup>=:today and pickup<:tomorrow and priority<5",
          "next24",
          "pickup>=:now and pickup<:day and priority<5",
          "active",
          "stage='In progress' and priority<5",
          "new",
          "status='PENDING' and priority<5");

  @GetMapping
  Map<String, Object> queue(
      @RequestParam(defaultValue = "all") String view,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "") String driver,
      @RequestParam(defaultValue = "") String vehicle,
      @RequestParam(defaultValue = "") String route,
      @RequestParam(defaultValue = "") String trip,
      @RequestParam(defaultValue = "") String direction,
      @RequestParam(defaultValue = "") String need,
      @RequestParam(defaultValue = "") String requestType,
      @RequestParam(defaultValue = "") String received,
      @RequestParam(defaultValue = "") String status,
      @RequestParam(defaultValue = "") String assignment,
      @RequestParam(defaultValue = "") String reviewed,
      @RequestParam(defaultValue = "") String horizon,
      @RequestParam(required = false) LocalDate from,
      @RequestParam(required = false) LocalDate to) {
    if (!VIEWS.containsKey(view)
        || page < 0
        || page > 100000
        || (from != null && to != null && from.isAfter(to)))
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    var p = times();
    String where = " from queue q where " + VIEWS.get(view);
    for (var filter :
        Map.of("driver", driver, "vehicle_id", vehicle, "trip_type", trip, "status", status)
            .entrySet()) {
      if (!filter.getValue().isBlank()) {
        where += " and lower(" + filter.getKey() + ")=lower(:" + filter.getKey() + ")";
        p.put(filter.getKey(), filter.getValue().strip());
      }
    }
    if (!route.isBlank()) {
      where += " and (position(lower(:route) in lower(origin))>0 or position(lower(:route) in lower(destination))>0)";
      p.put("route", route.strip());
    }
    if (!direction.isEmpty())
      where +=
          direction.equals("arrival")
              ? " and lower(origin)='dalaman airport'"
              : " and lower(destination)='dalaman airport'";
    if (!need.isEmpty())
      where +=
          need.equals("seat")
              ? " and baby_seat_count>0"
              : " and trim(coalesce(special_requests,''))<>''";
    if (!reviewed.isEmpty())
      where +=
          reviewed.equals("unread") ? " and " + UNREAD : " and not coalesce(" + UNREAD + ",false)";
    if (!assignment.isEmpty())
      where += assignment.equals("assigned") ? " and stage<>'Unassigned'" : " and stage='Unassigned'";
    if (!requestType.isEmpty()) {
      where +=
          " and exists(select 1 from booking_management_request m where m.booking_id=q.id and"
              + " m.status in ('NEW','IN_PROGRESS') and m.request_type=:requestType)";
      p.put("requestType", requestType);
    }
    if (!received.isEmpty()) {
      var start =
          received.equals("today")
              ? (LocalDateTime) p.get("today")
              : ((LocalDateTime) p.get("now")).minusDays(received.equals("week") ? 7 : 1);
      where += " and created_at>=:received";
      p.put(
          "received",
          java.sql.Timestamp.from(start.atZone(ZoneId.of("Europe/Istanbul")).toInstant()));
    }
    if (!horizon.isEmpty()) {
      int hours =
          switch (horizon) {
            case "24" -> 24;
            case "48" -> 48;
            case "168" -> 168;
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
          };
      where += " and pickup>=:now and pickup<:horizon";
      p.put("horizon", ((LocalDateTime) p.get("now")).plusHours(hours));
    }
    if (from != null) {
      where += " and pickup>=:fromDate";
      p.put("fromDate", from.atStartOfDay());
    }
    if (to != null) {
      where += " and pickup<:toDate";
      p.put("toDate", to.plusDays(1).atStartOfDay());
    }
    var total = sql.queryForObject(QUEUE + "select count(*)" + where, p, Long.class);
    p.put("offset", page * 25);
    String order =
        Set.of("today", "next24", "active").contains(view)
            ? "pickup, id, leg"
            : "priority, pickup, id, leg";
    var rows =
        sql.queryForList(
            QUEUE + "select *" + where + " order by " + order + " limit 25 offset :offset", p);
    return Map.of("rows", rows, "total", total);
  }

  @GetMapping("/counts")
  Map<String, Object> counts() {
    var columns = new ArrayList<String>();
    VIEWS.forEach(
        (key, condition) ->
            columns.add("count(case when " + condition + " then 1 end) as c_" + key));
    var counts =
        sql.queryForMap(QUEUE + "select " + String.join(",", columns) + " from queue", times());
    var result = new HashMap<String, Object>();
    VIEWS.keySet().forEach(key -> result.put(key, counts.get("c_" + key)));
    return result;
  }

  @GetMapping("/{id}")
  List<Map<String, Object>> details(@PathVariable long id) {
    var p = times();
    p.put("id", id);
    return sql.queryForList(QUEUE + "select * from queue where id=:id order by pickup", p);
  }

  @GetMapping("/{id}/history")
  List<Map<String, Object>> history(@PathVariable long id) {
    return sql.queryForList(
        "select leg, description, occurred_at from dispatch_activity where booking_id=:id order by"
            + " id desc limit 100",
        Map.of("id", id));
  }

  record Update(
      @Size(max = 100) String driver,
      @Size(max = 40) String phone,
      @Size(max = 24) String plate,
      @Min(1) @Max(100) Integer capacity,
      String stage,
      boolean reviewOnly,
      boolean verifyCustomer,
      int revision,
      LocalDateTime availableAfter) {}

  @PutMapping("/{id}/{leg}")
  @Transactional
  Map<String, Object> update(
      @PathVariable long id, @PathVariable String leg, @Valid @RequestBody Update change) {
    var booking =
        bookings
            .findByIdForUpdate(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    if (!leg.equals("outbound") && !(leg.equals("return") && booking.getReturnDateTime() != null))
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    var item = dispatch.findByBookingIdAndLeg(id, leg).orElseGet(DispatchLeg::new);
    if (item.revision != change.revision())
      throw new ResponseStatusException(
          HttpStatus.CONFLICT, "Refresh before editing this transfer.");
    item.bookingId = id;
    item.leg = leg;
    String warning = "";
    if (!change.reviewOnly() && !change.verifyCustomer()) {
      if ("CANCELLED".equals(booking.getStatus()) || "COMPLETED".equals(booking.getStatus()))
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Booking is archived.");
      String driver = change.driver() == null ? "" : change.driver().strip();
      if (change.stage() == null
          || !Set.of("Unassigned", "Assigned", "Notified", "In progress", "Finished")
              .contains(change.stage())
          
          || (change.capacity() != null && change.capacity() < booking.getPassengerCount()))
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST, "Check driver, stage and seat capacity.");
      boolean unassigned = change.stage().equals("Unassigned");
      if (unassigned) item.assignedAt = null;
      else if (item.assignedAt == null) item.assignedAt = Instant.now();
      item.driver = unassigned || driver.isEmpty() ? null : driver;
      item.phone = unassigned ? null : change.phone();
      item.plate = unassigned ? null : change.plate();
      item.capacity = unassigned ? null : change.capacity();
      item.stage = change.stage();
      item.availableAfter = unassigned ? null : change.availableAfter();
      if (!unassigned && !driver.isEmpty()) {
        var p = times();
        var pickup =
            leg.equals("return") ? booking.getReturnDateTime() : booking.getTransferDateTime();
        if (item.availableAfter != null && !item.availableAfter.isAfter(pickup))
          throw new ResponseStatusException(
              HttpStatus.BAD_REQUEST, "Availability must follow pickup.");
        // Serialize simultaneous assignments for the same driver before checking overlap.
        sql.query(
            "select pg_advisory_xact_lock(hashtext(lower(:driver)))",
            Map.of("driver", driver),
            rs -> {
              return null;
            });
        p.put("driver", driver);
        p.put("start", pickup);
        p.put("end", item.availableAfter == null ? pickup.plusHours(1) : item.availableAfter);
        p.put("id", id);
        p.put("leg", leg);
        long conflicts =
            sql.queryForObject(
                QUEUE
                    + "select count(*) from queue where lower(driver)=lower(:driver) and priority<5"
                    + " and coalesce(available_after,pickup + interval '1 hour')>:start and"
                    + " pickup<:end and not(id=:id and leg=:leg)",
                p,
                Long.class);
        if (conflicts > 0 && !change.stage().equals("Finished"))
          throw new ResponseStatusException(HttpStatus.CONFLICT,
              "Driver has an overlapping transfer. Choose another driver or adjust availability.");
      }
    }
    if (change.verifyCustomer()) item.verifiedAt = Instant.now();
    item.reviewedAt = Instant.now();
    item.revision++;
    dispatch.saveAndFlush(item);
    var priorityParams = times();
    priorityParams.put("id", id);
    priorityParams.put("leg", leg);
    item.reviewedPriority =
        sql.queryForObject(
            QUEUE + "select priority from queue where id=:id and leg=:leg",
            priorityParams,
            Integer.class);
    var description =
        change.verifyCustomer()
            ? "Customer information verified"
            : change.reviewOnly()
                ? "Notice reviewed"
                : item.stage + (item.driver == null ? "" : " · " + item.driver);
    sql.update(
        "insert into dispatch_activity (booking_id,leg,description,occurred_at) values"
            + " (:id,:leg,:description,:at)",
        Map.of(
            "id",
            id,
            "leg",
            leg,
            "description",
            description,
            "at",
            java.sql.Timestamp.from(Instant.now())));

    return Map.of("warning", warning);
  }
}
