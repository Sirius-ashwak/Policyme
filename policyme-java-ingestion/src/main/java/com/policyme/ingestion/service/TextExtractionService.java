package com.policyme.ingestion.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Text extraction service using Apache PDFBox 3.x.
 * Extracts raw text from uploaded PDF policy documents.
 */
@Service
public class TextExtractionService {

    private static final Logger log = LoggerFactory.getLogger(TextExtractionService.class);

    /**
     * Extract text content from an uploaded PDF file.
     *
     * @param file The multipart PDF file
     * @return The extracted text content
     */
    public String extractTextFromPdf(MultipartFile file) throws IOException {
        log.info("📄 Extracting text from PDF: {} ({} bytes)", file.getOriginalFilename(), file.getSize());

        try (PDDocument document = Loader.loadPDF(file.getInputStream().readAllBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            log.info("✅ Extracted {} characters from {} pages",
                    text.length(), document.getNumberOfPages());
            return text;
        }
    }

    /**
     * Check if the file is a supported document type.
     */
    public boolean isSupportedFileType(String contentType) {
        return contentType != null && (
                contentType.equals("application/pdf") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        );
    }
}
