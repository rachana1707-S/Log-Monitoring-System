package com.logpulse.dto;

import com.logpulse.model.LogEntry;

import java.util.List;

public record LogSearchResponse(
        List<LogEntry> logs,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}