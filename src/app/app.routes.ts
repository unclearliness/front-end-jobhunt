import { CanMatchFn, Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

const hasAccessToken: CanMatchFn = () =>
  typeof window !== 'undefined' && !!window.localStorage.getItem('accessToken');

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
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/auth/unauthorized/unauthorized.component').then(
        (component) => component.UnauthorizedComponent,
      ),
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
    path: 'user-dashboard',
    canMatch: [hasAccessToken],
    canActivate: [roleGuard(['user'])],
    loadComponent: () =>
      import('./pages/dashboard/user-dashboard/user-dashboard.component').then(
        (component) => component.UserDashboardComponent,
      ),
  },
  {
    path: 'user-dashboard',
    redirectTo: '/dashboard',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard-hero/dashboard-hero.component').then(
        (component) => component.DashboardHeroComponent,
      ),
  },
  {
    path: 'hr-dashboard',
    canMatch: [hasAccessToken],
    canActivate: [roleGuard(['hr'])],
    loadComponent: () =>
      import('./pages/dashboard/hr-dashboard/hr-dashboard.component').then(
        (component) => component.HrDashboardComponent,
      ),
  },
  {
    path: 'hr-dashboard',
    redirectTo: '/dashboard',
  },
  {
    path: 'admin-dashboard',
    canMatch: [hasAccessToken],
    canActivate: [roleGuard(['admin'])],
    loadComponent: () =>
      import('./pages/dashboard/admin-dashboard/admin-dashboard.component').then(
        (component) => component.AdminDashboardComponent,
      ),
  },
  {
    path: 'admin-dashboard',
    redirectTo: '/dashboard',
  },
];
