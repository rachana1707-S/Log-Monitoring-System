package com.logpulse.service;

import com.logpulse.model.Alert;
import com.logpulse.model.AlertStatus;
import com.logpulse.model.LogEntry;
import com.logpulse.model.LogLevel;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class AlertService {

    private final List<Alert> alerts=new ArrayList<>();

    public void processLog(LogEntry log) {
        if(log.getLevel()==null){
            return;
        }

        if(log.getLevel()!=LogLevel.ERROR&&
                log.getLevel()!=LogLevel.FATAL){
            return;
        }

        Alert alert=Alert.fromLog(log);
        alerts.add(alert);
    }

    public List<Alert> getAlerts() {
        return alerts.stream()
                .sorted(Comparator.comparing(
                        Alert::getTimestamp,
                        Comparator.nullsLast(
                                Comparator.naturalOrder()
                        )
                ).reversed())
                .toList();
    }

    public List<Alert> getActiveAlerts() {
        return alerts.stream()
                .filter(alert->
                        alert.getStatus()==AlertStatus.ACTIVE
                )
                .sorted(Comparator.comparing(
                        Alert::getTimestamp,
                        Comparator.nullsLast(
                                Comparator.naturalOrder()
                        )
                ).reversed())
                .toList();
    }

    public Alert resolveAlert(String id) {
        Alert alert=alerts.stream()
                .filter(item->item.getId().equals(id))
                .findFirst()
                .orElseThrow(()->
                        new IllegalArgumentException(
                                "Alert not found"
                        )
                );

        alert.setStatus(AlertStatus.RESOLVED);

        return alert;
    }
}