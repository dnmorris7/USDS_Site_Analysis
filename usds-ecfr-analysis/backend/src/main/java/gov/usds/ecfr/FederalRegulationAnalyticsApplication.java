package gov.usds.ecfr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Federal Regulation Analytics Platform - USDS Assessment MVP
 * 
 * Core MVP Features:
 * - Download current eCFR data from government APIs and store server-side
 * - Calculate WORD COUNT PER AGENCY for regulatory burden analysis
 * - Track HISTORICAL CHANGES OVER TIME for trend analysis
 * - Generate CHECKSUM for each agency for data integrity verification
 * - Detect regulation redundancy and conflicts (custom metrics)
 * 
 * UI Features:
 * - Hover tooltips showing core metrics (Word Count, Changes, Redundancy)
 * - "Detailed Analysis" pages with agency comparison charts
 * - Regulation growth trends since last two congressional years
 * - Deregulation opportunities identification
 * 
 * Purpose: Support deregulation decision-making across 200k+ pages of federal regulations
 */
@SpringBootApplication
@EnableAsync
public class FederalRegulationAnalyticsApplication {

    public static void main(String[] args) {
        SpringApplication.run(FederalRegulationAnalyticsApplication.class, args);
    }
}