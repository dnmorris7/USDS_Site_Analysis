import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { SiteAnalysisService } from '../../services/site-analysis.service';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="analysis-container">
      <mat-card class="analysis-card">
        <mat-card-header>
          <mat-card-title>eCFR Site Analysis</mat-card-title>
          <mat-card-subtitle>
            Analyzing https://www.ecfr.gov/ for accessibility, performance, and compliance
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="analysis-status" [ngClass]="{'analyzing': isAnalyzing, 'completed': isCompleted}">
            <div class="status-icon">
              <mat-spinner *ngIf="isAnalyzing" [diameter]="60"></mat-spinner>
              <mat-icon *ngIf="!isAnalyzing && !isCompleted" color="primary">play_circle</mat-icon>
              <mat-icon *ngIf="isCompleted" color="accent" class="success-icon">check_circle</mat-icon>
            </div>
            
            <div class="status-text">
              <h3 *ngIf="!isAnalyzing && !isCompleted">Ready to Start Analysis</h3>
              <h3 *ngIf="isAnalyzing">{{ currentStep }}</h3>
              <h3 *ngIf="isCompleted">Analysis Complete!</h3>
              
              <p *ngIf="!isAnalyzing && !isCompleted">
                Click the button below to begin a comprehensive analysis of the eCFR website.
                This will evaluate accessibility, performance, and government compliance.
              </p>
              <p *ngIf="isAnalyzing">
                Please wait while we analyze the website. This may take a few moments...
              </p>
              <p *ngIf="isCompleted">
                The analysis has been completed successfully. View the detailed results below.
              </p>
            </div>
          </div>
          
          <div class="progress-steps" *ngIf="isAnalyzing">
            <div class="step" [ngClass]="{'active': currentStepIndex >= 0, 'completed': currentStepIndex > 0}">
              <mat-icon>language</mat-icon>
              <span>Fetching Website</span>
            </div>
            <div class="step" [ngClass]="{'active': currentStepIndex >= 1, 'completed': currentStepIndex > 1}">
              <mat-icon>accessibility</mat-icon>
              <span>Accessibility Check</span>
            </div>
            <div class="step" [ngClass]="{'active': currentStepIndex >= 2, 'completed': currentStepIndex > 2}">
              <mat-icon>speed</mat-icon>
              <span>Performance Analysis</span>
            </div>
            <div class="step" [ngClass]="{'active': currentStepIndex >= 3, 'completed': currentStepIndex > 3}">
              <mat-icon>account_balance</mat-icon>
              <span>Compliance Review</span>
            </div>
          </div>
        </mat-card-content>
        
        <mat-card-actions align="end">
          <button 
            mat-raised-button 
            color="primary" 
            (click)="startAnalysis()"
            [disabled]="isAnalyzing"
            *ngIf="!isCompleted">
            <mat-icon>play_arrow</mat-icon>
            {{ isAnalyzing ? 'Analyzing...' : 'Start Analysis' }}
          </button>
          
          <button 
            mat-raised-button 
            color="accent" 
            (click)="viewResults()"
            *ngIf="isCompleted">
            <mat-icon>assessment</mat-icon>
            View Results
          </button>
          
          <button 
            mat-button 
            (click)="runNewAnalysis()"
            *ngIf="isCompleted">
            <mat-icon>refresh</mat-icon>
            Run New Analysis
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .analysis-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1rem;
    }

    .analysis-card {
      min-height: 400px;
    }

    .analysis-status {
      display: flex;
      align-items: center;
      padding: 2rem 0;
      transition: all 0.3s ease;
    }

    .status-icon {
      margin-right: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
    }

    .status-icon mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }

    .success-icon {
      color: #4caf50 !important;
    }

    .status-text h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .status-text p {
      margin: 0;
      color: #666;
      line-height: 1.6;
    }

    .progress-steps {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      padding: 1rem 0;
      border-top: 1px solid #e0e0e0;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      opacity: 0.3;
      transition: opacity 0.3s ease;
      flex: 1;
      text-align: center;
    }

    .step.active {
      opacity: 0.7;
    }

    .step.completed {
      opacity: 1;
      color: #4caf50;
    }

    .step mat-icon {
      margin-bottom: 0.5rem;
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .step span {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .analyzing {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
    }

    .completed {
      background-color: #e8f5e8;
      border-radius: 8px;
      padding: 1rem;
    }

    @media (max-width: 768px) {
      .analysis-container {
        margin: 1rem;
        padding: 0.5rem;
      }

      .analysis-status {
        flex-direction: column;
        text-align: center;
      }

      .status-icon {
        margin-right: 0;
        margin-bottom: 1rem;
      }

      .progress-steps {
        flex-direction: column;
        gap: 1rem;
      }

      .step {
        flex-direction: row;
        justify-content: flex-start;
      }

      .step mat-icon {
        margin-right: 1rem;
        margin-bottom: 0;
      }
    }
  `]
})
export class AnalysisComponent {
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private siteAnalysisService = inject(SiteAnalysisService);

  isAnalyzing = false;
  isCompleted = false;
  currentStep = '';
  currentStepIndex = -1;

  private analysisSteps = [
    'Fetching website content...',
    'Analyzing accessibility features...',
    'Evaluating performance metrics...',
    'Reviewing government compliance...',
    'Generating comprehensive report...'
  ];

  startAnalysis(): void {
    this.isAnalyzing = true;
    this.isCompleted = false;
    this.currentStepIndex = 0;
    
    this.simulateAnalysisSteps();
  }

  private simulateAnalysisSteps(): void {
    const executeStep = (stepIndex: number) => {
      if (stepIndex < this.analysisSteps.length) {
        this.currentStep = this.analysisSteps[stepIndex];
        this.currentStepIndex = stepIndex;
        
        // Simulate step duration
        const stepDuration = stepIndex === 0 ? 2000 : 1500;
        
        setTimeout(() => {
          executeStep(stepIndex + 1);
        }, stepDuration);
      } else {
        this.completeAnalysis();
      }
    };

    executeStep(0);
  }

  private completeAnalysis(): void {
    // Call the actual analysis service
    this.siteAnalysisService.analyzeSite().subscribe({
      next: (result) => {
        this.siteAnalysisService.setLatestResult(result);
        this.isAnalyzing = false;
        this.isCompleted = true;
        this.currentStep = 'Analysis completed successfully!';
        
        this.snackBar.open('eCFR analysis completed successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Analysis failed:', error);
        this.isAnalyzing = false;
        this.isCompleted = false;
        this.currentStepIndex = -1;
        
        this.snackBar.open('Analysis failed. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  viewResults(): void {
    this.router.navigate(['/results']);
  }

  runNewAnalysis(): void {
    this.isCompleted = false;
    this.currentStepIndex = -1;
    this.currentStep = '';
  }
}