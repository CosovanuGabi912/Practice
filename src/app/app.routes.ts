import { Routes } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list';
import { StudentDetailComponent } from './components/student-detail/student-detail';
import { StatisticsComponent } from './components/statistics/statistics';

export const routes: Routes = [
  { path: '', redirectTo: 'students', pathMatch: 'full' },
  { path: 'students', component: StudentListComponent },
  { path: 'students/:id', component: StudentDetailComponent },
  { path: 'statistics', component: StatisticsComponent },
];
