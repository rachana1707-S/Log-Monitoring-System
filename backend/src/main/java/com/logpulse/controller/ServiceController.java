package com.logpulse.controller;

import com.logpulse.dto.ServiceHealth;
import com.logpulse.service.ServiceMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceMonitoringService serviceMonitoringService;

    @GetMapping
    public List<ServiceHealth> getServices() {
        return serviceMonitoringService.getServices();
    }
}