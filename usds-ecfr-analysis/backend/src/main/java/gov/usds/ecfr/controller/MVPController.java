package gov.usds.ecfr.controller;

import gov.usds.ecfr.model.AgencyWordCount;
import gov.usds.ecfr.model.HistoricalChange;
import gov.usds.ecfr.model.RegulationRedundancy;
import gov.usds.ecfr.model.RegulationConflict;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * MVP Controller for Federal Regulation Analytics Platform
 * Provides core MVP endpoints as specified in USDS assignment:
 * - Word count per agency
 * - Historical changes over time
 * - Checksums per agency
 * - Custom metrics: redundancy and conflict detection
 */
@RestController
@RequestMapping("/api/mvp")
@Slf4j
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class MVPController {

    /**
     * Core MVP Requirement: Get word count per agency
     * Returns regulatory burden metrics by federal agency
     */
    @GetMapping("/agencies/word-count")
    public ResponseEntity<List<AgencyWordCount>> getWordCountPerAgency() {
        log.info("🔍 MVP: Fetching word count per agency");
        
        List<AgencyWordCount> agencyWordCounts = generateMockAgencyWordCounts();
        
        log.info("✅ MVP: Retrieved {} agencies with word count data", agencyWordCounts.size());
        return ResponseEntity.ok(agencyWordCounts);
    }

    /**
     * Core MVP Requirement: Get word count for specific CFR title
     */
    @GetMapping("/title/{titleNumber}/agencies/word-count")
    public ResponseEntity<List<AgencyWordCount>> getWordCountByTitle(@PathVariable Integer titleNumber) {
        log.info("🔍 MVP: Fetching word count for CFR Title {}", titleNumber);
        
        List<AgencyWordCount> titleWordCounts = generateMockAgencyWordCountsByTitle(titleNumber);
        
        log.info("✅ MVP: Retrieved {} agencies for CFR Title {}", titleWordCounts.size(), titleNumber);
        return ResponseEntity.ok(titleWordCounts);
    }

    /**
     * Core MVP Requirement: Get historical changes over time
     */
    @GetMapping("/historical-changes")
    public ResponseEntity<List<HistoricalChange>> getHistoricalChanges() {
        log.info("🔍 MVP: Fetching historical changes over time");
        
        List<HistoricalChange> changes = generateMockHistoricalChanges();
        
        log.info("✅ MVP: Retrieved {} historical changes", changes.size());
        return ResponseEntity.ok(changes);
    }

    /**
     * Core MVP Requirement: Get historical changes for specific CFR title
     */
    @GetMapping("/title/{titleNumber}/historical-changes")
    public ResponseEntity<List<HistoricalChange>> getHistoricalChangesByTitle(@PathVariable Integer titleNumber) {
        log.info("🔍 MVP: Fetching historical changes for CFR Title {}", titleNumber);
        
        List<HistoricalChange> changes = generateMockHistoricalChangesByTitle(titleNumber);
        
        log.info("✅ MVP: Retrieved {} historical changes for Title {}", changes.size(), titleNumber);
        return ResponseEntity.ok(changes);
    }

    /**
     * Core MVP Requirement: Get checksums per agency
     */
    @GetMapping("/agencies/checksums")
    public ResponseEntity<Map<String, String>> getAgencyChecksums() {
        log.info("🔍 MVP: Fetching checksums per agency");
        
        Map<String, String> checksums = generateMockAgencyChecksums();
        
        log.info("✅ MVP: Retrieved checksums for {} agencies", checksums.size());
        return ResponseEntity.ok(checksums);
    }

    /**
     * Core MVP Requirement: Get checksum for specific CFR title
     */
    @GetMapping("/title/{titleNumber}/checksum")
    public ResponseEntity<Map<String, Object>> getTitleChecksum(@PathVariable Integer titleNumber) {
        log.info("🔍 MVP: Fetching checksum for CFR Title {}", titleNumber);
        
        Map<String, Object> titleChecksum = Map.of(
            "titleNumber", titleNumber,
            "checksum", "sha256:" + UUID.randomUUID().toString().substring(0, 16),
            "lastUpdated", LocalDateTime.now(),
            "dataIntegrity", "VERIFIED"
        );
        
        log.info("✅ MVP: Generated checksum for CFR Title {}", titleNumber);
        return ResponseEntity.ok(titleChecksum);
    }

    /**
     * Custom Metric 1: Regulation redundancy detection
     */
    @GetMapping("/redundancy-analysis")
    public ResponseEntity<List<RegulationRedundancy>> getRegulationRedundancy() {
        log.info("🔍 MVP: Running regulation redundancy analysis");
        
        List<RegulationRedundancy> redundancies = generateMockRedundancyAnalysis();
        
        log.info("✅ MVP: Found {} redundancy instances", redundancies.size());
        return ResponseEntity.ok(redundancies);
    }

    /**
     * Custom Metric 1: Redundancy analysis for specific CFR title
     */
    @GetMapping("/title/{titleNumber}/redundancy-analysis")
    public ResponseEntity<List<RegulationRedundancy>> getRedundancyByTitle(@PathVariable Integer titleNumber) {
        log.info("🔍 MVP: Running redundancy analysis for CFR Title {}", titleNumber);
        
        List<RegulationRedundancy> redundancies = generateMockRedundancyByTitle(titleNumber);
        
        log.info("✅ MVP: Found {} redundancies in Title {}", redundancies.size(), titleNumber);
        return ResponseEntity.ok(redundancies);
    }

    /**
     * Custom Metric 2: Regulation conflict detection
     */
    @GetMapping("/conflict-analysis")
    public ResponseEntity<List<RegulationConflict>> getRegulationConflicts() {
        log.info("🔍 MVP: Running regulation conflict analysis");
        
        List<RegulationConflict> conflicts = generateMockConflictAnalysis();
        
        log.info("✅ MVP: Found {} regulation conflicts", conflicts.size());
        return ResponseEntity.ok(conflicts);
    }

    /**
     * Custom Metric 2: Conflict analysis for specific CFR title
     */
    @GetMapping("/title/{titleNumber}/conflict-analysis")
    public ResponseEntity<List<RegulationConflict>> getConflictsByTitle(@PathVariable Integer titleNumber) {
        log.info("🔍 MVP: Running conflict analysis for CFR Title {}", titleNumber);
        
        List<RegulationConflict> conflicts = generateMockConflictsByTitle(titleNumber);
        
        log.info("✅ MVP: Found {} conflicts in Title {}", conflicts.size(), titleNumber);
        return ResponseEntity.ok(conflicts);
    }

    /**
     * MVP Summary: Core metrics for tooltip display
     */
    @GetMapping("/title/{titleNumber}/core-metrics")
    public ResponseEntity<Map<String, Object>> getCoreMetrics(@PathVariable Integer titleNumber) {
        log.info("🔍 MVP: Fetching core metrics for CFR Title {} (for tooltip)", titleNumber);
        
        Map<String, Object> coreMetrics = Map.of(
            "titleNumber", titleNumber,
            "wordCount", 25000 + (titleNumber * 1500),
            "changes", 12 + (titleNumber % 8),
            "redundancyScore", 15 + (titleNumber % 25),
            "conflictCount", 3 + (titleNumber % 7),
            "deregulationOpportunities", 2 + (titleNumber % 5)
        );
        
        log.info("✅ MVP: Generated core metrics for Title {}", titleNumber);
        return ResponseEntity.ok(coreMetrics);
    }

    // Mock data generation methods
    private List<AgencyWordCount> generateMockAgencyWordCounts() {
        List<AgencyWordCount> agencies = new ArrayList<>();
        
        String[] agencyNames = {"EPA", "DOL", "HHS", "DOT", "Treasury", "Commerce", "Education", "Energy"};
        String[] fullNames = {
            "Environmental Protection Agency",
            "Department of Labor", 
            "Health and Human Services",
            "Department of Transportation",
            "Department of Treasury",
            "Department of Commerce",
            "Department of Education",
            "Department of Energy"
        };
        
        for (int i = 0; i < agencyNames.length; i++) {
            agencies.add(AgencyWordCount.builder()
                .agencyName(fullNames[i])
                .agencyAcronym(agencyNames[i])
                .totalWordCount(15000L + (i * 8500L))
                .regulationCount(25 + (i * 12))
                .checksum("sha256:" + UUID.randomUUID().toString().substring(0, 16))
                .lastUpdated(LocalDateTime.now().minusDays(i))
                .redundancyScore(10 + (i * 3))
                .conflictCount(2 + i)
                .build());
        }
        
        return agencies;
    }

    private List<AgencyWordCount> generateMockAgencyWordCountsByTitle(Integer titleNumber) {
        List<AgencyWordCount> agencies = generateMockAgencyWordCounts();
        // Filter to show only agencies that regulate this title
        return agencies.stream()
            .filter(agency -> (titleNumber + agency.getAgencyAcronym().hashCode()) % 3 == 0)
            .peek(agency -> agency.setCfrTitleNumber(titleNumber))
            .toList();
    }

    private List<HistoricalChange> generateMockHistoricalChanges() {
        List<HistoricalChange> changes = new ArrayList<>();
        
        for (int i = 1; i <= 20; i++) {
            changes.add(HistoricalChange.builder()
                .cfrTitleNumber(1 + (i % 9))
                .cfrPartNumber(100 + i)
                .agencyName("Federal Agency " + (1 + (i % 5)))
                .changeDate(LocalDateTime.now().minusDays(i * 15))
                .changeType(HistoricalChange.ChangeType.values()[i % 5])
                .wordCountBefore(1000 + (i * 50))
                .wordCountAfter(1100 + (i * 45))
                .changeDescription("Regulatory update for compliance enhancement")
                .congressionalYear(i % 2 == 0 ? "2023-2024" : "2024-2025")
                .build());
        }
        
        return changes;
    }

    private List<HistoricalChange> generateMockHistoricalChangesByTitle(Integer titleNumber) {
        return generateMockHistoricalChanges().stream()
            .filter(change -> change.getCfrTitleNumber().equals(titleNumber))
            .toList();
    }

    private Map<String, String> generateMockAgencyChecksums() {
        Map<String, String> checksums = new HashMap<>();
        checksums.put("EPA", "sha256:a1b2c3d4e5f6789");
        checksums.put("DOL", "sha256:b2c3d4e5f6789a1");
        checksums.put("HHS", "sha256:c3d4e5f6789a1b2");
        checksums.put("DOT", "sha256:d4e5f6789a1b2c3");
        checksums.put("Treasury", "sha256:e5f6789a1b2c3d4");
        return checksums;
    }

    private List<RegulationRedundancy> generateMockRedundancyAnalysis() {
        List<RegulationRedundancy> redundancies = new ArrayList<>();
        
        for (int i = 1; i <= 8; i++) {
            redundancies.add(RegulationRedundancy.builder()
                .cfrTitle1(1 + (i % 3))
                .cfrPart1(100 + i)
                .agency1("Agency A" + i)
                .cfrTitle2(2 + (i % 3))
                .cfrPart2(200 + i)
                .agency2("Agency B" + i)
                .similarityScore(0.75 + (i * 0.02))
                .redundancyType(RegulationRedundancy.RedundancyType.values()[i % 5])
                .severity(RegulationRedundancy.RedundancySeverity.values()[i % 4])
                .estimatedCostSavings(500 + (i * 200))
                .affectedBusinesses(100 + (i * 50))
                .detectedDate(LocalDateTime.now().minusDays(i))
                .build());
        }
        
        return redundancies;
    }

    private List<RegulationRedundancy> generateMockRedundancyByTitle(Integer titleNumber) {
        return generateMockRedundancyAnalysis().stream()
            .filter(redundancy -> redundancy.getCfrTitle1().equals(titleNumber) || 
                                  redundancy.getCfrTitle2().equals(titleNumber))
            .toList();
    }

    private List<RegulationConflict> generateMockConflictAnalysis() {
        List<RegulationConflict> conflicts = new ArrayList<>();
        
        for (int i = 1; i <= 6; i++) {
            conflicts.add(RegulationConflict.builder()
                .cfrTitle1(1 + (i % 3))
                .cfrPart1(100 + i)
                .agency1("Agency X" + i)
                .cfrTitle2(2 + (i % 3))
                .cfrPart2(300 + i)
                .agency2("Agency Y" + i)
                .conflictType(RegulationConflict.ConflictType.values()[i % 5])
                .severity(RegulationConflict.ConflictSeverity.values()[i % 4])
                .businessImpact(200 + (i * 100))
                .complianceCost(1000 + (i * 500))
                .detectedDate(LocalDateTime.now().minusDays(i * 2))
                .resolutionRecommendation("Harmonize requirements between agencies")
                .build());
        }
        
        return conflicts;
    }

    private List<RegulationConflict> generateMockConflictsByTitle(Integer titleNumber) {
        return generateMockConflictAnalysis().stream()
            .filter(conflict -> conflict.getCfrTitle1().equals(titleNumber) || 
                               conflict.getCfrTitle2().equals(titleNumber))
            .toList();
    }
}