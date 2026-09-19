package com.logpulse.controller;

import com.logpulse.dto.LogRequest;
import com.logpulse.dto.LogResponse;
import com.logpulse.model.LogEntry;
import com.logpulse.service.LogIngestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogIngestionService logIngestionService;

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public LogResponse ingest(
            @Valid @RequestBody LogRequest request
    ) {

        LogEntry log =
                logIngestionService.ingest(request);

        return new LogResponse(
                "Log accepted for processing",
                log.getId()
        );
    }
}