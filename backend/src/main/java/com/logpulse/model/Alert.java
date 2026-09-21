package com.logpulse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName="alerts")
public class Alert {

    @Id
    private String id;

    @Field(type=FieldType.Keyword)
    private String service;

    @Field(type=FieldType.Keyword)
    private AlertSeverity severity;

    @Field(type=FieldType.Text)
    private String message;

    @Field(type=FieldType.Keyword)
    private String traceId;

    @Field(type=FieldType.Keyword)
    private AlertStatus status;

    @Field(type=FieldType.Date)
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