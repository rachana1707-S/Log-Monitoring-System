package com.logpulse.controller;

import com.logpulse.dto.LogRequest;
import com.logpulse.dto.LogResponse;
import com.logpulse.model.LogEntry;
import com.logpulse.model.LogLevel;
import com.logpulse.service.LogIngestionService;
import com.logpulse.service.LogSearchService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogIngestionService logIngestionService;
    private final LogSearchService logSearchService;

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public LogResponse ingest(
            @Valid @RequestBody LogRequest request
    ) {

        LogEntry log = logIngestionService.ingest(request);

        return new LogResponse(
                "Log accepted for processing",
                log.getId()
        );
    }

    @GetMapping
    public List<LogEntry> getLogs(
            @RequestParam(required = false) String service,
            @RequestParam(required = false) LogLevel level,
            @RequestParam(required = false) String q
    ) {

        if (service != null) {
            return logSearchService.findByService(service);
        }

        if (level != null) {
            return logSearchService.findByLevel(level);
        }

        if (q != null) {
            return logSearchService.search(q);
        }

        return logSearchService.getAllLogs();
    }
}