package com.logpulse.service;

import com.logpulse.config.KafkaTopicConfig;
import com.logpulse.model.LogEntry;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogProducerService {

    private final KafkaTemplate<String, LogEntry> kafkaTemplate;

    public void publish(LogEntry logEntry) {

        kafkaTemplate.send(
                KafkaTopicConfig.LOG_TOPIC,
                logEntry.getService(),
                logEntry
        );
    }
}