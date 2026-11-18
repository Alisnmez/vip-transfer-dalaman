package com.viptransfer.pricing;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/route-prices")
public class RoutePriceController {
    private final RoutePriceRepository repository;

    public RoutePriceController(RoutePriceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<RoutePrice> list() {
        return repository.findAll();
    }
}
