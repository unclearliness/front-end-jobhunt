import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  CompanyCardComponent,
  CompanyCardData,
} from '../../shared/components/company-card/company-card.component';
import {
  FilterGroup,
  JobFilterSidebarComponent,
} from '../../shared/components/job-filter-sidebar/job-filter-sidebar.component';
import { JobSearchBannerComponent } from '../../shared/components/job-search-banner/job-search-banner.component';
import { DashboardHeaderComponent } from '../../shared/layouts/dashboard-header/dashboard-header.component';

export type ExploreCompany = CompanyCardData;

@Component({
  selector: 'app-explore-companies',
  imports: [
    CompanyCardComponent,
    DashboardHeaderComponent,
    JobFilterSidebarComponent,
    JobSearchBannerComponent,
  ],
  templateUrl: './explore-companies.component.html',
  styleUrl: './explore-companies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreCompaniesComponent {
  private readonly router = inject(Router);

  readonly companies: readonly ExploreCompany[] = [
    {
      id: 1,
      initials: 'TC',
      name: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      industry: 'Technology',
      description: 'Leading technology company building innovative solutions for the future of work.',
      openJobs: '12 open positions',
    },
    {
      id: 2,
      initials: 'IL',
      name: 'Innovation Labs',
      location: 'New York, NY',
      industry: 'E-commerce',
      description: 'Fast-growing startup revolutionizing the e-commerce industry.',
      openJobs: '8 open positions',
    },
    {
      id: 3,
      initials: 'DS',
      name: 'DesignStudio',
      location: 'Los Angeles, CA',
      industry: 'Design',
      description: 'Creative agency specializing in digital experiences and brand design.',
      openJobs: '5 open positions',
    },
    {
      id: 4,
      initials: 'DC',
      name: 'DataCorp',
      location: 'Boston, MA',
      industry: 'Technology',
      description: 'Data analytics platform helping businesses make better decisions.',
      openJobs: '15 open positions',
    },
    {
      id: 5,
      initials: 'CS',
      name: 'CloudSystems',
      location: 'Seattle, WA',
      industry: 'Technology',
      description: 'Cloud infrastructure company powering secure enterprise applications.',
      openJobs: '10 open positions',
    },
    {
      id: 6,
      initials: 'FS',
      name: 'FinTech Solutions',
      location: 'New York, NY',
      industry: 'Finance',
      description: 'Financial technology company building modern payment and banking tools.',
      openJobs: '7 open positions',
    },
    {
      id: 7,
      initials: 'HC',
      name: 'HealthCare Plus',
      location: 'Boston, MA',
      industry: 'Healthcare',
      description: 'Healthcare platform improving patient access and provider operations.',
      openJobs: '6 open positions',
    },
    {
      id: 8,
      initials: 'EU',
      name: 'EduLearn',
      location: 'Seattle, WA',
      industry: 'Education',
      description: 'Education company creating digital learning experiences for students.',
      openJobs: '4 open positions',
    },
  ];

  readonly filterGroups: readonly FilterGroup[] = [
    {
      title: 'Location',
      options: [
        { label: 'San Francisco, CA', checked: true },
        { label: 'New York, NY', checked: false },
        { label: 'Boston, MA', checked: false },
        { label: 'Seattle, WA', checked: false },
      ],
    },
    {
      title: 'Industry',
      options: [
        { label: 'Technology', checked: true },
        { label: 'Finance', checked: false },
        { label: 'Healthcare', checked: false },
        { label: 'Education', checked: false },
        { label: 'E-commerce', checked: false },
      ],
    },
    {
      title: 'Company Size',
      options: [
        { label: '1-50 employees', checked: false },
        { label: '51-500 employees', checked: false },
        { label: '500+ employees', checked: true },
      ],
    },
  ];

  onSearchSubmitted(): void {}

  onFiltersReset(): void {}

  onViewCompany(company: ExploreCompany): void {
    void this.router.navigate(['/companies', company.id]);
  }
}
