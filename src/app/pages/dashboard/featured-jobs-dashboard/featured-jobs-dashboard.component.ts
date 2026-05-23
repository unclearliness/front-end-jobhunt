import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { JobApi, JobService } from '../../../services/job.service';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import {
  JobCardComponent,
  JobCardData,
} from '../../../shared/components/job-card/job-card.component';
import { API_ENDPOINTS } from '../../../shared/constants/api-endpoints';

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
  private readonly jobService = inject(JobService);

  readonly jobs = toSignal(
    this.jobService.search(1, 4).pipe(
      map((jobs: JobApi[]) =>
        jobs.filter((job) => job.active).map((job) => ({
          id: job.id,
          initials: this.getInitials(job.company.name),
          logoUrl: job.company.logo
            ? `${API_ENDPOINTS.companies.logoBase}${job.company.logo}`
            : undefined,
          title: job.name,
          company: job.company.name,
          location: job.location,
          salary: this.formatSalary(job.salary),
          type: this.formatLevel(job.level),
          timePosted: this.formatDeadline(job.endDate),
          description: job.description,
        })),
      ),
    ),
  );

  onViewAllJobs(): void {
    void this.router.navigateByUrl('/find-jobs');
  }

  onViewDetails(job: Job): void {
    void this.router.navigate(['/jobs', job.id]);
  }

  private getInitials(companyName: string): string {
    return companyName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  private formatSalary(salary: number): string {
    return `${new Intl.NumberFormat('vi-VN').format(salary)} VND`;
  }

  private formatLevel(level: string): string {
    return level
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private formatDeadline(deadline: string): string {
    const parsedDate = new Date(deadline);
    if (Number.isNaN(parsedDate.getTime())) {
      return 'Open now';
    }

    return `Apply by ${new Intl.DateTimeFormat('vi-VN').format(parsedDate)}`;
  }
}
