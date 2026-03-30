package com.policyme.ingestion.controller;

import com.policyme.ingestion.model.DocumentEvent;
import com.policyme.ingestion.service.KafkaProducerService;
import com.policyme.ingestion.service.S3Service;
import com.policyme.ingestion.service.TextExtractionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    public DocumentUploadController(S3Service s3Service,
                                    KafkaProducerService kafkaProducerService,
                                    TextExtractionService textExtractionService) {
        this.s3Service = s3Service;
        this.kafkaProducerService = kafkaProducerService;
        this.textExtractionService = textExtractionService;
    }

    /**
     * POST /api/documents/upload
     * Accepts a multipart file upload (PDF/DOCX, max 50MB).
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
                    "message", "Please upload a PDF or DOCX file."
            ));
        }

        if (!textExtractionService.isSupportedFileType(file.getContentType())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Unsupported file type",
                    "message", "Only PDF and DOCX files are supported. Received: " + file.getContentType()
            ));
        }

        String documentId = "DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info(" Received upload request: '{}' ({}), assigned ID: {}",
                file.getOriginalFilename(), file.getContentType(), documentId);

        try {
            // 2. Upload to S3
            String s3Key = s3Service.uploadFile(file);

            // 3. Extract text
            String extractedText = "";
            if ("application/pdf".equals(file.getContentType())) {
                extractedText = textExtractionService.extractTextFromPdf(file);
            }
            // Truncate for Kafka payload (full text stored in S3)
            String textPreview = extractedText.length() > 5000 
                    ? extractedText.substring(0, 5000) + "...[TRUNCATED]" 
                    : extractedText;

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
            event.setExtractedText(textPreview);

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

        } catch (IOException e) {
            log.error(" Failed to process document upload: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "Upload failed",
                    "message", e.getMessage()
            ));
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
