import { Routes } from '@angular/router';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { HomeComponent } from './components/home/home.component';
import { ResultsComponent } from './components/results/results.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AgencyAnalysisComponent } from './components/agency-analysis/agency-analysis.component';
import { RegulationViewerComponent } from './components/regulation-viewer/regulation-viewer.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'agency-analysis', component: AgencyAnalysisComponent },
  { path: 'regulation-viewer', component: RegulationViewerComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '' }
];