package com.logpulse.controller;

import com.logpulse.dto.LogRequest;
import com.logpulse.dto.LogResponse;
import com.logpulse.dto.LogSearchResponse;
import com.logpulse.model.LogEntry;
import com.logpulse.model.LogLevel;
import com.logpulse.service.LogIngestionService;
import com.logpulse.service.LogSearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
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
        LogEntry log=logIngestionService.ingest(request);

        return new LogResponse(
                "Log accepted for processing",
                log.getId()
        );
    }

    @GetMapping
    public List<LogEntry> getLogs(
            @RequestParam(required=false) String service,
            @RequestParam(required=false) LogLevel level,
            @RequestParam(required=false) String q
    ) {
        LogSearchResponse response=logSearchService.search(
                service,
                level!=null?level.name():null,
                null,
                q,
                null,
                null,
                0,
                100
        );

        return response.logs();
    }

    @GetMapping("/search")
    public LogSearchResponse searchLogs(
            @RequestParam(required=false) String service,
            @RequestParam(required=false) String level,
            @RequestParam(required=false) String environment,
            @RequestParam(required=false) String keyword,
            @RequestParam(required=false) Instant startTime,
            @RequestParam(required=false) Instant endTime,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="25") int size
    ) {
        return logSearchService.search(
                service,
                level,
                environment,
                keyword,
                startTime,
                endTime,
                page,
                size
        );
    }
}