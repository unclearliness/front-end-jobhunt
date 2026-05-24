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
      // Định dạng filter: name ~ 'query'
      const filter = query ? `name ~ '${query}'` : undefined;
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

  readonly filterGroups: readonly FilterGroup[] = [
    {
      title: 'Location',
      options: [
        { label: 'Ha Noi', checked: true },
        { label: 'Ho Chi Minh City', checked: false },
        { label: 'Da Nang', checked: false },
        { label: 'Binh Duong', checked: false },
      ],
    },
    {
      title: 'Industry',
      options: [
        { label: 'Software Development', checked: true },
        { label: 'Cloud Infrastructure', checked: false },
        { label: 'Fintech', checked: false },
        { label: 'HealthTech', checked: false },
        { label: 'Logistics Technology', checked: false },
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
