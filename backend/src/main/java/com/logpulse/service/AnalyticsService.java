package com.logpulse.service;

import com.logpulse.dto.AnalyticsResponse;
import com.logpulse.dto.TimeBucket;
import com.logpulse.model.LogEntry;
import com.logpulse.repository.LogRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final LogRepository logRepository;

    public AnalyticsResponse getAnalytics() {

        List<LogEntry> logs = StreamSupport
                .stream(
                        logRepository
                                .findAll()
                                .spliterator(),
                        false
                )
                .toList();

        long totalLogs = logs.size();

        long errorCount = logs
                .stream()
                .filter(log ->
                        log.getLevel() != null
                                && log.getLevel()
                                .name()
                                .equals("ERROR")
                )
                .count();

        long warningCount = logs
                .stream()
                .filter(log ->
                        log.getLevel() != null
                                && log.getLevel()
                                .name()
                                .equals("WARN")
                )
                .count();

        Set<String> services = logs
                .stream()
                .map(LogEntry::getService)
                .filter(service -> service != null)
                .collect(
                        java.util.stream.Collectors.toSet()
                );

        long serviceCount = services.size();

        double errorRate = totalLogs == 0
                ? 0
                : ((double) errorCount / totalLogs) * 100;

        Map<String, Long> severityDistribution =
                calculateSeverityDistribution(logs);

        Map<String, Long> serviceDistribution =
                calculateServiceDistribution(logs);

        List<TimeBucket> logsOverTime =
                calculateLogsOverTime(logs);

        return new AnalyticsResponse(
                totalLogs,
                errorCount,
                warningCount,
                serviceCount,
                errorRate,
                severityDistribution,
                serviceDistribution,
                logsOverTime
        );
    }

    private Map<String, Long>
    calculateSeverityDistribution(
            List<LogEntry> logs
    ) {

        Map<String, Long> distribution =
                new LinkedHashMap<>();

        distribution.put("TRACE", 0L);
        distribution.put("DEBUG", 0L);
        distribution.put("INFO", 0L);
        distribution.put("WARN", 0L);
        distribution.put("ERROR", 0L);
        distribution.put("FATAL", 0L);

        for (LogEntry log : logs) {

            if (log.getLevel() != null) {

                String level =
                        log.getLevel().name();

                distribution.put(
                        level,
                        distribution.getOrDefault(
                                level,
                                0L
                        ) + 1
                );
            }
        }

        return distribution;
    }

    private Map<String, Long>
    calculateServiceDistribution(
            List<LogEntry> logs
    ) {

        Map<String, Long> distribution =
                new LinkedHashMap<>();

        for (LogEntry log : logs) {

            if (log.getService() == null) {
                continue;
            }

            String service = log.getService();

            distribution.put(
                    service,
                    distribution.getOrDefault(
                            service,
                            0L
                    ) + 1
            );
        }

        return distribution;
    }

    private List<TimeBucket>
    calculateLogsOverTime(
            List<LogEntry> logs
    ) {

        Map<String, Long> buckets =
                new LinkedHashMap<>();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern(
                        "HH:mm"
                );

        logs.stream()
                .filter(log ->
                        log.getTimestamp() != null
                )
                .sorted(
                        (first, second) ->
                                first
                                        .getTimestamp()
                                        .compareTo(
                                                second
                                                        .getTimestamp()
                                        )
                )
                .forEach(log -> {

                    String time =
                            formatter.format(
                                    log
                                            .getTimestamp()
                                            .atZone(
                                                    ZoneId
                                                            .systemDefault()
                                            )
                            );

                    buckets.put(
                            time,
                            buckets.getOrDefault(
                                    time,
                                    0L
                            ) + 1
                    );
                });

        List<TimeBucket> result =
                new ArrayList<>();

        buckets.forEach(
                (time, count) ->
                        result.add(
                                new TimeBucket(
                                        time,
                                        count
                                )
                        )
        );

        return result;
    }
}