import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-header">
      <span class="app-title">
        <mat-icon class="app-icon">gavel</mat-icon>
        Federal Regulation Analytics Platform
      </span>
      <span class="spacer"></span>
      <button mat-button routerLink="/dashboard" routerLinkActive="active">
        <mat-icon>dashboard</mat-icon>
        Dashboard
      </button>
      <button mat-button routerLink="/agency-analysis" routerLinkActive="active">
        <mat-icon>business</mat-icon>
        Agency Analysis
      </button>
      <button mat-button routerLink="/regulation-viewer" routerLinkActive="active">
        <mat-icon>description</mat-icon>
        Regulation Viewer
      </button>
      <button mat-button routerLink="/home" routerLinkActive="active" class="bonus-feature">
        <mat-icon>web</mat-icon>
        Website Analysis
      </button>
    </mat-toolbar>
    
    <main class="app-content">
      <router-outlet></router-outlet>
    </main>
    
    <footer class="app-footer">
      <p>&copy; 2025 U.S. Digital Service - Federal Regulation Analytics for Deregulation Decision-Making</p>
    </footer>
  `,
  styles: [`
    .app-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .app-title {
      display: flex;
      align-items: center;
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    .app-icon {
      margin-right: 8px;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .app-content {
      min-height: calc(100vh - 140px);
      padding: 0;
    }
    
    .app-footer {
      background-color: #f5f5f5;
      padding: 16px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 0.875rem;
    }
    
    .app-footer p {
      margin: 0;
    }
    
    button.mat-button {
      margin-left: 8px;
    }
    
    button.mat-button.active {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .bonus-feature {
      border-left: 1px solid rgba(255, 255, 255, 0.3);
      margin-left: 16px !important;
      padding-left: 16px;
      opacity: 0.8;
    }

    .bonus-feature:hover {
      opacity: 1;
    }
  `]
})
export class AppComponent {
  title = 'Federal Regulation Analytics Platform';
}