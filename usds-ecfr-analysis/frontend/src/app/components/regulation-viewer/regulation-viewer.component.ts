import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { CFRAnalyticsService, RegulationContent, RegulationHistory } from '../../services/cfr-analytics.service';

@Component({
  selector: 'app-regulation-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    MatExpansionModule,
    FormsModule
  ],
  template: `
    <div class="regulation-viewer-container">
      <h2>Regulation Content Viewer</h2>
      <p class="subtitle">Detailed analysis and content examination of federal regulations</p>

      <!-- Search Controls -->
      <mat-card class="search-card">
        <mat-card-header>
          <mat-card-title>Regulation Search</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="search-form">
            <mat-form-field appearance="outline">
              <mat-label>CFR Title</mat-label>
              <mat-select [(value)]="selectedTitle" (selectionChange)="onTitleChange()">
                <mat-option *ngFor="let title of availableTitles" [value]="title.number">
                  Title {{ title.number }} - {{ title.name }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Part Number</mat-label>
              <input matInput [(ngModel)]="selectedPart" placeholder="e.g., 100" />
            </mat-form-field>

            <button mat-raised-button color="primary" 
                    (click)="loadRegulation()" 
                    [disabled]="!selectedTitle || !selectedPart || isLoading">
              <mat-icon>search</mat-icon>
              Load Regulation
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading regulation content...</p>
      </div>

      <div *ngIf="errorMessage" class="error-container">
        <mat-icon color="warn">error</mat-icon>
        <p>{{ errorMessage }}</p>
        <button mat-raised-button color="primary" (click)="loadRegulation()">
          <mat-icon>refresh</mat-icon>
          Retry
        </button>
      </div>

      <!-- Regulation Content -->
      <div *ngIf="currentRegulation && !isLoading" class="regulation-content">
        <mat-tab-group>
          <!-- Content Tab -->
          <mat-tab label="Regulation Content">
            <div class="tab-content">
              <!-- Regulation Header -->
              <mat-card class="regulation-header">
                <mat-card-header>
                  <mat-card-title>
                    CFR Title {{ currentRegulation.titleNumber }}, Part {{ currentRegulation.partNumber }}
                  </mat-card-title>
                  <mat-card-subtitle>{{ currentRegulation.title }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="regulation-metadata">
                    <mat-chip-listbox>
                      <mat-chip>{{ currentRegulation.analytics.wordCount }} words</mat-chip>
                      <mat-chip [color]="getComplexityColor(currentRegulation.analytics.complexityScore)">
                        Complexity: {{ currentRegulation.analytics.complexityScore.toFixed(1) }}
                      </mat-chip>
                      <mat-chip>
                        Downloaded: {{ formatDate(currentRegulation.analytics.downloadedAt) }}
                      </mat-chip>
                    </mat-chip-listbox>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Analytics Summary -->
              <mat-card class="analytics-summary">
                <mat-card-header>
                  <mat-card-title>Content Analytics</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="analytics-grid">
                    <div class="analytics-metric">
                      <mat-icon>description</mat-icon>
                      <div>
                        <div class="metric-value">{{ currentRegulation.analytics.wordCount }}</div>
                        <div class="metric-label">Total Words</div>
                      </div>
                    </div>
                    
                    <div class="analytics-metric">
                      <mat-icon>trending_up</mat-icon>
                      <div>
                        <div class="metric-value">{{ currentRegulation.analytics.complexityScore.toFixed(1) }}</div>
                        <div class="metric-label">Complexity Score</div>
                      </div>
                    </div>
                    
                    <div class="analytics-metric">
                      <mat-icon>schedule</mat-icon>
                      <div>
                        <div class="metric-value">{{ getReadingTime() }}</div>
                        <div class="metric-label">Est. Reading Time</div>
                      </div>
                    </div>
                    
                    <div class="analytics-metric">
                      <mat-icon>assessment</mat-icon>
                      <div>
                        <div class="metric-value">{{ getDeregulationRisk() }}</div>
                        <div class="metric-label">Deregulation Risk</div>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Regulation Text -->
              <mat-card class="regulation-text">
                <mat-card-header>
                  <mat-card-title>Regulation Text</mat-card-title>
                  <div class="header-actions">
                    <button mat-icon-button (click)="copyToClipboard()">
                      <mat-icon>content_copy</mat-icon>
                    </button>
                    <button mat-icon-button (click)="downloadRegulation()">
                      <mat-icon>download</mat-icon>
                    </button>
                  </div>
                </mat-card-header>
                <mat-card-content>
                  <div class="regulation-content-text" [innerHTML]="formatRegulationContent()"></div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- History Tab -->
          <mat-tab label="Change History">
            <div class="tab-content">
              <button mat-raised-button color="primary" 
                      (click)="loadHistory()" 
                      [disabled]="isLoadingHistory"
                      style="margin-bottom: 16px;">
                <mat-icon>history</mat-icon>
                {{ isLoadingHistory ? 'Loading...' : 'Load Change History' }}
              </button>

              <div *ngIf="isLoadingHistory" class="loading-container">
                <mat-spinner></mat-spinner>
                <p>Loading regulation history...</p>
              </div>

              <div *ngIf="regulationHistory" class="history-content">
                <mat-card class="history-summary">
                  <mat-card-header>
                    <mat-card-title>Change Summary</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="history-metrics">
                      <div class="history-metric">
                        <mat-icon>history</mat-icon>
                        <div>
                          <div class="metric-value">{{ regulationHistory.versionCount }}</div>
                          <div class="metric-label">Total Versions</div>
                        </div>
                      </div>
                      
                      <div class="history-metric">
                        <mat-icon>update</mat-icon>
                        <div>
                          <div class="metric-value">{{ regulationHistory.changeFrequency }}</div>
                          <div class="metric-label">Change Frequency</div>
                        </div>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="history-timeline">
                  <mat-card-header>
                    <mat-card-title>Version History</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <mat-expansion-panel *ngFor="let version of regulationHistory.versions; let i = index" 
                                         class="version-panel">
                      <mat-expansion-panel-header>
                        <mat-panel-title>
                          Version {{ i + 1 }}
                        </mat-panel-title>
                        <mat-panel-description>
                          {{ formatDate(version.date) }}
                        </mat-panel-description>
                      </mat-expansion-panel-header>
                      
                      <div class="version-details">
                        <p><strong>Changes:</strong> {{ version.summary || 'No summary available' }}</p>
                        <p><strong>Word Count:</strong> {{ version.wordCount || 'N/A' }}</p>
                        <p><strong>Effective Date:</strong> {{ formatDate(version.effectiveDate) }}</p>
                      </div>
                    </mat-expansion-panel>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Analysis Tab -->
          <mat-tab label="Detailed Analysis">
            <div class="tab-content">
              <mat-card class="analysis-insights">
                <mat-card-header>
                  <mat-card-title>Regulatory Analysis Insights</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="insights-list">
                    <div class="insight-item">
                      <mat-icon color="primary">lightbulb</mat-icon>
                      <div>
                        <h4>Complexity Assessment</h4>
                        <p>This regulation has a complexity score of {{ currentRegulation.analytics.complexityScore.toFixed(1) }} 
                           ({{ getComplexityDescription() }}), indicating {{ getComplexityRecommendation() }}.</p>
                      </div>
                    </div>
                    
                    <div class="insight-item">
                      <mat-icon color="accent">trending_down</mat-icon>
                      <div>
                        <h4>Deregulation Potential</h4>
                        <p>Based on word count and complexity analysis, this regulation shows {{ getDeregulationPotential() }} 
                           potential for simplification or removal.</p>
                      </div>
                    </div>
                    
                    <div class="insight-item">
                      <mat-icon color="warn">timer</mat-icon>
                      <div>
                        <h4>Compliance Burden</h4>
                        <p>Estimated {{ getReadingTime() }} reading time suggests {{ getComplianceBurden() }} 
                           compliance burden for affected entities.</p>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .regulation-viewer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .subtitle {
      color: #666;
      font-size: 16px;
      margin-bottom: 32px;
    }

    .search-card {
      margin-bottom: 32px;
    }

    .search-form {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 16px;
      align-items: center;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      text-align: center;
    }

    .tab-content {
      padding: 24px 0;
    }

    .regulation-header {
      margin-bottom: 24px;
    }

    .regulation-metadata {
      margin-top: 16px;
    }

    .analytics-summary {
      margin-bottom: 24px;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .analytics-metric, .history-metric {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .metric-value {
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }

    .metric-label {
      font-size: 14px;
      color: #666;
    }

    .regulation-text {
      margin-bottom: 24px;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .regulation-content-text {
      max-height: 600px;
      overflow-y: auto;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .history-summary {
      margin-bottom: 24px;
    }

    .history-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .history-timeline .version-panel {
      margin-bottom: 8px;
    }

    .version-details {
      padding: 16px 0;
    }

    .version-details p {
      margin: 8px 0;
    }

    .analysis-insights {
      margin-top: 24px;
    }

    .insights-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .insight-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .insight-item h4 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .insight-item p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }
  `]
})
export class RegulationViewerComponent implements OnInit {
  selectedTitle: number | null = null;
  selectedPart: string = '';
  currentRegulation: RegulationContent | null = null;
  regulationHistory: RegulationHistory | null = null;
  isLoading = false;
  isLoadingHistory = false;
  errorMessage = '';

  availableTitles = [
    { number: 7, name: 'Agriculture' },
    { number: 10, name: 'Energy' },
    { number: 12, name: 'Banks and Banking' },
    { number: 14, name: 'Aeronautics and Space' },
    { number: 15, name: 'Commerce and Foreign Trade' },
    { number: 16, name: 'Commercial Practices' },
    { number: 17, name: 'Commodity and Securities Exchanges' },
    { number: 21, name: 'Food and Drugs' },
    { number: 29, name: 'Labor' },
    { number: 40, name: 'Protection of Environment' }
  ];

  constructor(private cfrService: CFRAnalyticsService) {}

  ngOnInit() {
    // Set default values for demonstration
    this.selectedTitle = 40;
    this.selectedPart = '100';
  }

  onTitleChange() {
    this.currentRegulation = null;
    this.regulationHistory = null;
    this.selectedPart = '';
  }

  loadRegulation() {
    if (!this.selectedTitle || !this.selectedPart) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.cfrService.getRegulationContent(this.selectedTitle, this.selectedPart).subscribe({
      next: (content) => {
        this.currentRegulation = content;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
        // For demo purposes, create mock data
        this.createMockRegulation();
      }
    });
  }

  loadHistory() {
    if (!this.selectedTitle || !this.selectedPart) return;

    this.isLoadingHistory = true;

    this.cfrService.getRegulationHistory(this.selectedTitle, this.selectedPart).subscribe({
      next: (history) => {
        this.regulationHistory = history;
        this.isLoadingHistory = false;
      },
      error: (error) => {
        this.isLoadingHistory = false;
        // For demo purposes, create mock history
        this.createMockHistory();
      }
    });
  }

  private createMockRegulation() {
    this.currentRegulation = {
      titleNumber: this.selectedTitle!,
      partNumber: this.selectedPart,
      title: 'Sample Environmental Protection Regulation',
      content: `PART ${this.selectedPart} - ENVIRONMENTAL PROTECTION STANDARDS

§ ${this.selectedPart}.1 Purpose and scope.

This part establishes environmental protection standards and procedures for federal agencies and regulated entities to ensure compliance with environmental laws and regulations.

§ ${this.selectedPart}.2 Definitions.

For the purposes of this part:
(a) "Environmental impact" means any change or alteration to the environment resulting from human activities.
(b) "Regulated entity" means any person, corporation, or organization subject to environmental regulations.
(c) "Compliance assessment" means the evaluation of adherence to environmental standards.

§ ${this.selectedPart}.3 General requirements.

(a) All regulated entities must:
    (1) Conduct environmental impact assessments;
    (2) Implement pollution prevention measures;
    (3) Monitor environmental compliance;
    (4) Report violations within 24 hours.

(b) Environmental management systems must be established and maintained in accordance with recognized standards.

§ ${this.selectedPart}.4 Enforcement and penalties.

Violations of this part may result in civil penalties up to $25,000 per day per violation, suspension of permits, or other enforcement actions as determined by the Administrator.`,
      analytics: {
        wordCount: 1247,
        complexityScore: 7.8,
        downloadedAt: Date.now()
      }
    };
    this.isLoading = false;
  }

  private createMockHistory() {
    this.regulationHistory = {
      titleNumber: this.selectedTitle!,
      partNumber: this.selectedPart,
      versions: [
        {
          date: Date.now() - (365 * 24 * 60 * 60 * 1000),
          effectiveDate: Date.now() - (365 * 24 * 60 * 60 * 1000),
          summary: 'Updated penalty amounts and added new compliance requirements',
          wordCount: 1247
        },
        {
          date: Date.now() - (2 * 365 * 24 * 60 * 60 * 1000),
          effectiveDate: Date.now() - (2 * 365 * 24 * 60 * 60 * 1000),
          summary: 'Clarified definitions and enforcement procedures',
          wordCount: 1156
        },
        {
          date: Date.now() - (3 * 365 * 24 * 60 * 60 * 1000),
          effectiveDate: Date.now() - (3 * 365 * 24 * 60 * 60 * 1000),
          summary: 'Initial regulation establishment',
          wordCount: 987
        }
      ],
      versionCount: 3,
      changeFrequency: 'Annual',
      downloadedAt: Date.now()
    };
    this.isLoadingHistory = false;
  }

  formatRegulationContent(): string {
    if (!this.currentRegulation?.content) return '';
    return this.currentRegulation.content
      .replace(/§/g, '<strong>§</strong>')
      .replace(/PART \d+/g, '<strong>$&</strong>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  getComplexityColor(score: number): string {
    if (score >= 8.0) return 'warn';
    if (score >= 6.0) return 'accent';
    return 'primary';
  }

  getComplexityDescription(): string {
    if (!this.currentRegulation) return '';
    const score = this.currentRegulation.analytics.complexityScore;
    if (score >= 8.0) return 'High complexity';
    if (score >= 6.0) return 'Medium complexity';
    return 'Low complexity';
  }

  getComplexityRecommendation(): string {
    if (!this.currentRegulation) return '';
    const score = this.currentRegulation.analytics.complexityScore;
    if (score >= 8.0) return 'significant opportunity for simplification';
    if (score >= 6.0) return 'moderate potential for streamlining';
    return 'well-structured with minimal revision needed';
  }

  getReadingTime(): string {
    if (!this.currentRegulation) return '0 min';
    const wordsPerMinute = 200;
    const minutes = Math.ceil(this.currentRegulation.analytics.wordCount / wordsPerMinute);
    return `${minutes} min`;
  }

  getDeregulationRisk(): string {
    if (!this.currentRegulation) return 'Low';
    const score = this.currentRegulation.analytics.complexityScore;
    if (score >= 8.0) return 'High';
    if (score >= 6.0) return 'Medium';
    return 'Low';
  }

  getDeregulationPotential(): string {
    if (!this.currentRegulation) return 'low';
    const score = this.currentRegulation.analytics.complexityScore;
    if (score >= 8.0) return 'high';
    if (score >= 6.0) return 'moderate';
    return 'low';
  }

  getComplianceBurden(): string {
    if (!this.currentRegulation) return 'minimal';
    const wordCount = this.currentRegulation.analytics.wordCount;
    if (wordCount >= 2000) return 'significant';
    if (wordCount >= 1000) return 'moderate';
    return 'minimal';
  }

  formatDate(timestamp: number): string {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleDateString();
  }

  copyToClipboard() {
    if (!this.currentRegulation?.content) return;
    navigator.clipboard.writeText(this.currentRegulation.content);
    console.log('Regulation content copied to clipboard');
  }

  downloadRegulation() {
    if (!this.currentRegulation) return;
    
    const content = `CFR Title ${this.currentRegulation.titleNumber}, Part ${this.currentRegulation.partNumber}
${this.currentRegulation.title}

${this.currentRegulation.content}

Analytics:
- Word Count: ${this.currentRegulation.analytics.wordCount}
- Complexity Score: ${this.currentRegulation.analytics.complexityScore}
- Downloaded: ${new Date(this.currentRegulation.analytics.downloadedAt).toLocaleString()}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CFR_${this.currentRegulation.titleNumber}_${this.currentRegulation.partNumber}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}