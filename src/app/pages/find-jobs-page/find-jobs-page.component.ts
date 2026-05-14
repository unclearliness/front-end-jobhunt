import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  JobCardComponent,
  JobCardData,
} from '../../shared/components/job-card/job-card.component';
import {
  FilterGroup,
  JobFilterSidebarComponent,
} from '../../shared/components/job-filter-sidebar/job-filter-sidebar.component';
import { JobSearchBannerComponent } from '../../shared/components/job-search-banner/job-search-banner.component';
import { DashboardHeaderComponent } from '../../shared/layouts/dashboard-header/dashboard-header.component';

export interface JobSearchResult extends JobCardData {
  readonly description: string;
  readonly tags: readonly string[];
}

@Component({
  selector: 'app-find-jobs-page',
  imports: [
    DashboardHeaderComponent,
    JobCardComponent,
    JobFilterSidebarComponent,
    JobSearchBannerComponent,
  ],
  templateUrl: './find-jobs-page.component.html',
  styleUrl: './find-jobs-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindJobsPageComponent {
  private readonly router = inject(Router);

  readonly jobs: readonly JobSearchResult[] = [
    {
      id: 1,
      initials: 'TC',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      description: 'Build modern web applications using React and TypeScript',
      location: 'San Francisco, CA',
      salary: '$120k - $160k',
      type: 'Full-time',
      timePosted: '2 days ago',
      tags: ['Full-time', 'Senior'],
    },
    {
      id: 2,
      initials: 'IL',
      title: 'Product Manager',
      company: 'Innovation Labs',
      description: 'Lead product strategy and roadmap for our flagship products',
      location: 'New York, NY',
      salary: '$130k - $180k',
      type: 'Full-time',
      timePosted: '1 week ago',
      tags: ['Full-time', 'Mid-Level'],
    },
    {
      id: 3,
      initials: 'DS',
      title: 'UX Designer',
      company: 'DesignStudio',
      description: 'Create polished product experiences for web and mobile teams',
      location: 'Los Angeles, CA',
      salary: '$95k - $130k',
      type: 'Full-time',
      timePosted: '3 days ago',
      tags: ['Full-time', 'Mid-Level'],
    },
    {
      id: 4,
      initials: 'DC',
      title: 'Backend Engineer',
      company: 'DataCorp',
      description: 'Design reliable APIs and data services for enterprise products',
      location: 'Austin, TX',
      salary: '$125k - $165k',
      type: 'Full-time',
      timePosted: '5 days ago',
      tags: ['Full-time', 'Senior'],
    },
    {
      id: 5,
      initials: 'CS',
      title: 'Cloud DevOps Engineer',
      company: 'CloudSystems',
      description: 'Own cloud infrastructure, CI/CD pipelines, and observability',
      location: 'Remote',
      salary: '$115k - $155k',
      type: 'Contract',
      timePosted: '1 day ago',
      tags: ['Contract', 'Senior'],
    },
    {
      id: 6,
      initials: 'FS',
      title: 'Data Analyst',
      company: 'FinTech Solutions',
      description: 'Turn product and customer data into clear operating insights',
      location: 'New York, NY',
      salary: '$80k - $115k',
      type: 'Full-time',
      timePosted: '4 days ago',
      tags: ['Full-time', 'Entry Level'],
    },
  ];

  readonly filterGroups: readonly FilterGroup[] = [
    {
      title: 'Job Type',
      options: [
        { label: 'Full-time', checked: true },
        { label: 'Part-time', checked: false },
        { label: 'Contract', checked: false },
        { label: 'Internship', checked: false },
      ],
    },
    {
      title: 'Experience Level',
      options: [
        { label: 'Entry Level', checked: false },
        { label: 'Mid-Level', checked: true },
        { label: 'Senior', checked: true },
      ],
    },
    {
      title: 'Location',
      options: [
        { label: 'Remote', checked: false },
        { label: 'San Francisco, CA', checked: true },
        { label: 'New York, NY', checked: false },
        { label: 'Austin, TX', checked: false },
      ],
    },
    {
      title: 'Salary Range',
      options: [
        { label: '$50k - $80k', checked: false },
        { label: '$80k - $120k', checked: false },
        { label: '$120k - $160k', checked: true },
        { label: '$160k+', checked: false },
      ],
    },
  ];

  onSearchSubmitted(): void {}

  onFiltersReset(): void {}

  onViewDetails(job: JobCardData): void {
    void this.router.navigate(['/jobs', job.id]);
  }
}
