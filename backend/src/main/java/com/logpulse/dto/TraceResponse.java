package com.logpulse.dto;

import com.logpulse.model.LogEntry;

import java.time.Instant;
import java.util.List;

public record TraceResponse(
        String traceId,
        int eventCount,
        int serviceCount,
        long durationMs,
        Instant startTime,
        Instant endTime,
        boolean hasErrors,
        List<String> services,
        List<LogEntry> events
) {
}