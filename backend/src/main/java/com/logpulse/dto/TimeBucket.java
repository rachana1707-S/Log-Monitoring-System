package com.logpulse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TimeBucket {

    private String time;

    private long count;
}