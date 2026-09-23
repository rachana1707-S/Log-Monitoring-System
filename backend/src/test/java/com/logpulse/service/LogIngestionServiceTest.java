package com.logpulse.service;

import com.logpulse.dto.LogRequest;
import com.logpulse.model.LogEntry;
import com.logpulse.model.LogLevel;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LogIngestionServiceTest {

    private LogProducerService logProducerService;
    private LogIngestionService logIngestionService;

    @BeforeEach
    void setUp() {
        logProducerService = mock(LogProducerService.class);

        logIngestionService =
                new LogIngestionService(logProducerService);
    }

    @Test
    void shouldCreateAndPublishLog() {

        LogRequest request = new LogRequest();

        request.setService("payment-service");
        request.setLevel(LogLevel.ERROR);
        request.setMessage("Payment failed");
        request.setTraceId("trace-1001");
        request.setEnvironment("production");
        request.setHost("payment-server-01");

        LogEntry result =
                logIngestionService.ingest(request);

        assertNotNull(result);
        assertNotNull(result.getId());
        assertNotNull(result.getTimestamp());

        assertEquals(
                "payment-service",
                result.getService()
        );

        assertEquals(
                LogLevel.ERROR,
                result.getLevel()
        );

        assertEquals(
                "Payment failed",
                result.getMessage()
        );

        ArgumentCaptor<LogEntry> captor =
                ArgumentCaptor.forClass(
                        LogEntry.class
                );

        verify(logProducerService)
                .publish(captor.capture());

        LogEntry publishedLog =
                captor.getValue();

        assertEquals(
                result.getId(),
                publishedLog.getId()
        );
    }
}