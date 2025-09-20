package gov.usds.ecfr.service;

import gov.usds.ecfr.model.SiteAnalysisResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;

/**
 * Service for analyzing websites, specifically designed for government sites like eCFR.
 * Performs comprehensive analysis including accessibility, performance, and compliance checks.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SiteAnalysisService {

    private static final int CONNECTION_TIMEOUT = 10000; // 10 seconds
    private static final String USER_AGENT = "USDS Site Analysis Tool/1.0";

    /**
     * Performs synchronous site analysis
     */
    public SiteAnalysisResult analyzeSite(String url) {
        log.info("Starting synchronous analysis for URL: {}", url);
        
        long startTime = System.currentTimeMillis();
        
        try {
            // Fetch the webpage
            Document document = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(CONNECTION_TIMEOUT)
                    .get();
            
            long responseTime = System.currentTimeMillis() - startTime;
            
            // Perform various analyses
            SiteAnalysisResult.AccessibilityMetrics accessibility = analyzeAccessibility(document);
            SiteAnalysisResult.PerformanceMetrics performance = analyzePerformance(document, responseTime);
            SiteAnalysisResult.ContentAnalysis content = analyzeContent(document);
            SiteAnalysisResult.TechnicalAnalysis technical = analyzeTechnical(document, url);
            SiteAnalysisResult.UsabilityAnalysis usability = analyzeUsability(document);
            SiteAnalysisResult.GovernmentCompliance compliance = analyzeGovernmentCompliance(document);
            
            return SiteAnalysisResult.builder()
                    .url(url)
                    .analyzedAt(LocalDateTime.now())
                    .responseTimeMs(responseTime)
                    .statusCode(200) // Jsoup would throw exception if not successful
                    .accessibility(accessibility)
                    .performance(performance)
                    .content(content)
                    .technical(technical)
                    .usability(usability)
                    .compliance(compliance)
                    .build();
                    
        } catch (IOException e) {
            log.error("Error fetching URL {}: {}", url, e.getMessage());
            throw new RuntimeException("Failed to analyze site: " + e.getMessage(), e);
        }
    }

    /**
     * Performs asynchronous site analysis
     */
    @Async
    public CompletableFuture<SiteAnalysisResult> analyzeSiteAsync(String url) {
        log.info("Starting asynchronous analysis for URL: {}", url);
        return CompletableFuture.completedFuture(analyzeSite(url));
    }

    private SiteAnalysisResult.AccessibilityMetrics analyzeAccessibility(Document document) {
        List<String> issues = new ArrayList<>();
        int score = 100;
        
        // Check for alt attributes on images
        Elements images = document.select("img");
        int imagesWithoutAlt = 0;
        for (Element img : images) {
            if (!img.hasAttr("alt") || img.attr("alt").trim().isEmpty()) {
                imagesWithoutAlt++;
            }
        }
        if (imagesWithoutAlt > 0) {
            issues.add(imagesWithoutAlt + " images missing alt text");
            score -= Math.min(20, imagesWithoutAlt * 5);
        }
        
        // Check for heading structure
        Elements headings = document.select("h1, h2, h3, h4, h5, h6");
        if (headings.size() == 0) {
            issues.add("No heading elements found");
            score -= 15;
        }
        
        // Check for skip links
        Elements skipLinks = document.select("a[href^='#']");
        boolean hasSkipLinks = skipLinks.stream()
                .anyMatch(link -> link.text().toLowerCase().contains("skip"));
        if (!hasSkipLinks) {
            issues.add("No skip navigation links found");
            score -= 10;
        }
        
        // Check for form labels
        Elements inputs = document.select("input[type=text], input[type=email], input[type=password], textarea, select");
        int inputsWithoutLabels = 0;
        for (Element input : inputs) {
            String id = input.attr("id");
            if (id.isEmpty() || document.select("label[for=" + id + "]").isEmpty()) {
                inputsWithoutLabels++;
            }
        }
        if (inputsWithoutLabels > 0) {
            issues.add(inputsWithoutLabels + " form inputs missing proper labels");
            score -= Math.min(15, inputsWithoutLabels * 3);
        }
        
        // Check for proper color contrast (basic check for dark/light themes)
        String bodyStyle = document.select("body").attr("style");
        if (!bodyStyle.contains("background") && !bodyStyle.contains("color")) {
            // This is a simplified check - in real implementation, you'd use more sophisticated contrast analysis
            issues.add("No explicit color scheme defined - may affect contrast");
            score -= 5;
        }
        
        Map<String, Object> details = new HashMap<>();
        details.put("totalImages", images.size());
        details.put("imagesWithoutAlt", imagesWithoutAlt);
        details.put("totalHeadings", headings.size());
        details.put("hasSkipLinks", hasSkipLinks);
        details.put("inputsWithoutLabels", inputsWithoutLabels);
        
        return SiteAnalysisResult.AccessibilityMetrics.builder()
                .wcagLevel(score >= 80 ? 2 : (score >= 60 ? 1 : 0))
                .issues(issues)
                .score(Math.max(0, score))
                .details(details)
                .build();
    }

    private SiteAnalysisResult.PerformanceMetrics analyzePerformance(Document document, long loadTime) {
        Elements images = document.select("img");
        Elements scripts = document.select("script[src]");
        Elements stylesheets = document.select("link[rel=stylesheet]");
        Elements allElements = document.select("*");
        
        // Estimate page size (simplified)
        int estimatedSize = document.html().length();
        int numberOfRequests = 1 + images.size() + scripts.size() + stylesheets.size();
        
        // Calculate performance score
        int score = 100;
        if (loadTime > 3000) score -= 20;
        if (loadTime > 5000) score -= 20;
        if (numberOfRequests > 50) score -= 15;
        if (images.size() > 20) score -= 10;
        if (estimatedSize > 1000000) score -= 15; // > 1MB
        
        return SiteAnalysisResult.PerformanceMetrics.builder()
                .loadTimeMs(loadTime)
                .pageSizeBytes(estimatedSize)
                .numberOfRequests(numberOfRequests)
                .imageCount(images.size())
                .scriptCount(scripts.size())
                .stylesheetCount(stylesheets.size())
                .score(Math.max(0, score))
                .build();
    }

    private SiteAnalysisResult.ContentAnalysis analyzeContent(Document document) {
        String title = document.title();
        String description = "";
        Element metaDesc = document.selectFirst("meta[name=description]");
        if (metaDesc != null) {
            description = metaDesc.attr("content");
        }
        
        Elements headings = document.select("h1, h2, h3, h4, h5, h6");
        Elements links = document.select("a[href]");
        Elements images = document.select("img");
        
        // Count words in text content
        String text = document.text();
        int wordCount = text.split("\\s+").length;
        
        // Check for languages
        List<String> languages = new ArrayList<>();
        String htmlLang = document.select("html").attr("lang");
        if (!htmlLang.isEmpty()) {
            languages.add(htmlLang);
        }
        
        // Check for search functionality
        boolean hasSearch = !document.select("input[type=search], input[name*=search], form[action*=search]").isEmpty();
        
        return SiteAnalysisResult.ContentAnalysis.builder()
                .title(title)
                .description(description)
                .headingCount(headings.size())
                .linkCount(links.size())
                .imageCount(images.size())
                .wordCount(wordCount)
                .languages(languages)
                .hasSearchFunctionality(hasSearch)
                .build();
    }

    private SiteAnalysisResult.TechnicalAnalysis analyzeTechnical(Document document, String url) {
        String doctype = document.documentType() != null ? 
                document.documentType().toString() : "No DOCTYPE found";
        
        boolean isHttps = url.startsWith("https://");
        
        // Check for CSP header (would need actual HTTP response headers)
        boolean hasCsp = !document.select("meta[http-equiv=Content-Security-Policy]").isEmpty();
        
        // Check common meta tags
        Map<String, String> metaTags = new HashMap<>();
        Elements metas = document.select("meta");
        for (Element meta : metas) {
            String name = meta.attr("name");
            String property = meta.attr("property");
            String content = meta.attr("content");
            
            if (!name.isEmpty()) {
                metaTags.put(name, content);
            } else if (!property.isEmpty()) {
                metaTags.put(property, content);
            }
        }
        
        // Detect technologies (simplified)
        List<String> technologies = new ArrayList<>();
        if (!document.select("[data-drupal-selector]").isEmpty()) {
            technologies.add("Drupal");
        }
        if (!document.select("[data-react-root]").isEmpty()) {
            technologies.add("React");
        }
        if (!document.select("script[src*=jquery]").isEmpty()) {
            technologies.add("jQuery");
        }
        if (!document.select("link[href*=bootstrap]").isEmpty()) {
            technologies.add("Bootstrap");
        }
        
        return SiteAnalysisResult.TechnicalAnalysis.builder()
                .doctype(doctype)
                .isHttps(isHttps)
                .hasCsp(hasCsp)
                .hasRobotsTxt(false) // Would need separate request
                .hasSitemap(false) // Would need separate request
                .technologies(technologies)
                .metaTags(metaTags)
                .build();
    }

    private SiteAnalysisResult.UsabilityAnalysis analyzeUsability(Document document) {
        // Check for mobile responsiveness indicators
        boolean mobileResponsive = !document.select("meta[name=viewport]").isEmpty();
        
        // Check for navigation
        boolean hasNavigation = !document.select("nav, [role=navigation]").isEmpty();
        
        // Check for breadcrumbs
        boolean hasBreadcrumbs = !document.select("[aria-label*=breadcrumb], .breadcrumb, .breadcrumbs").isEmpty();
        
        // Check for skip links
        boolean hasSkipLinks = document.select("a[href^='#']").stream()
                .anyMatch(link -> link.text().toLowerCase().contains("skip"));
        
        // Calculate navigation depth (simplified)
        Elements navLinks = document.select("nav a, [role=navigation] a");
        int navigationDepth = navLinks.size() > 0 ? 3 : 0; // Simplified calculation
        
        // Calculate usability score
        int score = 60; // Base score
        if (mobileResponsive) score += 15;
        if (hasNavigation) score += 10;
        if (hasBreadcrumbs) score += 5;
        if (hasSkipLinks) score += 10;
        
        return SiteAnalysisResult.UsabilityAnalysis.builder()
                .mobileResponsive(mobileResponsive)
                .hasNavigation(hasNavigation)
                .hasBreadcrumbs(hasBreadcrumbs)
                .hasSkipLinks(hasSkipLinks)
                .navigationDepth(navigationDepth)
                .score(Math.min(100, score))
                .build();
    }

    private SiteAnalysisResult.GovernmentCompliance analyzeGovernmentCompliance(Document document) {
        String bodyText = document.text().toLowerCase();
        
        // Check for Section 508 compliance
        boolean section508Compliant = bodyText.contains("section 508") || 
                bodyText.contains("accessibility");
        
        // Check for privacy policy
        boolean hasPrivacyPolicy = bodyText.contains("privacy policy") || 
                !document.select("a[href*=privacy]").isEmpty();
        
        // Check for accessibility statement
        boolean hasAccessibilityStatement = bodyText.contains("accessibility statement") ||
                bodyText.contains("accessibility policy");
        
        // Check for FOIA information
        boolean hasFoia = bodyText.contains("foia") || 
                bodyText.contains("freedom of information");
        
        // Check for contact information
        boolean hasContact = bodyText.contains("contact") || 
                !document.select("a[href^=mailto], a[href*=contact]").isEmpty();
        
        List<String> recommendations = new ArrayList<>();
        int complianceScore = 0;
        
        if (section508Compliant) {
            complianceScore += 25;
        } else {
            recommendations.add("Add Section 508 accessibility compliance information");
        }
        
        if (hasPrivacyPolicy) {
            complianceScore += 20;
        } else {
            recommendations.add("Add privacy policy link");
        }
        
        if (hasAccessibilityStatement) {
            complianceScore += 20;
        } else {
            recommendations.add("Add accessibility statement");
        }
        
        if (hasFoia) {
            complianceScore += 15;
        } else {
            recommendations.add("Add FOIA information");
        }
        
        if (hasContact) {
            complianceScore += 20;
        } else {
            recommendations.add("Add clear contact information");
        }
        
        return SiteAnalysisResult.GovernmentCompliance.builder()
                .section508Compliant(section508Compliant)
                .hasPrivacyPolicy(hasPrivacyPolicy)
                .hasAccessibilityStatement(hasAccessibilityStatement)
                .hasFoia(hasFoia)
                .hasContact(hasContact)
                .complianceScore(complianceScore)
                .recommendations(recommendations)
                .build();
    }
}