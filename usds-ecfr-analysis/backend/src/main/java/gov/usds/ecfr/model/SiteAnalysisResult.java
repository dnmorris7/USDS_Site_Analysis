package gov.usds.ecfr.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Model representing the complete analysis result of a website.
 * Contains accessibility, performance, usability, and technical metrics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteAnalysisResult {
    
    private String url;
    private LocalDateTime analyzedAt;
    private Long responseTimeMs;
    private Integer statusCode;
    
    // Accessibility Metrics
    private AccessibilityMetrics accessibility;
    
    // Performance Metrics
    private PerformanceMetrics performance;
    
    // Content Analysis
    private ContentAnalysis content;
    
    // Technical Analysis
    private TechnicalAnalysis technical;
    
    // Usability Analysis
    private UsabilityAnalysis usability;
    
    // Government-specific compliance
    private GovernmentCompliance compliance;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccessibilityMetrics {
        private Integer wcagLevel; // 1, 2, or 3 for A, AA, AAA
        private List<String> issues;
        private Integer score; // 0-100
        private Map<String, Object> details;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PerformanceMetrics {
        private Long loadTimeMs;
        private Integer pageSizeBytes;
        private Integer numberOfRequests;
        private Integer imageCount;
        private Integer scriptCount;
        private Integer stylesheetCount;
        private Integer score; // 0-100
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContentAnalysis {
        private String title;
        private String description;
        private Integer headingCount;
        private Integer linkCount;
        private Integer imageCount;
        private Integer wordCount;
        private List<String> languages;
        private Boolean hasSearchFunctionality;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TechnicalAnalysis {
        private String doctype;
        private Boolean isHttps;
        private Boolean hasCsp; // Content Security Policy
        private Boolean hasRobotsTxt;
        private Boolean hasSitemap;
        private List<String> technologies;
        private Map<String, String> metaTags;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsabilityAnalysis {
        private Boolean mobileResponsive;
        private Boolean hasNavigation;
        private Boolean hasBreadcrumbs;
        private Boolean hasSkipLinks;
        private Integer navigationDepth;
        private Integer score; // 0-100
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GovernmentCompliance {
        private Boolean section508Compliant;
        private Boolean hasPrivacyPolicy;
        private Boolean hasAccessibilityStatement;
        private Boolean hasFoia; // Freedom of Information Act
        private Boolean hasContact;
        private Integer complianceScore; // 0-100
        private List<String> recommendations;
    }
}