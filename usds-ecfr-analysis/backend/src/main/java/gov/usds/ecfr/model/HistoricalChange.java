package gov.usds.ecfr.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity tracking historical changes over time for MVP requirement.
 * Records regulation modifications, additions, and deletions.
 */
@Entity
@Table(name = "historical_changes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoricalChange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer cfrTitleNumber;

    @Column(nullable = false)
    private Integer cfrPartNumber;

    @Column(nullable = false)
    private String agencyName;

    @Column(nullable = false)
    private LocalDateTime changeDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ChangeType changeType;

    @Column
    private Integer wordCountBefore;

    @Column
    private Integer wordCountAfter;

    @Column
    private Integer wordCountDelta;

    @Column(length = 1000)
    private String changeDescription;

    @Column
    private String congressionalYear; // e.g., "2023-2024", "2024-2025"

    @Column
    private String changeImpact; // MAJOR, MINOR, EDITORIAL

    @Column
    private Boolean isDeregulation; // True if change reduces regulatory burden

    @Column
    private String contentHashBefore;

    @Column
    private String contentHashAfter;

    public enum ChangeType {
        ADDITION,
        MODIFICATION, 
        DELETION,
        REORGANIZATION,
        TECHNICAL_AMENDMENT
    }

    @PrePersist
    @PreUpdate
    private void calculateMetrics() {
        // Calculate word count delta
        if (wordCountBefore != null && wordCountAfter != null) {
            this.wordCountDelta = wordCountAfter - wordCountBefore;
        }
        
        // Determine if this is deregulation (reduction in regulatory burden)
        if (changeType == ChangeType.DELETION || 
            (wordCountDelta != null && wordCountDelta < 0)) {
            this.isDeregulation = true;
        }
        
        // Determine change impact
        if (Math.abs(wordCountDelta != null ? wordCountDelta : 0) > 1000) {
            this.changeImpact = "MAJOR";
        } else if (Math.abs(wordCountDelta != null ? wordCountDelta : 0) > 100) {
            this.changeImpact = "MINOR";
        } else {
            this.changeImpact = "EDITORIAL";
        }
    }
}