package com.logpulse.dto;

import java.time.Instant;

public record ServiceHealth(
        String service,
        long totalLogs,
        long errorCount,
        long warningCount,
        double errorRate,
        String status,
        Instant lastActivity
) {
}