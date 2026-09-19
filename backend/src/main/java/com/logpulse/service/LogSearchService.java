package com.logpulse.service;

import com.logpulse.model.LogEntry;
import com.logpulse.model.LogLevel;
import com.logpulse.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class LogSearchService {

    private final LogRepository repository;

    public List<LogEntry> getAllLogs() {

        return StreamSupport
                .stream(repository.findAll().spliterator(), false)
                .toList();
    }

    public List<LogEntry> findByService(String service) {

        return repository.findByService(service);
    }

    public List<LogEntry> findByLevel(LogLevel level) {

        return repository.findByLevel(level);
    }

    public List<LogEntry> search(String query) {

        return repository.findByMessageContaining(query);
    }
}