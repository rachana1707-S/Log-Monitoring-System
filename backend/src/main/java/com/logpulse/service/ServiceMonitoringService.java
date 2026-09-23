package com.logpulse.service;

import com.logpulse.dto.ServiceHealth;
import com.logpulse.model.LogEntry;
import com.logpulse.model.LogLevel;
import com.logpulse.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ServiceMonitoringService {

    private final LogRepository logRepository;

    public List<ServiceHealth> getServices() {
        Iterable<LogEntry> allLogs=logRepository.findAll();

        Map<String,List<LogEntry>> logsByService=new HashMap<>();

        for(LogEntry log:allLogs){
            if(log.getService()==null||log.getService().isBlank()){
                continue;
            }

            logsByService
                    .computeIfAbsent(
                            log.getService(),
                            key->new ArrayList<>()
                    )
                    .add(log);
        }

        List<ServiceHealth> services=new ArrayList<>();

        for(Map.Entry<String,List<LogEntry>> entry:
                logsByService.entrySet()){

            String serviceName=entry.getKey();
            List<LogEntry> logs=entry.getValue();

            long totalLogs=logs.size();

            long errorCount=logs.stream()
                    .filter(log->
                            log.getLevel()==LogLevel.ERROR||
                            log.getLevel()==LogLevel.FATAL
                    )
                    .count();

            long warningCount=logs.stream()
                    .filter(log->
                            log.getLevel()==LogLevel.WARN
                    )
                    .count();

            double errorRate=totalLogs==0
                    ?0
                    :(errorCount*100.0)/totalLogs;

            Instant lastActivity=logs.stream()
                    .map(LogEntry::getTimestamp)
                    .filter(timestamp->timestamp!=null)
                    .max(Instant::compareTo)
                    .orElse(null);

            String status=determineStatus(
                    errorRate,
                    lastActivity
            );

            services.add(
                    new ServiceHealth(
                            serviceName,
                            totalLogs,
                            errorCount,
                            warningCount,
                            Math.round(errorRate*10.0)/10.0,
                            status,
                            lastActivity
                    )
            );
        }

        services.sort(
                Comparator.comparing(
                        ServiceHealth::totalLogs
                ).reversed()
        );

        return services;
    }

    private String determineStatus(
            double errorRate,
            Instant lastActivity
    ) {
        if(lastActivity==null){
            return "INACTIVE";
        }

        Instant inactiveCutoff=
                Instant.now().minusSeconds(300);

        if(lastActivity.isBefore(inactiveCutoff)){
            return "INACTIVE";
        }

        if(errorRate>=20){
            return "CRITICAL";
        }

        if(errorRate>=10){
            return "DEGRADED";
        }

        return "HEALTHY";
    }
}