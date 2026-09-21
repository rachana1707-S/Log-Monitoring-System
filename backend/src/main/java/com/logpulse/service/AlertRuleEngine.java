package com.logpulse.service;

import com.logpulse.model.Alert;
import com.logpulse.model.AlertRuleType;
import com.logpulse.model.AlertSeverity;
import com.logpulse.model.AlertStatus;
import com.logpulse.model.LogEntry;
import com.logpulse.model.LogLevel;
import com.logpulse.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AlertRuleEngine {

    private static final int ERROR_THRESHOLD=5;
    private static final int WINDOW_SECONDS=60;

    private final AlertRepository alertRepository;

    private final Map<String,List<Instant>> serviceErrors=
            new ConcurrentHashMap<>();

    public void evaluate(LogEntry log) {
        if(log.getLevel()==null){
            return;
        }

        if(log.getLevel()!=LogLevel.ERROR&&
                log.getLevel()!=LogLevel.FATAL){
            return;
        }

        String service=log.getService();

        if(service==null||service.isBlank()){
            return;
        }

        Instant now=Instant.now();

        List<Instant> errors=serviceErrors.computeIfAbsent(
                service,
                key->new ArrayList<>()
        );

        synchronized(errors){
            removeExpiredErrors(errors,now);

            errors.add(now);

            if(errors.size()>=ERROR_THRESHOLD){
                handleThresholdReached(
                        log,
                        errors.size()
                );

                errors.clear();
            }
        }
    }

    private void removeExpiredErrors(
            List<Instant> errors,
            Instant now
    ) {
        Instant cutoff=now.minus(
                WINDOW_SECONDS,
                ChronoUnit.SECONDS
        );

        errors.removeIf(
                timestamp->timestamp.isBefore(cutoff)
        );
    }

    private void handleThresholdReached(
            LogEntry log,
            int errorCount
    ) {
        boolean activeAlertExists=
                hasActiveAlert(log.getService());

        if(activeAlertExists){
            System.out.println(
                    "Duplicate alert suppressed for service: "
                            +log.getService()
            );

            return;
        }

        createCriticalAlert(
                log,
                errorCount
        );
    }

    private boolean hasActiveAlert(String service) {
        List<Alert> activeAlerts=
                alertRepository
                        .findByServiceAndRuleTypeAndStatus(
                                service,
                                AlertRuleType.ERROR_FREQUENCY,
                                AlertStatus.ACTIVE
                        );

        return !activeAlerts.isEmpty();
    }

    private void createCriticalAlert(
            LogEntry log,
            int errorCount
    ) {
        Alert alert=Alert.builder()
                .id(UUID.randomUUID().toString())
                .service(log.getService())
                .severity(AlertSeverity.CRITICAL)
                .message(
                        "High error frequency detected for "
                                +log.getService()
                )
                .traceId(log.getTraceId())
                .status(AlertStatus.ACTIVE)
                .ruleType(
                        AlertRuleType.ERROR_FREQUENCY
                )
                .threshold(ERROR_THRESHOLD)
                .windowSeconds(WINDOW_SECONDS)
                .observedCount(errorCount)
                .timestamp(Instant.now())
                .build();

        alertRepository.save(alert);

        System.out.println(
                "Critical alert triggered for service: "
                        +log.getService()
                        +" | errors: "
                        +errorCount
        );
    }
}