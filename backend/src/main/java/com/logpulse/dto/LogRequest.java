package com.logpulse.dto;

import com.logpulse.model.LogLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LogRequest {

    @NotBlank
    private String service;

    @NotNull
    private LogLevel level;

    @NotBlank
    private String message;

    private String traceId;

    private String environment = "development";

    private String host;
}