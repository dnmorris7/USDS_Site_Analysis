package gov.usds.ecfr.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity for detecting regulation redundancy - custom metric for MVP.
 * Identifies duplicate or overlapping regulatory requirements.
 */
@Entity
@Table(name = "regulation_redundancy")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegulationRedundancy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer cfrTitle1;

    @Column(nullable = false)
    private Integer cfrPart1;

    @Column(nullable = false)
    private String agency1;

    @Column(nullable = false)
    private Integer cfrTitle2;

    @Column(nullable = false)
    private Integer cfrPart2;

    @Column(nullable = false)
    private String agency2;

    @Column(nullable = false)
    private Double similarityScore; // 0.0 to 1.0

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RedundancyType redundancyType;

    @Column(length = 1000)
    private String redundancyDescription;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RedundancySeverity severity;

    @Column
    private Integer estimatedCostSavings; // In thousands of dollars

    @Column
    private Integer affectedBusinesses;

    @Column(nullable = false)
    private LocalDateTime detectedDate;

    @Column
    private Boolean resolved = false;

    @Column
    private String resolutionAction;

    public enum RedundancyType {
        EXACT_DUPLICATE,
        SUBSTANTIAL_OVERLAP,
        CONFLICTING_REQUIREMENTS,
        OUTDATED_SUPERSEDED,
        CROSS_AGENCY_DUPLICATION
    }

    public enum RedundancySeverity {
        CRITICAL,   // Immediate action required
        HIGH,       // Should be addressed in current congress
        MEDIUM,     // Address in next regulatory review
        LOW         // Monitor for future consolidation
    }

    /**
     * Calculate deregulation priority score based on redundancy metrics
     */
    public Integer getDeregulationPriorityScore() {
        int score = 0;
        
        // Base score from similarity
        score += (int) (similarityScore * 100);
        
        // Severity multiplier
        switch (severity) {
            case CRITICAL -> score += 50;
            case HIGH -> score += 30;
            case MEDIUM -> score += 15;
            case LOW -> score += 5;
        }
        
        // Cost savings bonus
        if (estimatedCostSavings != null && estimatedCostSavings > 100) {
            score += 25;
        }
        
        // Cross-agency redundancy bonus
        if (!agency1.equals(agency2)) {
            score += 20;
        }
        
        return Math.min(score, 100); // Cap at 100
    }
}