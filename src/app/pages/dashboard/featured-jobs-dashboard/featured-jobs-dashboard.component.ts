import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import {
  JobCardComponent,
  JobCardData,
} from '../../../shared/components/job-card/job-card.component';

export type Job = JobCardData;

@Component({
  selector: 'app-featured-jobs-dashboard',
  imports: [AppButtonComponent, JobCardComponent],
  templateUrl: './featured-jobs-dashboard.component.html',
  styleUrl: './featured-jobs-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedJobsDashboardComponent {
  private readonly router = inject(Router);

  readonly jobs: readonly Job[] = [
    {
      id: 1,
      initials: 'TC',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $160k',
      type: 'Full-time',
      timePosted: '2 days ago',
    },
    {
      id: 2,
      initials: 'IL',
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'New York, NY',
      salary: '$130k - $180k',
      type: 'Full-time',
      timePosted: '1 week ago',
    },
    {
      id: 3,
      initials: 'DS',
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'Remote',
      salary: '$90k - $120k',
      type: 'Contract',
      timePosted: '3 days ago',
    },
    {
      id: 4,
      initials: 'DC',
      title: 'Data Scientist',
      company: 'DataCorp',
      location: 'Boston, MA',
      salary: '$140k - $190k',
      type: 'Full-time',
      timePosted: '5 days ago',
    },
  ];

  onViewAllJobs(): void {}

  onViewDetails(job: Job): void {
    void this.router.navigate(['/jobs', job.id]);
  }
}
