import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ArrowLeft,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
} from 'lucide-angular';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { CompanyApi, CompanyService } from '../../services/company.service';
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
};

@Component({
  selector: 'app-company-detail',
  imports: [
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
      useValue: new LucideIconProvider({ ArrowLeft }),
    },
  ],
  templateUrl: './company-detail.component.html',
  styleUrl: './company-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly companyService = inject(CompanyService);
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

        return this.companyService.getById(id).pipe(
          map((company) => this.createDetailState(company)),
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

  private createDetailState(company: CompanyApi): CompanyDetailState {
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
