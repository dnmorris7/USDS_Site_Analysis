import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { CFRAnalyticsService } from '../../services/cfr-analytics.service';

interface AgencyMetrics {
  id: string;
  name: string;
  budget: number;
  employees: number;
  regulationCount: number;
  totalWords: number;
  averageComplexity: number;
  deregulationScore: number;
  efficiencyRating: string;
}

@Component({
  selector: 'app-agency-analysis',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
    MatSortModule
  ],
  template: `
    <div class="agency-analysis-container">
      <h2>Federal Agency Analysis</h2>
      <p class="subtitle">Regulatory burden and deregulation opportunities by federal agency</p>

      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading agency analysis data...</p>
      </div>

      <div *ngIf="errorMessage" class="error-container">
        <mat-icon color="warn">error</mat-icon>
        <p>{{ errorMessage }}</p>
        <button mat-raised-button color="primary" (click)="loadAgencyData()">
          <mat-icon>refresh</mat-icon>
          Retry
        </button>
      </div>

      <div *ngIf="agencies.length > 0 && !isLoading" class="analysis-content">
        <!-- Summary Cards -->
        <div class="summary-grid">
          <mat-card class="summary-card">
            <mat-card-header>
              <mat-card-title>Total Agencies</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="metric-value">{{ agencies.length }}</div>
              <div class="metric-label">Active Federal Agencies</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card">
            <mat-card-header>
              <mat-card-title>Total Budget</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="metric-value">{{ formatBudget(getTotalBudget()) }}</div>
              <div class="metric-label">Combined Annual Budget</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card">
            <mat-card-header>
              <mat-card-title>Regulation Density</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="metric-value">{{ getAverageRegulationDensity() }}</div>
              <div class="metric-label">Regulations per Billion Budget</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card highlight">
            <mat-card-header>
              <mat-card-title>Deregulation Potential</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="metric-value">{{ getDeregulationOpportunities() }}</div>
              <div class="metric-label">High-Priority Agencies</div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Agency Rankings -->
        <mat-card class="rankings-card">
          <mat-card-header>
            <mat-card-title>Agency Deregulation Priority Rankings</mat-card-title>
            <mat-card-subtitle>Ranked by regulatory burden vs. efficiency metrics</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="getSortedAgencies()" class="agency-table" matSort>
              <!-- Rank Column -->
              <ng-container matColumnDef="rank">
                <th mat-header-cell *matHeaderCellDef>Rank</th>
                <td mat-cell *matCellDef="let agency; let i = index">
                  <div class="rank-cell">
                    <mat-icon *ngIf="i < 3" [color]="getRankColor(i)">
                      {{ getRankIcon(i) }}
                    </mat-icon>
                    <span>{{ i + 1 }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Agency Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Agency</th>
                <td mat-cell *matCellDef="let agency">
                  <div class="agency-name">
                    <strong>{{ agency.name }}</strong>
                    <mat-chip [color]="getEfficiencyColor(agency.efficiencyRating)">
                      {{ agency.efficiencyRating }}
                    </mat-chip>
                  </div>
                </td>
              </ng-container>

              <!-- Budget Column -->
              <ng-container matColumnDef="budget">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Budget</th>
                <td mat-cell *matCellDef="let agency">{{ formatBudget(agency.budget) }}</td>
              </ng-container>

              <!-- Regulation Count Column -->
              <ng-container matColumnDef="regulations">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Regulations</th>
                <td mat-cell *matCellDef="let agency">{{ agency.regulationCount }}</td>
              </ng-container>

              <!-- Complexity Score Column -->
              <ng-container matColumnDef="complexity">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Complexity</th>
                <td mat-cell *matCellDef="let agency">
                  <div class="complexity-cell">
                    <span>{{ agency.averageComplexity.toFixed(1) }}</span>
                    <div class="complexity-bar">
                      <div class="complexity-fill" [style.width.%]="agency.averageComplexity * 10"></div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Deregulation Score Column -->
              <ng-container matColumnDef="deregulation">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Deregulation Score</th>
                <td mat-cell *matCellDef="let agency">
                  <mat-chip [color]="getDeregulationColor(agency.deregulationScore)">
                    {{ agency.deregulationScore.toFixed(1) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let agency">
                  <button mat-icon-button (click)="viewAgencyDetails(agency)">
                    <mat-icon>analytics</mat-icon>
                  </button>
                  <button mat-icon-button (click)="exportAgencyData(agency)">
                    <mat-icon>download</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>

        <!-- Insights Panel -->
        <mat-card class="insights-card">
          <mat-card-header>
            <mat-card-title>Key Insights & Recommendations</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="insights-grid">
              <div class="insight-item">
                <mat-icon color="primary">trending_up</mat-icon>
                <div>
                  <h4>Highest Regulatory Burden</h4>
                  <p>{{ getHighestBurdenAgency()?.name }} has {{ getHighestBurdenAgency()?.regulationCount }} regulations with average complexity of {{ (getHighestBurdenAgency()?.averageComplexity || 0).toFixed(1) }}</p>
                </div>
              </div>
              
              <div class="insight-item">
                <mat-icon color="accent">efficiency</mat-icon>
                <div>
                  <h4>Efficiency Opportunity</h4>
                  <p>{{ getLowestEfficiencyAgency()?.name }} shows potential for {{ ((getLowestEfficiencyAgency()?.deregulationScore || 0)).toFixed(1) }} point improvement in deregulation score</p>
                </div>
              </div>
              
              <div class="insight-item">
                <mat-icon color="warn">priority_high</mat-icon>
                <div>
                  <h4>Priority Targets</h4>
                  <p>{{ getDeregulationOpportunities() }} agencies show high deregulation potential based on complexity vs. efficiency analysis</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .agency-analysis-container {
      max-width: 1400px;
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

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .summary-card {
      text-align: center;
    }

    .summary-card.highlight {
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
      color: white;
    }

    .metric-value {
      font-size: 36px;
      font-weight: bold;
      margin: 16px 0 8px 0;
    }

    .metric-label {
      color: #666;
      font-size: 14px;
    }

    .summary-card.highlight .metric-label {
      color: rgba(255, 255, 255, 0.8);
    }

    .rankings-card {
      margin-bottom: 32px;
    }

    .agency-table {
      width: 100%;
    }

    .rank-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .agency-name {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .complexity-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .complexity-bar {
      width: 60px;
      height: 4px;
      background: #e0e0e0;
      border-radius: 2px;
      overflow: hidden;
    }

    .complexity-fill {
      height: 100%;
      background: linear-gradient(90deg, #4caf50 0%, #ff9800 50%, #f44336 100%);
      transition: width 0.3s ease;
    }

    .insights-card {
      margin-top: 32px;
    }

    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
      font-size: 14px;
    }
  `]
})
export class AgencyAnalysisComponent implements OnInit {
  agencies: AgencyMetrics[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns = ['rank', 'name', 'budget', 'regulations', 'complexity', 'deregulation', 'actions'];

  constructor(private cfrService: CFRAnalyticsService) {}

  ngOnInit() {
    this.loadAgencyData();
  }

  loadAgencyData() {
    this.isLoading = true;
    this.errorMessage = '';

    // For now, using mock data since the backend agency endpoints aren't implemented yet
    setTimeout(() => {
      this.agencies = this.generateMockAgencyData();
      this.isLoading = false;
    }, 1000);
  }

  private generateMockAgencyData(): AgencyMetrics[] {
    return [
      {
        id: 'epa',
        name: 'Environmental Protection Agency',
        budget: 9237000000,
        employees: 14172,
        regulationCount: 1847,
        totalWords: 2456789,
        averageComplexity: 8.7,
        deregulationScore: 7.2,
        efficiencyRating: 'Medium'
      },
      {
        id: 'dol',
        name: 'Department of Labor',
        budget: 14200000000,
        employees: 15742,
        regulationCount: 1342,
        totalWords: 1987654,
        averageComplexity: 7.8,
        deregulationScore: 6.9,
        efficiencyRating: 'High'
      },
      {
        id: 'hhs',
        name: 'Health and Human Services',
        budget: 1700000000000,
        employees: 79540,
        regulationCount: 2156,
        totalWords: 3456789,
        averageComplexity: 9.1,
        deregulationScore: 8.4,
        efficiencyRating: 'Low'
      },
      {
        id: 'dot',
        name: 'Department of Transportation',
        budget: 87600000000,
        employees: 55468,
        regulationCount: 987,
        totalWords: 1567890,
        averageComplexity: 6.9,
        deregulationScore: 5.8,
        efficiencyRating: 'High'
      },
      {
        id: 'treasury',
        name: 'Department of Treasury',
        budget: 15800000000,
        employees: 86814,
        regulationCount: 1678,
        totalWords: 2789012,
        averageComplexity: 8.3,
        deregulationScore: 7.6,
        efficiencyRating: 'Medium'
      }
    ];
  }

  getSortedAgencies(): AgencyMetrics[] {
    return [...this.agencies].sort((a, b) => b.deregulationScore - a.deregulationScore);
  }

  getTotalBudget(): number {
    return this.agencies.reduce((sum, agency) => sum + agency.budget, 0);
  }

  getAverageRegulationDensity(): string {
    const totalRegs = this.agencies.reduce((sum, agency) => sum + agency.regulationCount, 0);
    const totalBudgetBillions = this.getTotalBudget() / 1000000000;
    return (totalRegs / totalBudgetBillions).toFixed(1);
  }

  getDeregulationOpportunities(): number {
    return this.agencies.filter(agency => agency.deregulationScore > 7.0).length;
  }

  getHighestBurdenAgency(): AgencyMetrics | undefined {
    return this.agencies.reduce((max, agency) => 
      agency.averageComplexity > max.averageComplexity ? agency : max
    );
  }

  getLowestEfficiencyAgency(): AgencyMetrics | undefined {
    return this.agencies.find(agency => agency.efficiencyRating === 'Low');
  }

  formatBudget(budget: number): string {
    if (budget >= 1000000000000) {
      return `$${(budget / 1000000000000).toFixed(1)}T`;
    } else if (budget >= 1000000000) {
      return `$${(budget / 1000000000).toFixed(1)}B`;
    } else if (budget >= 1000000) {
      return `$${(budget / 1000000).toFixed(1)}M`;
    }
    return `$${budget.toLocaleString()}`;
  }

  getRankIcon(index: number): string {
    switch (index) {
      case 0: return 'emoji_events';
      case 1: return 'workspace_premium';
      case 2: return 'military_tech';
      default: return '';
    }
  }

  getRankColor(index: number): string {
    switch (index) {
      case 0: return 'warn';
      case 1: return 'accent';
      case 2: return 'primary';
      default: return '';
    }
  }

  getEfficiencyColor(rating: string): string {
    switch (rating) {
      case 'High': return 'primary';
      case 'Medium': return 'accent';
      case 'Low': return 'warn';
      default: return '';
    }
  }

  getDeregulationColor(score: number): string {
    if (score >= 8.0) return 'warn';
    if (score >= 6.0) return 'accent';
    return 'primary';
  }

  viewAgencyDetails(agency: AgencyMetrics) {
    console.log('View details for agency:', agency.name);
    // TODO: Navigate to agency detail view
  }

  exportAgencyData(agency: AgencyMetrics) {
    console.log('Export data for agency:', agency.name);
    // TODO: Implement export functionality
  }
}