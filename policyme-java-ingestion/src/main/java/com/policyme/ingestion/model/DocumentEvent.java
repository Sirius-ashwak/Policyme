package com.policyme.ingestion.model;

import java.time.Instant;

/**
 * Event payload published to Kafka when a document is uploaded.
 * The Python GraphRAG consumer will pick this up for processing.
 */
public class DocumentEvent {

    private String documentId;
    private String originalFilename;
    private String contentType;
    private long fileSizeBytes;
    private String s3Key;
    private String s3Bucket;
    private String uploadedBy;
    private String extractedText;
    private Instant timestamp;

    public DocumentEvent() {
        this.timestamp = Instant.now();
    }

    public DocumentEvent(String documentId, String originalFilename, String contentType,
                         long fileSizeBytes, String s3Key, String s3Bucket, String uploadedBy) {
        this.documentId = documentId;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.fileSizeBytes = fileSizeBytes;
        this.s3Key = s3Key;
        this.s3Bucket = s3Bucket;
        this.uploadedBy = uploadedBy;
        this.timestamp = Instant.now();
    }

    // --- Getters and Setters ---

    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }

    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public String getS3Key() { return s3Key; }
    public void setS3Key(String s3Key) { this.s3Key = s3Key; }

    public String getS3Bucket() { return s3Bucket; }
    public void setS3Bucket(String s3Bucket) { this.s3Bucket = s3Bucket; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    @Override
    public String toString() {
        return "DocumentEvent{" +
                "documentId='" + documentId + '\'' +
                ", originalFilename='" + originalFilename + '\'' +
                ", contentType='" + contentType + '\'' +
                ", fileSizeBytes=" + fileSizeBytes +
                ", s3Key='" + s3Key + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
