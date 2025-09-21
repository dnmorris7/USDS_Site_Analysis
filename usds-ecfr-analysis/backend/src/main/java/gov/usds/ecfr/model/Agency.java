package gov.usds.ecfr.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity representing a federal agency in the CFR system.
 * Used for tracking regulatory burden and analysis metrics.
 */
@Entity
@Table(name = "agencies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Agency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String name;

    @Column(nullable = false, unique = true, length = 10)
    private String acronym;

    @Column(length = 500)
    private String description;

    @Column(name = "annual_budget")
    private BigDecimal annualBudget;

    @Column(name = "employee_count")
    private Integer employeeCount;

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Calculated fields for analytics
    @Column(name = "total_regulations")
    private Integer totalRegulations;

    @Column(name = "total_word_count")
    private Long totalWordCount;

    @Column(name = "average_complexity_score")
    private Double averageComplexityScore;

    @Column(name = "regulation_density_score")
    private Double regulationDensityScore;

    @OneToMany(mappedBy = "agency", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Regulation> regulations;

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