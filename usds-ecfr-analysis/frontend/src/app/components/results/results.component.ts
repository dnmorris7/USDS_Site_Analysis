import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

import { SiteAnalysisService, SiteAnalysisResult } from '../../services/site-analysis.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTabsModule,
    MatButtonModule
  ],
  template: `
    <div class="results-container" *ngIf="analysisResult">
      <div class="results-header">
        <h1>eCFR Site Analysis Results</h1>
        <p class="analysis-info">
          Analyzed: {{ analysisResult.url }} | 
          Completed: {{ formatDate(analysisResult.analyzedAt) }} |
          Response Time: {{ analysisResult.responseTimeMs }}ms
        </p>
      </div>

      <div class="score-overview">
        <mat-card class="score-card accessibility">
          <mat-card-content>
            <div class="score-header">
              <mat-icon>accessibility</mat-icon>
              <h3>Accessibility</h3>
            </div>
            <div class="score-value">{{ analysisResult.accessibility.score }}/100</div>
            <mat-progress-bar [value]="analysisResult.accessibility.score" mode="determinate"></mat-progress-bar>
            <p class="score-description">WCAG {{ getWcagLevelText(analysisResult.accessibility.wcagLevel) }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="score-card performance">
          <mat-card-content>
            <div class="score-header">
              <mat-icon>speed</mat-icon>
              <h3>Performance</h3>
            </div>
            <div class="score-value">{{ analysisResult.performance.score }}/100</div>
            <mat-progress-bar [value]="analysisResult.performance.score" mode="determinate"></mat-progress-bar>
            <p class="score-description">{{ getPerformanceDescription(analysisResult.performance.score) }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="score-card usability">
          <mat-card-content>
            <div class="score-header">
              <mat-icon>touch_app</mat-icon>
              <h3>Usability</h3>
            </div>
            <div class="score-value">{{ analysisResult.usability.score }}/100</div>
            <mat-progress-bar [value]="analysisResult.usability.score" mode="determinate"></mat-progress-bar>
            <p class="score-description">{{ getUsabilityDescription(analysisResult.usability.score) }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="score-card compliance">
          <mat-card-content>
            <div class="score-header">
              <mat-icon>account_balance</mat-icon>
              <h3>Gov Compliance</h3>
            </div>
            <div class="score-value">{{ analysisResult.compliance.complianceScore }}/100</div>
            <mat-progress-bar [value]="analysisResult.compliance.complianceScore" mode="determinate"></mat-progress-bar>
            <p class="score-description">{{ getComplianceDescription(analysisResult.compliance.complianceScore) }}</p>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-tab-group>
        <mat-tab label="Accessibility Details">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Accessibility Analysis</mat-card-title>
                <mat-card-subtitle>WCAG 2.1 Compliance Review</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="metrics-grid">
                  <div class="metric">
                    <strong>Total Images:</strong> {{ analysisResult.accessibility.details['totalImages'] }}
                  </div>
                  <div class="metric">
                    <strong>Images Missing Alt Text:</strong> {{ analysisResult.accessibility.details['imagesWithoutAlt'] }}
                  </div>
                  <div class="metric">
                    <strong>Total Headings:</strong> {{ analysisResult.accessibility.details['totalHeadings'] }}
                  </div>
                  <div class="metric">
                    <strong>Skip Links Present:</strong> 
                    <mat-icon [color]="analysisResult.accessibility.details['hasSkipLinks'] ? 'accent' : 'warn'">
                      {{ analysisResult.accessibility.details['hasSkipLinks'] ? 'check_circle' : 'cancel' }}
                    </mat-icon>
                  </div>
                </div>
                
                <div class="issues-section" *ngIf="analysisResult.accessibility.issues.length > 0">
                  <h4>Issues Found:</h4>
                  <mat-chip-listbox>
                    <mat-chip-option *ngFor="let issue of analysisResult.accessibility.issues" [color]="'warn'">
                      {{ issue }}
                    </mat-chip-option>
                  </mat-chip-listbox>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Performance Metrics">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Performance Analysis</mat-card-title>
                <mat-card-subtitle>Load Time and Resource Optimization</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="metrics-grid">
                  <div class="metric">
                    <strong>Load Time:</strong> {{ analysisResult.performance.loadTimeMs }}ms
                  </div>
                  <div class="metric">
                    <strong>Page Size:</strong> {{ formatBytes(analysisResult.performance.pageSizeBytes) }}
                  </div>
                  <div class="metric">
                    <strong>Total Requests:</strong> {{ analysisResult.performance.numberOfRequests }}
                  </div>
                  <div class="metric">
                    <strong>Images:</strong> {{ analysisResult.performance.imageCount }}
                  </div>
                  <div class="metric">
                    <strong>Scripts:</strong> {{ analysisResult.performance.scriptCount }}
                  </div>
                  <div class="metric">
                    <strong>Stylesheets:</strong> {{ analysisResult.performance.stylesheetCount }}
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Content Analysis">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Content Structure</mat-card-title>
                <mat-card-subtitle>Page Content and Organization</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="content-info">
                  <div class="info-item">
                    <strong>Page Title:</strong> {{ analysisResult.content.title }}
                  </div>
                  <div class="info-item">
                    <strong>Description:</strong> {{ analysisResult.content.description || 'No description found' }}
                  </div>
                  <div class="metrics-grid">
                    <div class="metric">
                      <strong>Headings:</strong> {{ analysisResult.content.headingCount }}
                    </div>
                    <div class="metric">
                      <strong>Links:</strong> {{ analysisResult.content.linkCount }}
                    </div>
                    <div class="metric">
                      <strong>Images:</strong> {{ analysisResult.content.imageCount }}
                    </div>
                    <div class="metric">
                      <strong>Word Count:</strong> {{ analysisResult.content.wordCount }}
                    </div>
                    <div class="metric">
                      <strong>Languages:</strong> {{ analysisResult.content.languages.join(', ') || 'None specified' }}
                    </div>
                    <div class="metric">
                      <strong>Search Available:</strong>
                      <mat-icon [color]="analysisResult.content.hasSearchFunctionality ? 'accent' : 'warn'">
                        {{ analysisResult.content.hasSearchFunctionality ? 'check_circle' : 'cancel' }}
                      </mat-icon>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Government Compliance">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Government Standards Compliance</mat-card-title>
                <mat-card-subtitle>Section 508, FOIA, and Federal Requirements</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="compliance-checks">
                  <div class="compliance-item">
                    <mat-icon [color]="analysisResult.compliance.section508Compliant ? 'accent' : 'warn'">
                      {{ analysisResult.compliance.section508Compliant ? 'check_circle' : 'cancel' }}
                    </mat-icon>
                    <span>Section 508 Compliance</span>
                  </div>
                  <div class="compliance-item">
                    <mat-icon [color]="analysisResult.compliance.hasPrivacyPolicy ? 'accent' : 'warn'">
                      {{ analysisResult.compliance.hasPrivacyPolicy ? 'check_circle' : 'cancel' }}
                    </mat-icon>
                    <span>Privacy Policy</span>
                  </div>
                  <div class="compliance-item">
                    <mat-icon [color]="analysisResult.compliance.hasAccessibilityStatement ? 'accent' : 'warn'">
                      {{ analysisResult.compliance.hasAccessibilityStatement ? 'check_circle' : 'cancel' }}
                    </mat-icon>
                    <span>Accessibility Statement</span>
                  </div>
                  <div class="compliance-item">
                    <mat-icon [color]="analysisResult.compliance.hasFoia ? 'accent' : 'warn'">
                      {{ analysisResult.compliance.hasFoia ? 'check_circle' : 'cancel' }}
                    </mat-icon>
                    <span>FOIA Information</span>
                  </div>
                  <div class="compliance-item">
                    <mat-icon [color]="analysisResult.compliance.hasContact ? 'accent' : 'warn'">
                      {{ analysisResult.compliance.hasContact ? 'check_circle' : 'cancel' }}
                    </mat-icon>
                    <span>Contact Information</span>
                  </div>
                </div>

                <div class="recommendations" *ngIf="analysisResult.compliance.recommendations.length > 0">
                  <h4>Recommendations:</h4>
                  <ul>
                    <li *ngFor="let recommendation of analysisResult.compliance.recommendations">
                      {{ recommendation }}
                    </li>
                  </ul>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Technical Details">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Technical Analysis</mat-card-title>
                <mat-card-subtitle>Security, Standards, and Technologies</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="technical-info">
                  <div class="info-section">
                    <h4>Security & Standards</h4>
                    <div class="metrics-grid">
                      <div class="metric">
                        <strong>HTTPS:</strong>
                        <mat-icon [color]="analysisResult.technical.isHttps ? 'accent' : 'warn'">
                          {{ analysisResult.technical.isHttps ? 'check_circle' : 'cancel' }}
                        </mat-icon>
                      </div>
                      <div class="metric">
                        <strong>CSP Header:</strong>
                        <mat-icon [color]="analysisResult.technical.hasCsp ? 'accent' : 'warn'">
                          {{ analysisResult.technical.hasCsp ? 'check_circle' : 'cancel' }}
                        </mat-icon>
                      </div>
                      <div class="metric">
                        <strong>DOCTYPE:</strong> {{ analysisResult.technical.doctype }}
                      </div>
                    </div>
                  </div>

                  <div class="info-section" *ngIf="analysisResult.technical.technologies.length > 0">
                    <h4>Detected Technologies</h4>
                    <mat-chip-listbox>
                      <mat-chip-option *ngFor="let tech of analysisResult.technical.technologies">
                        {{ tech }}
                      </mat-chip-option>
                    </mat-chip-listbox>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>

      <div class="actions-section">
        <button mat-raised-button color="primary" (click)="runNewAnalysis()">
          <mat-icon>refresh</mat-icon>
          Run New Analysis
        </button>
      </div>
    </div>

    <div class="no-results" *ngIf="!analysisResult">
      <mat-card>
        <mat-card-content>
          <div class="no-results-content">
            <mat-icon>assessment</mat-icon>
            <h2>No Analysis Results</h2>
            <p>No analysis results are available. Please run an analysis first.</p>
            <button mat-raised-button color="primary" routerLink="/analysis">
              <mat-icon>play_arrow</mat-icon>
              Start Analysis
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .results-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .results-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .results-header h1 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .analysis-info {
      color: #666;
      font-size: 0.95rem;
    }

    .score-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .score-card {
      text-align: center;
    }

    .score-header {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .score-header mat-icon {
      margin-right: 0.5rem;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .score-header h3 {
      margin: 0;
      color: #333;
    }

    .score-value {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #3f51b5;
    }

    .score-description {
      margin: 0.5rem 0 0 0;
      font-size: 0.875rem;
      color: #666;
    }

    .accessibility .score-value { color: #4caf50; }
    .performance .score-value { color: #ff9800; }
    .usability .score-value { color: #2196f3; }
    .compliance .score-value { color: #9c27b0; }

    .tab-content {
      padding: 1rem 0;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .metric {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .metric strong {
      margin-right: 0.5rem;
    }

    .issues-section, .recommendations {
      margin-top: 1.5rem;
    }

    .issues-section h4, .recommendations h4 {
      color: #333;
      margin-bottom: 1rem;
    }

    .content-info .info-item {
      margin-bottom: 1rem;
      padding: 0.75rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .compliance-checks {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .compliance-item {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .compliance-item mat-icon {
      margin-right: 1rem;
    }

    .recommendations ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .recommendations li {
      margin-bottom: 0.5rem;
      color: #666;
    }

    .technical-info .info-section {
      margin-bottom: 1.5rem;
    }

    .technical-info h4 {
      color: #333;
      margin-bottom: 1rem;
    }

    .actions-section {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e0e0e0;
    }

    .no-results {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
    }

    .no-results-content {
      text-align: center;
      padding: 2rem;
    }

    .no-results-content mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
      margin-bottom: 1rem;
    }

    .no-results-content h2 {
      color: #666;
      margin-bottom: 1rem;
    }

    .no-results-content p {
      color: #999;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .results-container {
        padding: 1rem;
      }

      .score-overview {
        grid-template-columns: 1fr;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ResultsComponent implements OnInit {
  private siteAnalysisService = inject(SiteAnalysisService);
  
  analysisResult: SiteAnalysisResult | null = null;

  ngOnInit(): void {
    this.siteAnalysisService.getLatestResult().subscribe(result => {
      this.analysisResult = result;
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getWcagLevelText(level: number): string {
    switch (level) {
      case 0: return 'Below A';
      case 1: return 'A';
      case 2: return 'AA';
      case 3: return 'AAA';
      default: return 'Unknown';
    }
  }

  getPerformanceDescription(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Needs Improvement';
    return 'Poor';
  }

  getUsabilityDescription(score: number): string {
    if (score >= 90) return 'Highly Usable';
    if (score >= 80) return 'Good Usability';
    if (score >= 70) return 'Adequate';
    if (score >= 60) return 'Below Average';
    return 'Poor Usability';
  }

  getComplianceDescription(score: number): string {
    if (score >= 90) return 'Fully Compliant';
    if (score >= 80) return 'Mostly Compliant';
    if (score >= 70) return 'Partially Compliant';
    if (score >= 60) return 'Limited Compliance';
    return 'Non-Compliant';
  }

  runNewAnalysis(): void {
    // Navigation would be handled by router
    window.location.href = '/analysis';
  }
}