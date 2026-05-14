import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((component) => component.LoginComponent),
  },
  {
    path: 'find-jobs',
    loadComponent: () =>
      import('./pages/find-jobs-page/find-jobs-page.component').then(
        (component) => component.FindJobsPageComponent,
      ),
  },
  {
    path: 'jobs/:id',
    loadComponent: () =>
      import('./pages/job-detail/job-detail.component').then(
        (component) => component.JobDetailComponent,
      ),
  },
  {
    path: 'companies/:id',
    loadComponent: () =>
      import('./pages/company-detail/company-detail.component').then(
        (component) => component.CompanyDetailComponent,
      ),
  },
  {
    path: 'companies',
    loadComponent: () =>
      import('./pages/companies/explore-companies.component').then(
        (component) => component.ExploreCompaniesComponent,
      ),
  },
  {
    path: 'register-job-seeker',
    loadComponent: () =>
      import('./pages/auth/register/register.component').then(
        (component) => component.RegisterComponent,
      ),
  },
  {
    path: 'register-employer',
    loadComponent: () =>
      import('./pages/auth/employer-register/employer-register.component').then(
        (component) => component.EmployerRegisterComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard-hero/dashboard-hero.component').then(
        (component) => component.DashboardHeroComponent,
      ),
  },
];
