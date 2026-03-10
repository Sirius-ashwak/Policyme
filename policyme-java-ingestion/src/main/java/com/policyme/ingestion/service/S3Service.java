package com.policyme.ingestion.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.UUID;

/**
 * AWS S3 Service for uploading policy documents.
 * Falls back to a mock/local mode if AWS credentials are not configured.
 */
@Service
public class S3Service {

    private static final Logger log = LoggerFactory.getLogger(S3Service.class);

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.s3.access-key:}")
    private String accessKey;

    @Value("${aws.s3.secret-key:}")
    private String secretKey;

    private S3Client s3Client;
    private boolean mockMode = false;

    @PostConstruct
    public void init() {
        if (accessKey == null || accessKey.isBlank()) {
            log.warn("⚠️ AWS credentials not configured. Running in MOCK S3 mode.");
            mockMode = true;
            return;
        }

        try {
            s3Client = S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKey, secretKey)))
                    .build();
            log.info("✅ AWS S3 Client initialized for bucket: {}", bucketName);
        } catch (Exception e) {
            log.warn("⚠️ Failed to initialize AWS S3 Client. Running in MOCK mode. Error: {}", e.getMessage());
            mockMode = true;
        }
    }

    /**
     * Upload a file to S3 and return the generated S3 key.
     *
     * @param file The multipart file to upload
     * @return The S3 object key
     */
    public String uploadFile(MultipartFile file) throws IOException {
        String s3Key = "policies/" + UUID.randomUUID() + "/" + file.getOriginalFilename();

        if (mockMode) {
            log.info("📦 [MOCK S3] Would upload file '{}' to s3://{}/{}", 
                    file.getOriginalFilename(), bucketName, s3Key);
            return s3Key;
        }

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        log.info("✅ Uploaded '{}' to s3://{}/{}", file.getOriginalFilename(), bucketName, s3Key);

        return s3Key;
    }

    public String getBucketName() {
        return bucketName;
    }
}
