import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface CFROverview {
  totalTitles: number;
  totalRegulations: string;
  activeAgencies: number;
  lastUpdated: number;
  deregulationOpportunities: number;
  titles: CFRTitle[];
}

export interface CFRTitle {
  number: number;
  name: string;
  agency: string;
  partCount?: number;
}

export interface RegulationContent {
  titleNumber: number;
  partNumber: string;
  title: string;
  content: string;
  analytics: {
    wordCount: number;
    complexityScore: number;
    downloadedAt: number;
  };
}

export interface RegulationHistory {
  titleNumber: number;
  partNumber: string;
  versions: any[];
  versionCount: number;
  changeFrequency: string;
  downloadedAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class CFRAnalyticsService {
  private apiUrl = 'http://localhost:8080/api/cfr';
  private overviewSubject = new BehaviorSubject<CFROverview | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Gets the current CFR overview data
   */
  getOverview(): Observable<CFROverview> {
    console.log('🔍 Fetching CFR overview data...');
    
    return this.http.get<CFROverview>(`${this.apiUrl}/overview`)
      .pipe(
        tap(overview => {
          console.log('✅ CFR overview loaded:', overview);
          this.overviewSubject.next(overview);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Gets data for a specific CFR title
   */
  getTitleData(titleNumber: number): Observable<any> {
    console.log(`🔍 Fetching data for CFR title ${titleNumber}...`);
    
    return this.http.get(`${this.apiUrl}/titles/${titleNumber}`)
      .pipe(
        tap(data => {
          console.log(`✅ CFR title ${titleNumber} data loaded:`, data);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Gets regulation content with analytics
   */
  getRegulationContent(titleNumber: number, partNumber: string): Observable<RegulationContent> {
    console.log(`🔍 Fetching regulation content for CFR ${titleNumber} part ${partNumber}...`);
    
    return this.http.get<RegulationContent>(`${this.apiUrl}/titles/${titleNumber}/parts/${partNumber}`)
      .pipe(
        tap(content => {
          console.log(`✅ Regulation content loaded for CFR ${titleNumber} part ${partNumber}:`, content);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Gets historical changes for a regulation
   */
  getRegulationHistory(titleNumber: number, partNumber: string): Observable<RegulationHistory> {
    console.log(`🔍 Fetching regulation history for CFR ${titleNumber} part ${partNumber}...`);
    
    return this.http.get<RegulationHistory>(`${this.apiUrl}/titles/${titleNumber}/parts/${partNumber}/history`)
      .pipe(
        tap(history => {
          console.log(`✅ Regulation history loaded for CFR ${titleNumber} part ${partNumber}:`, history);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Triggers bulk CFR data download
   */
  triggerDataDownload(): Observable<any> {
    console.log('🔍 Triggering bulk CFR data download...');
    
    return this.http.post(`${this.apiUrl}/download`, {})
      .pipe(
        tap(response => {
          console.log('✅ Bulk download initiated:', response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Health check for CFR analytics service
   */
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Gets the current overview from the subject
   */
  getCurrentOverview(): Observable<CFROverview | null> {
    return this.overviewSubject.asObservable();
  }

  /**
   * Error handler for HTTP requests
   */
  private handleError = (error: any): Observable<never> => {
    console.error('❌ CFR Analytics API Error:', error);
    
    let errorMessage = 'CFR analytics request failed. Please try again.';
    
    if (error.status === 0) {
      errorMessage = 'Cannot connect to CFR analytics service. Please ensure the backend is running.';
    } else if (error.status >= 400 && error.status < 500) {
      errorMessage = error.error?.error || 'Invalid request to CFR analytics service.';
    } else if (error.status >= 500) {
      errorMessage = error.error?.error || 'CFR analytics service error occurred.';
    }
    
    console.error('Error details:', {
      status: error.status,
      message: error.message,
      url: error.url
    });
    
    throw new Error(errorMessage);
  };
}