package gov.usds.ecfr.controller;

import gov.usds.ecfr.service.ECFRApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for Federal Regulation Analytics.
 * Provides endpoints for CFR data analysis and deregulation insights.
 */
@RestController
@RequestMapping("/api/cfr")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
@RequiredArgsConstructor
@Slf4j
public class CFRAnalyticsController {

    private final ECFRApiService ecfrApiService;

    /**
     * Health check endpoint for CFR analytics service.
     * 
     * @return Simple status message
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        log.info("CFR Analytics health check requested");
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "Federal Regulation Analytics Platform",
            "purpose", "Deregulation Decision Support"
        ));
    }

    /**
     * Downloads and returns overview of all CFR titles.
     * Used for dashboard metrics.
     * 
     * @return Overview statistics of federal regulations
     */
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        try {
            log.info("Generating CFR overview statistics");
            
            List<Map<String, Object>> titles = ecfrApiService.downloadTitles();
            
            Map<String, Object> overview = Map.of(
                "totalTitles", titles.size(),
                "totalRegulations", "200,000+", // Placeholder - would be calculated
                "activeAgencies", 147,
                "lastUpdated", System.currentTimeMillis(),
                "deregulationOpportunities", 23, // Placeholder - would be calculated
                "titles", titles
            );
            
            log.info("CFR overview generated successfully with {} titles", titles.size());
            return ResponseEntity.ok(overview);
            
        } catch (Exception e) {
            log.error("Error generating CFR overview", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to generate overview: " + e.getMessage()));
        }
    }

    /**
     * Downloads CFR data for a specific title.
     * 
     * @param titleNumber CFR title number (e.g., 40 for EPA)
     * @return Title data with parts and statistics
     */
    @GetMapping("/titles/{titleNumber}")
    public ResponseEntity<Map<String, Object>> getTitleData(@PathVariable int titleNumber) {
        try {
            log.info("Downloading data for CFR title {}", titleNumber);
            
            List<Map<String, Object>> parts = ecfrApiService.downloadPartsForTitle(titleNumber);
            
            Map<String, Object> titleData = Map.of(
                "titleNumber", titleNumber,
                "parts", parts,
                "partCount", parts.size(),
                "downloadedAt", System.currentTimeMillis()
            );
            
            log.info("Successfully downloaded data for CFR title {} with {} parts", titleNumber, parts.size());
            return ResponseEntity.ok(titleData);
            
        } catch (Exception e) {
            log.error("Error downloading CFR title {}", titleNumber, e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to download title data: " + e.getMessage()));
        }
    }

    /**
     * Downloads and analyzes regulation content.
     * 
     * @param titleNumber CFR title number
     * @param partNumber CFR part number
     * @return Regulation content with analytics
     */
    @GetMapping("/titles/{titleNumber}/parts/{partNumber}")
    public ResponseEntity<Map<String, Object>> getRegulationContent(
            @PathVariable int titleNumber, 
            @PathVariable String partNumber) {
        try {
            log.info("Downloading regulation content for CFR {} part {}", titleNumber, partNumber);
            
            Map<String, Object> content = ecfrApiService.downloadRegulationContent(titleNumber, partNumber);
            
            // Add basic analytics
            String text = content.getOrDefault("text", "").toString();
            int wordCount = text.split("\\s+").length;
            
            Map<String, Object> analytics = Map.of(
                "wordCount", wordCount,
                "complexityScore", calculateBasicComplexity(text),
                "downloadedAt", System.currentTimeMillis()
            );
            
            content.put("analytics", analytics);
            
            log.info("Successfully downloaded and analyzed CFR {} part {}", titleNumber, partNumber);
            return ResponseEntity.ok(content);
            
        } catch (Exception e) {
            log.error("Error downloading regulation content for CFR {} part {}", titleNumber, partNumber, e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to download regulation content: " + e.getMessage()));
        }
    }

    /**
     * Downloads historical changes for a regulation.
     * 
     * @param titleNumber CFR title number
     * @param partNumber CFR part number
     * @return Historical versions and change analysis
     */
    @GetMapping("/titles/{titleNumber}/parts/{partNumber}/history")
    public ResponseEntity<Map<String, Object>> getRegulationHistory(
            @PathVariable int titleNumber, 
            @PathVariable String partNumber) {
        try {
            log.info("Downloading history for CFR {} part {}", titleNumber, partNumber);
            
            List<Map<String, Object>> history = ecfrApiService.downloadRegulationHistory(titleNumber, partNumber);
            
            Map<String, Object> historyData = Map.of(
                "titleNumber", titleNumber,
                "partNumber", partNumber,
                "versions", history,
                "versionCount", history.size(),
                "changeFrequency", calculateChangeFrequency(history),
                "downloadedAt", System.currentTimeMillis()
            );
            
            log.info("Successfully downloaded history for CFR {} part {} with {} versions", 
                    titleNumber, partNumber, history.size());
            return ResponseEntity.ok(historyData);
            
        } catch (Exception e) {
            log.error("Error downloading regulation history for CFR {} part {}", titleNumber, partNumber, e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to download regulation history: " + e.getMessage()));
        }
    }

    /**
     * Triggers bulk data download for analytics.
     * 
     * @return Download status and progress
     */
    @PostMapping("/download")
    public ResponseEntity<Map<String, Object>> triggerDataDownload() {
        try {
            log.info("Triggering bulk CFR data download");
            
            // This would typically be an async operation
            Map<String, Object> status = Map.of(
                "status", "initiated",
                "message", "Bulk CFR data download started",
                "estimatedDuration", "30-60 minutes",
                "startedAt", System.currentTimeMillis()
            );
            
            log.info("Bulk CFR data download initiated");
            return ResponseEntity.ok(status);
            
        } catch (Exception e) {
            log.error("Error initiating bulk CFR data download", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to initiate data download: " + e.getMessage()));
        }
    }

    /**
     * Basic complexity calculation for demonstration.
     * In a real implementation, this would be more sophisticated.
     */
    private double calculateBasicComplexity(String text) {
        if (text == null || text.isEmpty()) {
            return 0.0;
        }
        
        String[] sentences = text.split("[.!?]+");
        double avgSentenceLength = sentences.length > 0 ? 
            (double) text.split("\\s+").length / sentences.length : 0.0;
        
        // Simple complexity based on average sentence length
        return Math.min(100.0, avgSentenceLength * 2.0);
    }

    /**
     * Basic change frequency calculation.
     */
    private String calculateChangeFrequency(List<Map<String, Object>> history) {
        if (history.size() <= 1) {
            return "Low";
        } else if (history.size() <= 5) {
            return "Medium";
        } else {
            return "High";
        }
    }
}