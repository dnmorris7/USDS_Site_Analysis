package gov.usds.ecfr.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing historical changes to regulations.
 * Used for tracking regulatory evolution over time.
 */
@Entity
@Table(name = "regulation_changes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegulationChange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regulation_id", nullable = false)
    private Regulation regulation;

    @Column(name = "change_date", nullable = false)
    private LocalDateTime changeDate;

    @Column(name = "change_type", length = 50)
    private String changeType;

    @Column(name = "word_count_delta")
    private Integer wordCountDelta;

    @Column(name = "complexity_score_delta")
    private Double complexityScoreDelta;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "old_checksum", length = 64)
    private String oldChecksum;

    @Column(name = "new_checksum", length = 64)
    private String newChecksum;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}