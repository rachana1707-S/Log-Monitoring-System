package com.logpulse.controller;

import com.logpulse.dto.TraceResponse;
import com.logpulse.service.TraceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/traces")
@RequiredArgsConstructor
public class TraceController {

    private final TraceService traceService;

    @GetMapping("/{traceId}")
    public TraceResponse getTrace(
            @PathVariable String traceId
    ) {
        return traceService.getTrace(traceId);
    }
}