package com.logpulse.service;

import com.logpulse.dto.TraceResponse;
import com.logpulse.exception.TraceNotFoundException;
import com.logpulse.model.LogEntry;
import com.logpulse.model.LogLevel;
import com.logpulse.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TraceService {

    private final LogRepository logRepository;

    public TraceResponse getTrace(String traceId) {
        List<LogEntry> events=
                logRepository.findByTraceId(traceId);

        if(events.isEmpty()){
            throw new TraceNotFoundException(traceId);
        }

        events.sort(
                Comparator.comparing(
                        LogEntry::getTimestamp,
                        Comparator.nullsLast(
                                Comparator.naturalOrder()
                        )
                )
        );

        List<String> services=events.stream()
                .map(LogEntry::getService)
                .filter(service->
                        service!=null&&!service.isBlank()
                )
                .distinct()
                .sorted()
                .toList();

        Instant startTime=events.stream()
                .map(LogEntry::getTimestamp)
                .filter(timestamp->timestamp!=null)
                .min(Instant::compareTo)
                .orElse(null);

        Instant endTime=events.stream()
                .map(LogEntry::getTimestamp)
                .filter(timestamp->timestamp!=null)
                .max(Instant::compareTo)
                .orElse(null);

        long durationMs=0;

        if(startTime!=null&&endTime!=null){
            durationMs=Duration.between(
                    startTime,
                    endTime
            ).toMillis();
        }

        boolean hasErrors=events.stream()
                .anyMatch(event->
                        event.getLevel()==LogLevel.ERROR||
                        event.getLevel()==LogLevel.FATAL
                );

        return new TraceResponse(
                traceId,
                events.size(),
                services.size(),
                durationMs,
                startTime,
                endTime,
                hasErrors,
                services,
                events
        );
    }
}