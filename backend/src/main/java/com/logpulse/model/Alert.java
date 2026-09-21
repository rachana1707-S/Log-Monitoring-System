package com.logpulse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alert {

    private String id;
    private String service;
    private AlertSeverity severity;
    private String message;
    private String traceId;
    private AlertStatus status;
    private Instant timestamp;

    public static Alert fromLog(LogEntry log) {
        AlertSeverity severity=
                log.getLevel()==LogLevel.FATAL
                        ?AlertSeverity.CRITICAL
                        :AlertSeverity.HIGH;

        return Alert.builder()
                .id(UUID.randomUUID().toString())
                .service(log.getService())
                .severity(severity)
                .message(log.getMessage())
                .traceId(log.getTraceId())
                .status(AlertStatus.ACTIVE)
                .timestamp(Instant.now())
                .build();
    }
}