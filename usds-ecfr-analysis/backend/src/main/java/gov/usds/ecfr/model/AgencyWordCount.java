package gov.usds.ecfr.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing word count metrics per agency for MVP requirement.
 * Tracks total regulatory text volume by federal agency.
 */
@Entity
@Table(name = "agency_word_counts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgencyWordCount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String agencyName;

    @Column(nullable = false)
    private String agencyAcronym;

    @Column(nullable = false)
    private Long totalWordCount;

    @Column(nullable = false)
    private Integer regulationCount;

    @Column(nullable = false)
    private String checksum;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @Column
    private Integer cfrTitleNumber;

    // Calculated fields for analysis
    @Column
    private Double averageWordsPerRegulation;

    @Column
    private String regulatoryBurdenLevel; // LOW, MEDIUM, HIGH

    @Column
    private Integer redundancyScore;

    @Column
    private Integer conflictCount;

    @PrePersist
    @PreUpdate
    private void calculateMetrics() {
        if (regulationCount > 0 && totalWordCount > 0) {
            this.averageWordsPerRegulation = (double) totalWordCount / regulationCount;
        }
        
        // Determine regulatory burden level
        if (totalWordCount > 100000) {
            this.regulatoryBurdenLevel = "HIGH";
        } else if (totalWordCount > 25000) {
            this.regulatoryBurdenLevel = "MEDIUM";
        } else {
            this.regulatoryBurdenLevel = "LOW";
        }
    }
}