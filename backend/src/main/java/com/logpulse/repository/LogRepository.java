package com.logpulse.repository;

import com.logpulse.model.LogEntry;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface LogRepository
        extends ElasticsearchRepository<LogEntry, String> {

    List<LogEntry> findByService(String service);

    List<LogEntry> findByLevel(String level);
}