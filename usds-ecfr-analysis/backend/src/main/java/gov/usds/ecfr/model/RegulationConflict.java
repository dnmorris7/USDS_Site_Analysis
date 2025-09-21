package gov.usds.ecfr.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity for detecting regulation conflicts - custom metric for MVP.
 * Identifies contradictory or conflicting regulatory requirements.
 */
@Entity
@Table(name = "regulation_conflicts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegulationConflict {

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
    @Enumerated(EnumType.STRING)
    private ConflictType conflictType;

    @Column(length = 1000)
    private String conflictDescription;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ConflictSeverity severity;

    @Column
    private Integer businessImpact; // Number of businesses affected

    @Column
    private Integer complianceCost; // Annual cost in thousands

    @Column(nullable = false)
    private LocalDateTime detectedDate;

    @Builder.Default
    @Column
    private Boolean resolved = false;

    @Column
    private String resolutionRecommendation;

    public enum ConflictType {
        CONTRADICTORY_REQUIREMENTS,
        OVERLAPPING_JURISDICTION,
        INCONSISTENT_DEFINITIONS,
        COMPETING_STANDARDS,
        PROCEDURAL_CONFLICTS
    }

    public enum ConflictSeverity {
        CRITICAL,   // Creates legal uncertainty
        HIGH,       // Significant compliance burden
        MEDIUM,     // Moderate impact
        LOW         // Minor inconsistency
    }

    /**
     * Calculate resolution priority score based on conflict metrics
     */
    public Integer getResolutionPriorityScore() {
        int score = 0;
        
        // Severity base score
        switch (severity) {
            case CRITICAL -> score += 40;
            case HIGH -> score += 30;
            case MEDIUM -> score += 20;
            case LOW -> score += 10;
        }
        
        // Business impact multiplier
        if (businessImpact != null && businessImpact > 1000) {
            score += 30;
        } else if (businessImpact != null && businessImpact > 100) {
            score += 20;
        }
        
        // Compliance cost factor
        if (complianceCost != null && complianceCost > 10000) {
            score += 20;
        } else if (complianceCost != null && complianceCost > 1000) {
            score += 10;
        }
        
        // Cross-agency conflict penalty
        if (!agency1.equals(agency2)) {
            score += 10;
        }
        
        return Math.min(score, 100); // Cap at 100
    }
}