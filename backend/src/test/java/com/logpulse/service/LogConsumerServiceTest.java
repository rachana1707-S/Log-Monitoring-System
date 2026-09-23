package com.logpulse.service;

import com.logpulse.model.LogEntry;
import com.logpulse.model.LogLevel;
import com.logpulse.repository.LogRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.Instant;

import static org.mockito.Mockito.*;

class LogConsumerServiceTest {

    private LogRepository logRepository;
    private SimpMessagingTemplate messagingTemplate;
    private AlertRuleEngine alertRuleEngine;
    private LogConsumerService logConsumerService;

    @BeforeEach
    void setUp() {
        logRepository = mock(LogRepository.class);
        messagingTemplate = mock(SimpMessagingTemplate.class);
        alertRuleEngine = mock(AlertRuleEngine.class);

        logConsumerService = new LogConsumerService(
                logRepository,
                messagingTemplate,
                alertRuleEngine
        );
    }

    @Test
    void shouldSaveAndBroadcastLog() {
        LogEntry log = new LogEntry();

        log.setId("log-1001");
        log.setService("payment-service");
        log.setLevel(LogLevel.ERROR);
        log.setMessage("Payment failed");
        log.setTraceId("trace-1001");
        log.setEnvironment("production");
        log.setHost("payment-server-01");
        log.setTimestamp(Instant.now());

        when(logRepository.save(log))
                .thenReturn(log);

        logConsumerService.consume(log);

        verify(logRepository,times(1))
                .save(log);

        verify(messagingTemplate,times(1))
                .convertAndSend(
                        "/topic/logs",
                        log
                );
    }
}