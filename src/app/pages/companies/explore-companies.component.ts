import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { CompanyService } from '../../services/company.service';
import {
  CompanyCardComponent,
  CompanyCardData,
} from '../../shared/components/company-card/company-card.component';
import {
  FilterGroup,
  JobFilterSidebarComponent,
} from '../../shared/components/job-filter-sidebar/job-filter-sidebar.component';
import { JobSearchBannerComponent } from '../../shared/components/job-search-banner/job-search-banner.component';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints';
import { DashboardHeaderComponent } from '../../shared/layouts/dashboard-header/dashboard-header.component';
import { AppPaginationComponent } from '../../shared/components/app-pagination/app-pagination.component';

export type ExploreCompany = CompanyCardData;

@Component({
  selector: 'app-explore-companies',
  imports: [
    CompanyCardComponent,
    DashboardHeaderComponent,
    JobFilterSidebarComponent,
    JobSearchBannerComponent,
    AppPaginationComponent,
  ],
  templateUrl: './explore-companies.component.html',
  styleUrl: './explore-companies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreCompaniesComponent {
  private readonly router = inject(Router);
  private readonly companyService = inject(CompanyService);

  readonly currentPage = signal(1);
  readonly pageSize = signal(9); // 9 matches the 3-column layout nicely
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);
  readonly searchQuery = signal<string>('');

  private readonly searchParams$ = toObservable(
    computed(() => {
      const query = this.searchQuery();
      // Filter format: name ~ 'query'
      const activeFilters: string[] = [];
      if (query) {
        activeFilters.push(`name ~ '${query}'`);
      }
      // Scan through selected filters
      this.filterGroups().forEach(group => {
        const checkedLabels = group.options.filter(o => o.checked);
        if (checkedLabels.length > 0) {
          if (group.title === 'Company Size') {
            const orConditions = checkedLabels
              .map(o => {
                if (o.label === '1-50 employees') {
                  return 'companySize <= 50';
                } else if (o.label === '51-500 employees') {
                  return '(companySize >= 51 and companySize <= 500)';
                } else if (o.label === '500+ employees') {
                  return 'companySize > 500';
                }
                return '';
              })
              .filter(Boolean)
              .join(' or ');

            if (orConditions) {
              activeFilters.push(`(${orConditions})`);
            }
          } else {
            const fieldName = group.title === 'Location' ? 'address' : group.title.toLowerCase();
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
        this.companyService.searchPaginated(page, size, filter).pipe(
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

  readonly companies = computed(() => {
    const response = this.searchResponse();
    const list = response?.data?.result || [];
    return list.map((company: any) => ({
      id: company.id,
      name: company.name,
      location: company.address,
      description: company.description,
      logoUrl: company.logo
        ? `${API_ENDPOINTS.companies.logoBase}${company.logo}`
        : undefined,
      openJobs: 'View jobs',
    })) as ExploreCompany[];
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
      title: 'Industry',
      options: [
        { label: 'IT_SOFTWARE', checked: false },
        { label: 'FINANCE_BANKING', checked: false },
        { label: 'E_COMMERCE', checked: false },
        { label: 'MARKETING_MEDIA', checked: false },
        { label: 'EDUCATION', checked: false },
        { label: 'HEALTHCARE', checked: false },
        { label: 'OTHER', checked: false },
      ],
    },
    {
      title: 'Company Size',
      options: [
        { label: '1-50 employees', checked: false },
        { label: '51-500 employees', checked: false },
        { label: '500+ employees', checked: false },
      ],
    },
  ]);

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
    this.currentPage.set(1); // Reset to page 1
  }

  onSearchSubmitted(keyword: string): void {
    this.searchQuery.set(keyword);
    this.currentPage.set(1);
  }

  onFiltersReset(): void {
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onViewCompany(company: ExploreCompany): void {
    void this.router.navigate(['/companies', company.id]);
  }
}
