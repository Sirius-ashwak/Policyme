package com.policyme.ingestion.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.policyme.ingestion.model.DocumentEvent;
import com.policyme.ingestion.service.KafkaProducerService;
import com.policyme.ingestion.service.S3Service;
import com.policyme.ingestion.service.TextExtractionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for document ingestion.
 * Accepts policy PDF uploads, stores them in S3, extracts text,
 * and publishes a DocumentEvent to Apache Kafka for downstream
 * processing by the Python GraphRAG Engine.
 */
@RestController
@RequestMapping("/api/documents")
public class DocumentUploadController {

    private static final Logger log = LoggerFactory.getLogger(DocumentUploadController.class);

    private final S3Service s3Service;
    private final KafkaProducerService kafkaProducerService;
    private final TextExtractionService textExtractionService;
    private final ObjectMapper objectMapper;
    private final int kafkaMaxRequestSizeBytes;
    private final int kafkaEventSafetyBufferBytes;

    public DocumentUploadController(S3Service s3Service,
                                    KafkaProducerService kafkaProducerService,
                                    TextExtractionService textExtractionService,
                                    ObjectMapper objectMapper,
                                    @Value("${spring.kafka.producer.properties.max.request.size:10485760}") int kafkaMaxRequestSizeBytes,
                                    @Value("${policyme.kafka.event-safety-buffer-bytes:8192}") int kafkaEventSafetyBufferBytes) {
        this.s3Service = s3Service;
        this.kafkaProducerService = kafkaProducerService;
        this.textExtractionService = textExtractionService;
        this.objectMapper = objectMapper;
        this.kafkaMaxRequestSizeBytes = kafkaMaxRequestSizeBytes;
        this.kafkaEventSafetyBufferBytes = kafkaEventSafetyBufferBytes;
    }

    /**
     * POST /api/documents/upload
          * Accepts a multipart file upload (PDF, max 50MB).
     * 
     * Flow:
     * 1. Validate file type
     * 2. Upload to AWS S3
     * 3. Extract text using PDFBox
     * 4. Publish DocumentEvent to Kafka topic
     * 5. Return acknowledgement with document ID
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "uploadedBy", defaultValue = "admin") String uploadedBy) {

        // 1. Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "No file provided",
                    "message", "Please upload a PDF file."
            ));
        }

        if (!textExtractionService.isSupportedFileType(file.getContentType())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Unsupported file type",
                    "message", "Only PDF files are supported. Received: " + file.getContentType()
            ));
        }

        String documentId = "DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info(" Received upload request: '{}' ({}), assigned ID: {}",
                file.getOriginalFilename(), file.getContentType(), documentId);

        try {
            // 2. Upload to S3
            String s3Key = s3Service.uploadFile(file);

            // 3. Extract full text (no truncation in production path)
            String extractedText = textExtractionService.extractTextFromPdf(file);
            log.info("Extracted full policy text for '{}': {} characters",
                    file.getOriginalFilename(), extractedText.length());

            // 4. Build and publish Kafka event
            DocumentEvent event = new DocumentEvent(
                    documentId,
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getSize(),
                    s3Key,
                    s3Service.getBucketName(),
                    uploadedBy
            );
            event.setExtractedText(extractedText);

            int payloadBytes = estimateEventPayloadBytes(event);
            int safePayloadLimit = Math.max(1, kafkaMaxRequestSizeBytes - kafkaEventSafetyBufferBytes);
            if (payloadBytes > safePayloadLimit) {
                log.warn(
                        "Rejected {} because event payload {} bytes exceeds safe Kafka limit {} bytes",
                        documentId,
                        payloadBytes,
                        safePayloadLimit
                );
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(Map.of(
                        "error", "Kafka payload too large",
                        "message", "Extracted document text exceeds Kafka producer payload limits. Split the document or reduce extracted text size.",
                        "documentId", documentId,
                        "payloadBytes", payloadBytes,
                        "maxAllowedBytes", safePayloadLimit
                ));
            }

            kafkaProducerService.publishDocumentEvent(event);

            // 5. Return response
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of(
                    "documentId", documentId,
                    "status", "processing",
                    "message", "Document accepted and queued for GraphRAG ingestion via Kafka.",
                    "s3Key", s3Key,
                    "filename", file.getOriginalFilename(),
                    "sizeBytes", file.getSize(),
                    "extractedCharacters", extractedText.length(),
                    "timestamp", Instant.now().toString()
            ));

        } catch (IOException | IllegalStateException e) {
            log.error(" Failed to process document upload: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "Upload failed",
                    "message", e.getMessage()
            ));
        }
    }

    private int estimateEventPayloadBytes(DocumentEvent event) {
        try {
            return objectMapper.writeValueAsBytes(event).length;
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Unable to estimate Kafka event payload size", e);
        }
    }

    /**
     * GET /api/documents/health
     * Health check endpoint for monitoring.
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
                "service", "PolicyMe Ingestion API",
                "status", "UP",
                "technology", "Java Spring Boot 3 + Apache Kafka",
                "timestamp", Instant.now().toString()
        ));
    }
}
