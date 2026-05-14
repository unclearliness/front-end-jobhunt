import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardHeaderComponent } from '../../../shared/layouts/dashboard-header/dashboard-header.component';
import { FeaturedJobsDashboardComponent } from '../featured-jobs-dashboard/featured-jobs-dashboard.component';
import { EmployerCtaDashboardComponent } from '../employer-cta-dashboard/employer-cta-dashboard.component';
import { TopCompaniesDashboardComponent } from '../top-companies-dashboard/top-companies-dashboard.component';

interface DashboardStat {
  readonly number: string;
  readonly label: string;
  readonly icon: 'briefcase' | 'building' | 'users' | 'trend';
}

@Component({
  selector: 'app-dashboard-hero',
  imports: [
    DashboardHeaderComponent,
    FeaturedJobsDashboardComponent,
    TopCompaniesDashboardComponent,
    EmployerCtaDashboardComponent,
  ],
  templateUrl: './dashboard-hero.component.html',
  styleUrl: './dashboard-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHeroComponent {
  readonly stats: DashboardStat[] = [
    { number: '12,500+', label: 'Active Jobs', icon: 'briefcase' },
    { number: '5,000+', label: 'Companies', icon: 'building' },
    { number: '100k+', label: 'Job Seekers', icon: 'users' },
    { number: '2,300+', label: 'Hired This Month', icon: 'trend' },
  ];
}
