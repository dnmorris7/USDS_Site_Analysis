import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, tap } from 'rxjs';

export interface SiteAnalysisResult {
  url: string;
  analyzedAt: string;
  responseTimeMs: number;
  statusCode: number;
  accessibility: AccessibilityMetrics;
  performance: PerformanceMetrics;
  content: ContentAnalysis;
  technical: TechnicalAnalysis;
  usability: UsabilityAnalysis;
  compliance: GovernmentCompliance;
}

export interface AccessibilityMetrics {
  wcagLevel: number;
  issues: string[];
  score: number;
  details: { [key: string]: any };
}

export interface PerformanceMetrics {
  loadTimeMs: number;
  pageSizeBytes: number;
  numberOfRequests: number;
  imageCount: number;
  scriptCount: number;
  stylesheetCount: number;
  score: number;
}

export interface ContentAnalysis {
  title: string;
  description: string;
  headingCount: number;
  linkCount: number;
  imageCount: number;
  wordCount: number;
  languages: string[];
  hasSearchFunctionality: boolean;
}

export interface TechnicalAnalysis {
  doctype: string;
  isHttps: boolean;
  hasCsp: boolean;
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
  technologies: string[];
  metaTags: { [key: string]: string };
}

export interface UsabilityAnalysis {
  mobileResponsive: boolean;
  hasNavigation: boolean;
  hasBreadcrumbs: boolean;
  hasSkipLinks: boolean;
  navigationDepth: number;
  score: number;
}

export interface GovernmentCompliance {
  section508Compliant: boolean;
  hasPrivacyPolicy: boolean;
  hasAccessibilityStatement: boolean;
  hasFoia: boolean;
  hasContact: boolean;
  complianceScore: number;
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SiteAnalysisService {
  private apiUrl = 'http://localhost:8080/api/analysis';
  private latestResultSubject = new BehaviorSubject<SiteAnalysisResult | null>(null);
  
  constructor(private http: HttpClient) { }

  analyzeSite(url: string = 'https://www.ecfr.gov/'): Observable<SiteAnalysisResult> {
    return this.http.get<SiteAnalysisResult>(`${this.apiUrl}/analyze?url=${encodeURIComponent(url)}`);
  }

  analyzeSiteAsync(url: string = 'https://www.ecfr.gov/'): Observable<SiteAnalysisResult> {
    return this.http.post<SiteAnalysisResult>(`${this.apiUrl}/analyze-async?url=${encodeURIComponent(url)}`, {});
  }

  getLatestResult(): Observable<SiteAnalysisResult | null> {
    return this.latestResultSubject.asObservable();
  }

  setLatestResult(result: SiteAnalysisResult): void {
    this.latestResultSubject.next(result);
  }

  healthCheck(): Observable<string> {
    return this.http.get(`${this.apiUrl}/health`, { responseType: 'text' });
  }
}