package com.logpulse.service;

import com.logpulse.model.LogEntry;
import com.logpulse.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogConsumerService {

    private final LogRepository logRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final AlertService alertService;

    @KafkaListener(
            topics="log-events",
            groupId="logpulse-consumers"
    )
    public void consume(LogEntry logEntry) {

        System.out.println(
                "Processing log from service: "
                        +logEntry.getService()
        );

        LogEntry savedLog=logRepository.save(logEntry);

        messagingTemplate.convertAndSend(
                "/topic/logs",
                savedLog
        );

        alertService.processLog(savedLog);

        System.out.println(
                "Broadcast log through WebSocket: "
                        +savedLog.getId()
        );
    }
}