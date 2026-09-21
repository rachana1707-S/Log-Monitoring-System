package com.logpulse.repository;

import com.logpulse.model.Alert;
import com.logpulse.model.AlertRuleType;
import com.logpulse.model.AlertStatus;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface AlertRepository
        extends ElasticsearchRepository<Alert,String> {

    List<Alert> findByStatus(AlertStatus status);

    List<Alert> findByServiceAndRuleTypeAndStatus(
            String service,
            AlertRuleType ruleType,
            AlertStatus status
    );
}