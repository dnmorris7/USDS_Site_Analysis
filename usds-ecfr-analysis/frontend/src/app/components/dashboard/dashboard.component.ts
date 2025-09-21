import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CFRAnalyticsService, CFROverview } from '../../services/cfr-analytics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="dashboard-container">
      <h2>Federal Regulation Analytics Platform</h2>
      <p class="subtitle">Analyzing 200k+ pages of federal regulations to support deregulation decision-making</p>

      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading CFR analytics data...</p>
      </div>

      <div *ngIf="errorMessage" class="error-container">
        <mat-icon color="warn">error</mat-icon>
        <p>{{ errorMessage }}</p>
        <button mat-raised-button color="primary" (click)="loadOverview()">
          <mat-icon>refresh</mat-icon>
          Retry
        </button>
      </div>

      <div *ngIf="overview && !isLoading" class="overview-grid">
        <!-- Overview Cards -->
        <mat-card class="metric-card">
          <mat-card-header>
            <mat-card-title>CFR Titles</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metric-value">{{ overview.totalTitles }}</div>
            <div class="metric-label">Active Title Categories</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-header>
            <mat-card-title>Federal Regulations</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metric-value">{{ overview.totalRegulations }}</div>
            <div class="metric-label">Total Pages Analyzed</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-header>
            <mat-card-title>Active Agencies</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metric-value">{{ overview.activeAgencies }}</div>
            <div class="metric-label">Government Agencies</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card highlight">
          <mat-card-header>
            <mat-card-title>Deregulation Opportunities</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metric-value">{{ overview.deregulationOpportunities }}</div>
            <div class="metric-label">Potential Reductions Identified</div>
          </mat-card-content>
        </mat-card>

        <!-- Data Controls -->
        <mat-card class="control-card">
          <mat-card-header>
            <mat-card-title>Data Management</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="control-buttons">
              <button mat-raised-button color="primary" (click)="triggerDownload()" [disabled]="isDownloading">
                <mat-icon>download</mat-icon>
                {{ isDownloading ? 'Downloading...' : 'Download Latest CFR Data' }}
              </button>
              <mat-progress-bar *ngIf="isDownloading" mode="indeterminate"></mat-progress-bar>
            </div>
            <div class="data-info">
              <p><strong>Last Updated:</strong> {{ formatDate(overview.lastUpdated) }}</p>
              <p><strong>Data Source:</strong> eCFR.gov Official API</p>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Quick Analytics -->
        <mat-card class="analytics-card">
          <mat-card-header>
            <mat-card-title>Quick Analytics</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-stats">
              <div class="stat-item">
                <mat-icon>description</mat-icon>
                <span>200k+ regulation pages</span>
              </div>
              <div class="stat-item">
                <mat-icon>trending_down</mat-icon>
                <span>{{ overview.deregulationOpportunities }} reduction opportunities</span>
              </div>
              <div class="stat-item">
                <mat-icon>business</mat-icon>
                <span>{{ overview.activeAgencies }} federal agencies</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- CFR Titles Section -->
      <div *ngIf="overview && !isLoading" class="titles-section">
        <h3>CFR Title Categories</h3>
        <div class="titles-grid">
          <mat-card *ngFor="let title of overview.titles" class="title-card" (click)="viewTitle(title.number)">
            <mat-card-header>
              <mat-card-title>Title {{ title.number }}</mat-card-title>
              <mat-card-subtitle>{{ title.agency }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="title-name">{{ title.name }}</p>
              <mat-chip-listbox *ngIf="title.partCount">
                <mat-chip>{{ title.partCount }} Parts</mat-chip>
              </mat-chip-listbox>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">
                <mat-icon>analytics</mat-icon>
                Analyze
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .subtitle {
      color: #666;
      font-size: 16px;
      margin-bottom: 32px;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      text-align: center;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .metric-card {
      text-align: center;
    }

    .metric-card.highlight {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
    }

    .metric-value {
      font-size: 48px;
      font-weight: bold;
      margin: 16px 0 8px 0;
    }

    .metric-label {
      color: #666;
      font-size: 14px;
    }

    .metric-card.highlight .metric-label {
      color: rgba(255, 255, 255, 0.8);
    }

    .control-card .control-buttons {
      margin-bottom: 16px;
    }

    .control-buttons mat-progress-bar {
      margin-top: 8px;
    }

    .data-info p {
      margin: 4px 0;
      font-size: 14px;
      color: #666;
    }

    .analytics-card .quick-stats {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .titles-section {
      margin-top: 48px;
    }

    .titles-section h3 {
      margin-bottom: 24px;
      color: #333;
    }

    .titles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .title-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .title-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }

    .title-name {
      font-size: 14px;
      color: #666;
      margin: 8px 0;
      min-height: 40px;
    }

    mat-chip-listbox {
      margin-top: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  overview: CFROverview | null = null;
  isLoading = false;
  isDownloading = false;
  errorMessage = '';

  constructor(private cfrService: CFRAnalyticsService) {}

  ngOnInit() {
    this.loadOverview();
  }

  loadOverview() {
    this.isLoading = true;
    this.errorMessage = '';

    this.cfrService.getOverview().subscribe({
      next: (data) => {
        this.overview = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  triggerDownload() {
    this.isDownloading = true;

    this.cfrService.triggerDataDownload().subscribe({
      next: (response) => {
        this.isDownloading = false;
        console.log('Download initiated:', response);
        // Refresh overview after download
        setTimeout(() => this.loadOverview(), 2000);
      },
      error: (error) => {
        this.isDownloading = false;
        console.error('Download failed:', error);
      }
    });
  }

  viewTitle(titleNumber: number) {
    console.log(`Viewing CFR Title ${titleNumber}`);
    // TODO: Navigate to title detail view
  }

  formatDate(timestamp: number): string {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  }
}