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

    @Field(type=FieldType.Keyword)
    private AlertRuleType ruleType;

    @Field(type=FieldType.Integer)
    private Integer threshold;

    @Field(type=FieldType.Integer)
    private Integer windowSeconds;

    @Field(type=FieldType.Integer)
    private Integer observedCount;

    @Field(type=FieldType.Date)
    private Instant timestamp;
}