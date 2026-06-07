import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ArrowLeft,
  DollarSign,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  MapPin,
} from 'lucide-angular';
import { catchError, forkJoin, map, of, startWith, switchMap } from 'rxjs';
import { CompanyApi, CompanyService } from '../../services/company.service';
import { JobService } from '../../services/job.service';
import { AppBadgeComponent } from '../../shared/components/app-badge/app-badge.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppCardComponent } from '../../shared/components/app-card/app-card.component';
import {
  CompanyInfoComponent,
  CompanyInfoData,
} from '../../shared/components/company-info/company-info.component';
import {
  QuickStatItem,
  QuickStatsComponent,
} from '../../shared/components/quick-stats/quick-stats.component';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints';
import { DashboardHeaderComponent } from '../../shared/layouts/dashboard-header/dashboard-header.component';

interface CompanySection {
  readonly title: string;
  readonly content?: string;
  readonly items?: readonly string[];
}

interface CompanyDetailState {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly companyInfo: CompanyInfoData;
  readonly companyInfoRows: readonly QuickStatItem[];
  readonly quickStats: readonly QuickStatItem[];
  readonly sections: readonly CompanySection[];
  readonly jobs: readonly any[];
}

const INITIAL_STATE: CompanyDetailState = {
  isLoading: true,
  errorMessage: null,
  companyInfo: {
    initials: '--',
    name: 'Company',
  },
  companyInfoRows: [],
  quickStats: [],
  sections: [],
  jobs: [],
};

@Component({
  selector: 'app-company-detail',
  imports: [
    AppBadgeComponent,
    AppButtonComponent,
    AppCardComponent,
    CompanyInfoComponent,
    DashboardHeaderComponent,
    LucideAngularModule,
    QuickStatsComponent,
    RouterLink,
  ],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ ArrowLeft, DollarSign, MapPin }),
    },
  ],
  templateUrl: './company-detail.component.html',
  styleUrl: './company-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly companyService = inject(CompanyService);
  private readonly jobService = inject(JobService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  onBack(event: Event): void {
    event.preventDefault();
    this.location.back();
  }

  readonly detailState = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => {
        if (!Number.isInteger(id) || id <= 0) {
          return of({
            ...INITIAL_STATE,
            isLoading: false,
            errorMessage: 'Company ID is invalid.',
          });
        }

        return forkJoin({
          company: this.companyService.getById(id),
          jobsResponse: this.jobService.getByCompany(id).pipe(
            catchError(() => of({ data: { result: [] } }))
          )
        }).pipe(
          map(({ company, jobsResponse }) => {
            const jobs = (jobsResponse?.data?.result ?? jobsResponse?.data ?? []) as any[];
            return this.createDetailState(company, jobs);
          }),
          catchError(() =>
            of({
              ...INITIAL_STATE,
              isLoading: false,
              errorMessage: 'Unable to load company details.',
            }),
          ),
          startWith(INITIAL_STATE),
        );
      }),
    ),
    { initialValue: INITIAL_STATE },
  );

  onFollowCompany(): void {}

  onViewJobDetail(jobId: number): void {
    void this.router.navigate(['/jobs', jobId]);
  }

  formatCurrency(value: number): string {
    return `${new Intl.NumberFormat('vi-VN').format(value)} VND`;
  }

  formatLevel(level: string): string {
    if (!level) return '';
    return level
      .toLowerCase()
      .split(/[_\s]+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private createDetailState(company: CompanyApi, jobs: readonly any[]): CompanyDetailState {
    return {
      isLoading: false,
      errorMessage: null,
      companyInfo: {
        initials: this.getInitials(company.name),
        name: company.name,
        logoUrl: company.logo ? `${API_ENDPOINTS.companies.logoBase}${company.logo}` : undefined,
        location: company.address,
        badges: [
          { label: company.industry, variant: 'default' },
          { label: `${company.companySize} employees`, variant: 'outline' },
        ],
      },
      companyInfoRows: [
        { label: 'Industry', value: company.industry },
        { label: 'Company Size', value: `${company.companySize} employees` },
        { label: 'Founded', value: String(company.founded) },
        { label: 'Location', value: company.address },
      ],
      quickStats: [
        { label: 'Team Size', value: `${company.companySize} employees`, icon: 'users' },
        { label: 'Founded', value: String(company.founded), icon: 'calendar' },
      ],
      sections: [
        {
          title: 'About the Company',
          content: company.description,
        },
      ],
      jobs,
    };
  }

  private getInitials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }
}
