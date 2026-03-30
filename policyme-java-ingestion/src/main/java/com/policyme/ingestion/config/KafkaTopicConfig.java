package com.policyme.ingestion.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * Kafka topic auto-configuration.
 * Ensures the 'policyme.document.uploaded' topic exists on startup.
 */
@Configuration
public class KafkaTopicConfig {

    @Value("${policyme.kafka.topic.document-uploaded}")
    private String documentUploadedTopic;

    @Bean
    public NewTopic documentUploadedTopic() {
        return TopicBuilder.name(documentUploadedTopic)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
