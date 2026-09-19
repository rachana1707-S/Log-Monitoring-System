package com.logpulse.service;

import com.logpulse.dto.LogRequest;
import com.logpulse.model.LogEntry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LogIngestionService {

    private final LogProducerService producerService;

    public LogEntry ingest(LogRequest request) {

        LogEntry log = LogEntry.builder()
                .id(UUID.randomUUID().toString())
                .service(request.getService())
                .level(request.getLevel())
                .message(request.getMessage())
                .traceId(request.getTraceId())
                .environment(request.getEnvironment())
                .host(request.getHost())
                .timestamp(Instant.now())
                .build();

        producerService.publish(log);

        return log;
    }
}