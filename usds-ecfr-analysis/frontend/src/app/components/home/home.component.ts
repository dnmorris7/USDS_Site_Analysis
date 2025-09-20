import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1 class="hero-title">eCFR Site Analysis Tool</h1>
        <p class="hero-subtitle">
          Comprehensive analysis of the Electronic Code of Federal Regulations website
        </p>
        <p class="hero-description">
          This tool evaluates government websites for accessibility compliance, performance metrics, 
          and usability standards as required by Section 508 and USDS guidelines.
        </p>
        <button mat-raised-button color="primary" class="cta-button" routerLink="/analysis">
          <mat-icon>play_arrow</mat-icon>
          Start Analysis
        </button>
      </div>

      <div class="features-section">
        <h2 class="section-title">Analysis Features</h2>
        <div class="features-grid">
          <mat-card class="feature-card">
            <mat-card-content>
              <div class="feature-icon">
                <mat-icon color="primary">accessibility</mat-icon>
              </div>
              <h3>Accessibility Analysis</h3>
              <p>
                Comprehensive WCAG 2.1 compliance check including alt text validation, 
                keyboard navigation, color contrast, and screen reader compatibility.
              </p>
              <ul>
                <li>Section 508 compliance verification</li>
                <li>ARIA attributes validation</li>
                <li>Skip navigation assessment</li>
                <li>Form labeling analysis</li>
              </ul>
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-content>
              <div class="feature-icon">
                <mat-icon color="primary">speed</mat-icon>
              </div>
              <h3>Performance Metrics</h3>
              <p>
                Detailed performance analysis including load times, resource optimization, 
                and mobile responsiveness testing.
              </p>
              <ul>
                <li>Page load time measurement</li>
                <li>Resource count and size analysis</li>
                <li>Mobile responsiveness check</li>
                <li>Script and stylesheet optimization</li>
              </ul>
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-content>
              <div class="feature-icon">
                <mat-icon color="primary">account_balance</mat-icon>
              </div>
              <h3>Government Compliance</h3>
              <p>
                Specialized checks for government website requirements including 
                privacy policies, FOIA compliance, and contact information.
              </p>
              <ul>
                <li>Privacy policy verification</li>
                <li>FOIA information check</li>
                <li>Contact information validation</li>
                <li>Government branding compliance</li>
              </ul>
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-content>
              <div class="feature-icon">
                <mat-icon color="primary">web</mat-icon>
              </div>
              <h3>Technical Analysis</h3>
              <p>
                In-depth technical evaluation including security headers, 
                HTML validation, and modern web standards compliance.
              </p>
              <ul>
                <li>HTML document structure validation</li>
                <li>HTTPS and security assessment</li>
                <li>Meta tag analysis</li>
                <li>Technology stack detection</li>
              </ul>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="about-section">
        <mat-card>
          <mat-card-content>
            <h2>About the eCFR</h2>
            <p>
              The Electronic Code of Federal Regulations (eCFR) is a continuously updated online version 
              of the Code of Federal Regulations (CFR). It is not an official legal edition of the CFR.
            </p>
            <p>
              This analysis tool helps ensure that government websites like the eCFR meet the highest 
              standards for accessibility, performance, and user experience as mandated by federal guidelines.
            </p>
            <div class="external-link">
              <a href="https://www.ecfr.gov/" target="_blank" rel="noopener noreferrer">
                <mat-icon>open_in_new</mat-icon>
                Visit eCFR Website
              </a>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero-section {
      text-align: center;
      padding: 3rem 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      margin-bottom: 3rem;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 300;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .hero-description {
      font-size: 1.1rem;
      max-width: 800px;
      margin: 0 auto 2rem;
      opacity: 0.8;
      line-height: 1.6;
    }

    .cta-button {
      font-size: 1.1rem;
      padding: 12px 32px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
    }

    .cta-button:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .features-section {
      margin-bottom: 3rem;
    }

    .section-title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: #333;
      font-weight: 300;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .feature-card {
      transition: transform 0.2s ease-in-out;
    }

    .feature-card:hover {
      transform: translateY(-4px);
    }

    .feature-icon {
      text-align: center;
      margin-bottom: 1rem;
    }

    .feature-icon mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }

    .feature-card h3 {
      text-align: center;
      margin-bottom: 1rem;
      color: #333;
    }

    .feature-card p {
      margin-bottom: 1rem;
      color: #666;
      line-height: 1.6;
    }

    .feature-card ul {
      color: #666;
      padding-left: 1.5rem;
    }

    .feature-card li {
      margin-bottom: 0.5rem;
    }

    .about-section {
      margin-bottom: 2rem;
    }

    .about-section h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    .about-section p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .external-link {
      margin-top: 1.5rem;
    }

    .external-link a {
      display: inline-flex;
      align-items: center;
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
    }

    .external-link a:hover {
      text-decoration: underline;
    }

    .external-link mat-icon {
      margin-right: 0.5rem;
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 1rem;
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1.2rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent { }