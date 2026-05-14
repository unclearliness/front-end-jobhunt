import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import {
  CompanyCardComponent,
  CompanyCardData,
} from '../../../shared/components/company-card/company-card.component';

export type Company = CompanyCardData;

@Component({
  selector: 'app-top-companies-dashboard',
  imports: [AppButtonComponent, CompanyCardComponent],
  templateUrl: './top-companies-dashboard.component.html',
  styleUrl: './top-companies-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopCompaniesDashboardComponent {
  private readonly router = inject(Router);

  readonly companies: readonly Company[] = [
    {
      id: 1,
      name: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      description: 'Leading technology company building...',
      openJobs: '12 open jobs',
    },
    {
      id: 2,
      name: 'Innovation Labs',
      location: 'New York, NY',
      description: 'Fast-growing startup revolutionizing the e-...',
      openJobs: '8 open jobs',
    },
    {
      id: 3,
      name: 'DesignStudio',
      location: 'Los Angeles, CA',
      description: 'Creative agency specializing in digital experiences and...',
      openJobs: '5 open jobs',
    },
    {
      id: 4,
      name: 'DataCorp',
      location: 'Boston, MA',
      description: 'Data analytics platform helping businesses make...',
      openJobs: '15 open jobs',
    },
  ];

  onViewAllCompanies(): void {
    void this.router.navigateByUrl('/companies');
  }

  onViewCompany(company: Company): void {
    void this.router.navigate(['/companies', company.id]);
  }
}
