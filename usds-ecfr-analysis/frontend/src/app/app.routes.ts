import { Routes } from '@angular/router';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { HomeComponent } from './components/home/home.component';
import { ResultsComponent } from './components/results/results.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: 'results', component: ResultsComponent },
  { path: '**', redirectTo: '' }
];