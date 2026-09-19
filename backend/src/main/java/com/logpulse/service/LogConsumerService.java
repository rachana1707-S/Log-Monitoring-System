package com.logpulse.service;

import com.logpulse.config.KafkaTopicConfig;
import com.logpulse.model.LogEntry;
import com.logpulse.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LogConsumerService {

    private final LogRepository logRepository;

    @KafkaListener(
            topics = KafkaTopicConfig.LOG_TOPIC,
            groupId = "logpulse-consumers"
    )
    public void consume(LogEntry logEntry) {

        log.info(
                "Processing log from service: {}",
                logEntry.getService()
        );

        logRepository.save(logEntry);
    }
}