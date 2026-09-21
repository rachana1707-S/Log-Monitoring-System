package com.logpulse.service;

import com.logpulse.model.Alert;
import com.logpulse.model.AlertStatus;
import com.logpulse.model.LogEntry;
import com.logpulse.model.LogLevel;
import com.logpulse.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    public void processLog(LogEntry log) {
        if(log.getLevel()==null){
            return;
        }

        if(log.getLevel()!=LogLevel.ERROR&&
                log.getLevel()!=LogLevel.FATAL){
            return;
        }

        Alert alert=Alert.fromLog(log);

        alertRepository.save(alert);

        System.out.println(
                "Alert created for service: "
                        +log.getService()
        );
    }

    public List<Alert> getAlerts() {
        return StreamSupport
                .stream(
                        alertRepository.findAll().spliterator(),
                        false
                )
                .sorted(
                        Comparator.comparing(
                                Alert::getTimestamp,
                                Comparator.nullsLast(
                                        Comparator.naturalOrder()
                                )
                        ).reversed()
                )
                .toList();
    }

    public List<Alert> getActiveAlerts() {
        return alertRepository
                .findByStatus(AlertStatus.ACTIVE)
                .stream()
                .sorted(
                        Comparator.comparing(
                                Alert::getTimestamp,
                                Comparator.nullsLast(
                                        Comparator.naturalOrder()
                                )
                        ).reversed()
                )
                .toList();
    }

    public Alert resolveAlert(String id) {
        Alert alert=alertRepository
                .findById(id)
                .orElseThrow(()->
                        new IllegalArgumentException(
                                "Alert not found"
                        )
                );

        alert.setStatus(AlertStatus.RESOLVED);

        return alertRepository.save(alert);
    }
}