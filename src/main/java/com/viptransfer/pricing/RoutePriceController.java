package com.viptransfer.pricing;

import com.viptransfer.booking.TransferPricingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/route-prices")
public class RoutePriceController {
    private final TransferPricingService pricing;
    private final RoutePriceRepository repository;

    public RoutePriceController(TransferPricingService pricing, RoutePriceRepository repository) {
        this.pricing = pricing;
        this.repository = repository;
    }

    public record PriceEdit(@NotBlank String destination, @NotBlank String vehicleId,
        @NotNull @DecimalMin("0.01") @Digits(integer = 9, fraction = 2) BigDecimal oneWay,
        @NotNull @DecimalMin("0.01") @Digits(integer = 9, fraction = 2) BigDecimal roundTrip,
        @NotNull @Min(-1) Long version) {}

    @GetMapping
    public List<TransferPricingService.PublishedPrice> list() { return pricing.publishedPrices(); }

    @PutMapping
    @Transactional
    public TransferPricingService.PublishedPrice update(@Valid @RequestBody PriceEdit edit) {
        if (!pricing.isPublishedRoute(edit.destination(), edit.vehicleId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown route or vehicle.");
        }
        RoutePrice row = repository.findByOriginAndDestinationAndVehicleType("Dalaman Airport", edit.destination(), edit.vehicleId()).orElse(null);
        long currentVersion = row == null ? -1 : row.version;
        if (currentVersion != edit.version()) throw new ResponseStatusException(HttpStatus.CONFLICT, "Price changed. Refresh before editing again.");
        if (row == null) row = new RoutePrice();
        row.destination = edit.destination();
        row.vehicleType = edit.vehicleId();
        row.price = edit.oneWay();
        row.roundTripPrice = edit.roundTrip();
        row.currency = "GBP";
        row = repository.saveAndFlush(row);
        return new TransferPricingService.PublishedPrice(row.destination, row.vehicleType, row.price, row.roundTripPrice, row.version);
    }

    @ExceptionHandler({ObjectOptimisticLockingFailureException.class, DataIntegrityViolationException.class})
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> concurrentEdit() { return Map.of("message", "Price changed. Refresh before editing again."); }
}
