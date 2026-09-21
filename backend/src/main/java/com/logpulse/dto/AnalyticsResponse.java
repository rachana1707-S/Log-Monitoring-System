package com.logpulse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class AnalyticsResponse {

    private long totalLogs;

    private long errorCount;

    private long warningCount;

    private long serviceCount;

    private double errorRate;

    private Map<String, Long> severityDistribution;

    private Map<String, Long> serviceDistribution;

    private List<TimeBucket> logsOverTime;
}