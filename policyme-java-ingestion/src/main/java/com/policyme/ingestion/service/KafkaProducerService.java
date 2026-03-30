package com.policyme.ingestion.service;

import com.policyme.ingestion.model.DocumentEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

/**
 * Kafka Producer Service.
 * Publishes DocumentEvent messages to the 'policyme.document.uploaded' topic.
 * The Python FastAPI GraphRAG Engine acts as the Consumer on the other end.
 */
@Service
public class KafkaProducerService {

    private static final Logger log = LoggerFactory.getLogger(KafkaProducerService.class);

    private final KafkaTemplate<String, DocumentEvent> kafkaTemplate;

    @Value("${policyme.kafka.topic.document-uploaded}")
    private String documentUploadedTopic;

    public KafkaProducerService(KafkaTemplate<String, DocumentEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * Publish a DocumentEvent to Kafka asynchronously.
     *
     * @param event The document event to publish
     */
    public void publishDocumentEvent(DocumentEvent event) {
        log.info("📤 Publishing DocumentEvent to Kafka topic '{}': {}", documentUploadedTopic, event.getDocumentId());

        CompletableFuture<SendResult<String, DocumentEvent>> future =
                kafkaTemplate.send(documentUploadedTopic, event.getDocumentId(), event);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("❌ Failed to publish DocumentEvent for '{}': {}", event.getDocumentId(), ex.getMessage());
            } else {
                log.info("✅ DocumentEvent published successfully. Topic: {}, Partition: {}, Offset: {}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }
        });
    }
}
