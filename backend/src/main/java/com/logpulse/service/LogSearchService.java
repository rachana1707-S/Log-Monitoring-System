package com.logpulse.service;

import com.logpulse.dto.LogSearchResponse;
import com.logpulse.model.LogEntry;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LogSearchService {

    private final ElasticsearchOperations elasticsearchOperations;

    public LogSearchResponse search(
            String service,
            String level,
            String environment,
            String keyword,
            Instant startTime,
            Instant endTime,
            int page,
            int size
    ) {
        int safePage=Math.max(page,0);
        int safeSize=Math.min(Math.max(size,1),100);

        NativeQuery query=NativeQuery.builder()
                .withQuery(q->q.bool(bool->{
                    if(service!=null&&!service.isBlank()){
                        bool.filter(f->f.term(t->t
                                .field("service")
                                .value(service)
                        ));
                    }

                    if(level!=null&&!level.isBlank()){
                        bool.filter(f->f.term(t->t
                                .field("level")
                                .value(level)
                        ));
                    }

                    if(environment!=null&&!environment.isBlank()){
                        bool.filter(f->f.term(t->t
                                .field("environment")
                                .value(environment)
                        ));
                    }

                    if(keyword!=null&&!keyword.isBlank()){
                        bool.must(m->m.match(match->match
                                .field("message")
                                .query(keyword)
                        ));
                    }

                    if(startTime!=null||endTime!=null){
                        bool.filter(f->f.range(range->range
                                .date(date->{
                                    date.field("timestamp");

                                    if(startTime!=null){
                                        date.gte(startTime.toString());
                                    }

                                    if(endTime!=null){
                                        date.lte(endTime.toString());
                                    }

                                    return date;
                                })
                        ));
                    }

                    return bool;
                }))
                .withPageable(
                        PageRequest.of(
                                safePage,
                                safeSize,
                                Sort.by(
                                        Sort.Direction.DESC,
                                        "timestamp"
                                )
                        )
                )
                .build();

        SearchHits<LogEntry> searchHits=
                elasticsearchOperations.search(
                        query,
                        LogEntry.class
                );

        List<LogEntry> logs=searchHits
                .stream()
                .map(SearchHit::getContent)
                .toList();

        long totalElements=searchHits.getTotalHits();

        int totalPages=
                totalElements==0
                        ?0
                        :(int)Math.ceil(
                                (double)totalElements/safeSize
                        );

        return new LogSearchResponse(
                logs,
                safePage,
                safeSize,
                totalElements,
                totalPages
        );
    }
}