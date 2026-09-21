package com.logpulse.controller;

import com.logpulse.dto.AnalyticsResponse;
import com.logpulse.service.AnalyticsService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public AnalyticsResponse getAnalytics() {

        return analyticsService.getAnalytics();
    }
}