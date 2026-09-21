package com.logpulse.controller;

import com.logpulse.model.Alert;
import com.logpulse.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public List<Alert> getAlerts() {
        return alertService.getAlerts();
    }

    @GetMapping("/active")
    public List<Alert> getActiveAlerts() {
        return alertService.getActiveAlerts();
    }

    @PatchMapping("/{id}/resolve")
    public Alert resolveAlert(
            @PathVariable String id
    ) {
        return alertService.resolveAlert(id);
    }
}