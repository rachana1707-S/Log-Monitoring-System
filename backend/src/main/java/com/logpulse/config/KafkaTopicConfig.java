package com.logpulse.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaTopicConfig {

    public static final String LOG_TOPIC = "log-events";

    @Bean
    public NewTopic logEventsTopic() {
        return new NewTopic(
                LOG_TOPIC,
                3,
                (short) 1
        );
    }
}