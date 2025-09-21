package gov.usds.ecfr.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity representing a federal regulation within the CFR.
 * Contains the regulation content and analytics metadata.
 */
@Entity
@Table(name = "regulations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Regulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agency_id", nullable = false)
    private Agency agency;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(name = "cfr_title")
    private Integer cfrTitle;

    @Column(name = "cfr_part")
    private String cfrPart;

    @Column(name = "cfr_section")
    private String cfrSection;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "word_count")
    private Integer wordCount;

    @Column(name = "complexity_score")
    private Double complexityScore;

    @Column(name = "cross_reference_count")
    private Integer crossReferenceCount;

    @Column(name = "checksum", length = 64)
    private String checksum;

    @Column(name = "last_modified")
    private LocalDateTime lastModified;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "ecfr_url", length = 500)
    private String ecfrUrl;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @OneToMany(mappedBy = "regulation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RegulationChange> changes;

    @OneToMany(mappedBy = "sourceRegulation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CrossReference> outgoingReferences;

    @OneToMany(mappedBy = "targetRegulation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CrossReference> incomingReferences;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}