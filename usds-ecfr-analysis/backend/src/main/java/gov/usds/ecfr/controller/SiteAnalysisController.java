package gov.usds.ecfr.controller;

import gov.usds.ecfr.model.SiteAnalysisResult;
import gov.usds.ecfr.service.SiteAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

/**
 * REST controller for site analysis operations.
 * Provides endpoints to analyze the eCFR website for various metrics.
 */
@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@Slf4j
public class SiteAnalysisController {

    private final SiteAnalysisService siteAnalysisService;

    /**
     * Analyzes the eCFR website and returns comprehensive metrics.
     * 
     * @param url Optional URL parameter, defaults to eCFR main page
     * @return SiteAnalysisResult containing all analysis metrics
     */
    @GetMapping("/analyze")
    public ResponseEntity<SiteAnalysisResult> analyzeSite(
            @RequestParam(defaultValue = "https://www.ecfr.gov/") String url) {
        
        log.info("Starting site analysis for URL: {}", url);
        
        try {
            SiteAnalysisResult result = siteAnalysisService.analyzeSite(url);
            log.info("Site analysis completed successfully for URL: {}", url);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error analyzing site: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Performs asynchronous analysis of the eCFR website.
     * Useful for long-running analysis tasks.
     * 
     * @param url Optional URL parameter, defaults to eCFR main page
     * @return CompletableFuture with analysis results
     */
    @PostMapping("/analyze-async")
    public CompletableFuture<ResponseEntity<SiteAnalysisResult>> analyzeSiteAsync(
            @RequestParam(defaultValue = "https://www.ecfr.gov/") String url) {
        
        log.info("Starting async site analysis for URL: {}", url);
        
        return siteAnalysisService.analyzeSiteAsync(url)
                .thenApply(result -> {
                    log.info("Async site analysis completed successfully for URL: {}", url);
                    return ResponseEntity.ok(result);
                })
                .exceptionally(throwable -> {
                    log.error("Error in async site analysis: {}", throwable.getMessage(), throwable);
                    return ResponseEntity.internalServerError().build();
                });
    }

    /**
     * Health check endpoint for the analysis service.
     * 
     * @return Simple status message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("eCFR Site Analysis Service is running");
    }
}