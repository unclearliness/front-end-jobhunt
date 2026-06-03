import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
import { JobService } from '../../services/job.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints';
import { AppPaginationComponent } from "../../shared/components/app-pagination/app-pagination.component";

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
    AppPaginationComponent
  ],
  templateUrl: './find-jobs-page.component.html',
  styleUrl: './find-jobs-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindJobsPageComponent {
  private readonly router = inject(Router);
  private readonly jobService = inject(JobService);

  readonly currentPage = signal(1);
  readonly pageSize = signal(9); // 9 matches the 3-column layout nicely
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);
  readonly searchQuery = signal<string>('');


  private readonly searchParams$ = toObservable(
    computed(() => {
      const query = this.searchQuery();
      const activeFilters: string[] = [];
      if (query) {
        activeFilters.push(`name ~ '${query}'`);
      }
      // Scan through selected filters
      this.filterGroups().forEach(group => {
        const checkedLabels = group.options.filter(o => o.checked);
        if (checkedLabels.length > 0) {
          if (group.title === 'Salary') {
            const orConditions = checkedLabels
              .map(o => {
                if (o.label === 'Under 10,000,000 VND') {
                  return 'salary <= 10000000';
                } else if (o.label === '10,000,000 - 20,000,000 VND') {
                  return '(salary >= 10000000 and salary <= 20000000)';
                } else if (o.label === '20,000,000 - 50,000,000 VND') {
                  return '(salary >= 20000000 and salary <= 50000000)';
                } else if (o.label === 'Over 50,000,000 VND') {
                  return 'salary > 50000000';
                }
                return '';
              })
              .filter(Boolean)
              .join(' or ');

            if (orConditions) {
              activeFilters.push(`(${orConditions})`);
            }
          } else {
            const fieldName = group.title === 'Location' ? 'location' : 'level';
            const orConditions = checkedLabels
              .map(o => `${fieldName} ~ '${o.label}'`)
              .join(' or ');

            activeFilters.push(`(${orConditions})`);
          }
        }
      });
      const filter = activeFilters.length > 0 ? activeFilters.join(' and ') : undefined;
      return {
        page: this.currentPage(),
        size: this.pageSize(),
        filter
      };
    })
  );

  private readonly searchResponse = toSignal(
    this.searchParams$.pipe(
      switchMap(({ page, size, filter }) =>
        this.jobService.searchPaginated(page, size, filter).pipe(
          tap((response: any) => {
            const meta = response?.data?.meta;
            if (meta) {
              this.totalPages.set(meta.pages || 1);
              this.totalItems.set(meta.total || 0);
            }
          })
        )
      )
    ),
    { initialValue: null }
  );

  readonly jobs = computed(() => {
    const response = this.searchResponse();
    const list = response?.data?.result || [];
    return list.map((job: any) => ({
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
      skills: job.skill || job.skills || [],
    }))
  });

  readonly filterGroups = signal<FilterGroup[]>([
    {
      title: 'Location',
      options: [
        { label: 'Ha Noi', checked: false },
        { label: 'Ho Chi Minh City', checked: false },
        { label: 'Da Nang', checked: false },
        { label: 'Binh Duong', checked: false },
      ],
    },
    {
      title: 'Experience Level',
      options: [
        { label: 'INTERN', checked: false },
        { label: 'FRESHER', checked: false },
        { label: 'JUNIOR', checked: false },
        { label: 'MIDDLE', checked: false },
        { label: 'SENIOR', checked: false },
      ],
    },
    {
      title: 'Salary',
      options: [
        { label: 'Under 10,000,000 VND', checked: false },
        { label: '10,000,000 - 20,000,000 VND', checked: false },
        { label: '20,000,000 - 50,000,000 VND', checked: false },
        { label: 'Over 50,000,000 VND', checked: false },
      ],
    },
  ]);

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

  onFilterChanged(event: { groupTitle: string; optionLabel: string; checked: boolean }): void {
    this.filterGroups.update(groups =>
      groups.map(g => g.title === event.groupTitle
        ? {
          ...g,
          options: g.options.map(o => o.label === event.optionLabel ? { ...o, checked: !o.checked } : o)
        }
        : g
      )
    );
    this.currentPage.set(1);
  }

  onSearchSubmitted(keyword: string): void {
    this.searchQuery.set(keyword);
    this.currentPage.set(1);
  }

  onFiltersReset(): void {
    this.filterGroups.update(groups =>
      groups.map(g => ({
        ...g,
        options: g.options.map(o => ({ ...o, checked: false }))
      }))
    );
    this.currentPage.set(1);
  }

  onViewDetails(job: JobCardData): void {
    void this.router.navigate(['/jobs', job.id]);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
