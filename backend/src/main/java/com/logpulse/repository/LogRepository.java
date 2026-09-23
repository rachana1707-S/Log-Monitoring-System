package com.logpulse.repository;

import com.logpulse.model.LogEntry;
import com.logpulse.model.LogLevel;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface LogRepository
        extends ElasticsearchRepository<LogEntry, String> {

    List<LogEntry> findByService(String service);

    List<LogEntry> findByLevel(LogLevel level);

    List<LogEntry> findByServiceAndLevel(
            String service,
            LogLevel level
    );

    List<LogEntry> findByMessageContaining(String message);
    List<LogEntry> findByTraceId(String traceId);
}