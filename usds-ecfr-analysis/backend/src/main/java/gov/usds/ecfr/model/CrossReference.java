package gov.usds.ecfr.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing cross-references between regulations.
 * Used for tracking dependencies and relationships across agencies.
 */
@Entity
@Table(name = "cross_references")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrossReference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_regulation_id", nullable = false)
    private Regulation sourceRegulation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_regulation_id", nullable = false)
    private Regulation targetRegulation;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(columnDefinition = "TEXT")
    private String context;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}