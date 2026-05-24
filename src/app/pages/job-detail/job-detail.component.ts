import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ArrowLeft,
  Bookmark,
  Clock,
  DollarSign,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  MapPin,
  Share2,
} from 'lucide-angular';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FileService } from '../../services/file.service';
import { JobApi, JobService } from '../../services/job.service';
import { ResumeService } from '../../services/resume.service';
import { ToastService } from '../../services/toast.service';
import { AppBadgeComponent } from '../../shared/components/app-badge/app-badge.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppCardComponent } from '../../shared/components/app-card/app-card.component';
import {
  AppModalFormComponent,
  ModalFormField,
  ModalFormSubmitEvent,
} from '../../shared/components/app-modal-form/app-modal-form.component';
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

interface JobHeroDetail {
  readonly id: number;
  readonly initials: string;
  readonly logoUrl?: string;
  readonly title: string;
  readonly company: string;
  readonly location: string;
  readonly salary: string;
  readonly postedAt: string;
  readonly tags: readonly string[];
}

interface JobDetailSection {
  readonly title: string;
  readonly content?: string;
  readonly items?: readonly string[];
}

interface JobDetailState {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly companyId: number | null;
  readonly job: JobHeroDetail;
  readonly companyInfo: CompanyInfoData;
  readonly summaryItems: readonly QuickStatItem[];
  readonly sections: readonly JobDetailSection[];
}

const INITIAL_STATE: JobDetailState = {
  isLoading: true,
  errorMessage: null,
  companyId: null,
  job: {
    id: 0,
    initials: '--',
    title: 'Job Detail',
    company: 'Company',
    location: '--',
    salary: '--',
    postedAt: '--',
    tags: [],
  },
  companyInfo: {
    initials: '--',
    name: 'Company',
  },
  summaryItems: [],
  sections: [],
};

@Component({
  selector: 'app-job-detail',
  imports: [
    AppBadgeComponent,
    AppButtonComponent,
    AppCardComponent,
    AppModalFormComponent,
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
      useValue: new LucideIconProvider({
        ArrowLeft,
        Bookmark,
        Clock,
        DollarSign,
        MapPin,
        Share2,
      }),
    },
  ],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly jobService = inject(JobService);
  private readonly toastService = inject(ToastService);
  private readonly fileService = inject(FileService);
  private readonly resumeService = inject(ResumeService);

  readonly isApplyModalOpen = signal(false);
  readonly applyModalFields: readonly ModalFormField[] = [
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'you@example.com',
      required: true,
      hint: "We'll send confirmation and updates to this email.",
    },
    {
      key: 'resume',
      label: 'Resume/CV',
      type: 'file',
      required: true,
      accept: '.pdf,.doc,.docx',
      maxFileSizeMb: 5,
      hint: 'PDF, DOC, DOCX (max 5MB)',
      uploadHandler: (file) => this.fileService.upload(file),
    },
  ];


  readonly detailState = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => {
        if (!Number.isInteger(id) || id <= 0) {
          return of({
            ...INITIAL_STATE,
            isLoading: false,
            errorMessage: 'Job ID is invalid.',
          });
        }

        return this.jobService.getById(id).pipe(
          map((job) => this.createDetailState(job)),
          catchError(() =>
            of({
              ...INITIAL_STATE,
              isLoading: false,
              errorMessage: 'Unable to load job details.',
            }),
          ),
          startWith(INITIAL_STATE),
        );
      }),
    ),
    { initialValue: INITIAL_STATE },
  );

  onApply(): void {
    this.isApplyModalOpen.set(true);
  }

  onSave(): void { }

  onShare(): void { }

  onApplyModalClose(): void {
    this.isApplyModalOpen.set(false);
  }

  onApplyModalSubmit(event: ModalFormSubmitEvent): void {
    const uploadedResumeName = event.uploadedFiles['resume'];
    const email = event.values['email'];
    const jobId = this.detailState().job.id;

    if (typeof email !== 'string' || !email.trim() || !uploadedResumeName || !jobId) {
      this.toastService.error('Application data is incomplete.');
      return;
    }

    this.authService.getAccount().pipe(
      switchMap((account) =>
        this.resumeService.create({
          email: email.trim(),
          url: uploadedResumeName,
          userId: account.id,
          jobId,
        }),
      ),
    ).subscribe({
      next: () => {
        this.isApplyModalOpen.set(false);
        this.toastService.success('Application submitted successfully.');
      },
      error: () => {
        this.toastService.error('Unable to submit application.');
      },
    });
  }

  onViewCompanyProfile(): void {
    const companyId = this.detailState().companyId;

    if (!companyId) {
      return;
    }

    void this.router.navigate(['/companies', companyId]);
  }

  private createDetailState(job: JobApi): JobDetailState {
    const companyLogoUrl = job.company.logo
      ? `${API_ENDPOINTS.companies.logoBase}${job.company.logo}`
      : undefined;

    return {
      isLoading: false,
      errorMessage: null,
      companyId: job.company.id,
      job: {
        id: job.id,
        initials: this.getInitials(job.company.name),
        logoUrl: companyLogoUrl,
        title: job.name,
        company: job.company.name,
        location: job.location,
        salary: this.formatCurrency(job.salary),
        postedAt: `Apply by ${this.formatDate(job.endDate)}`,
        tags: [this.formatLevel(job.level), `${job.quantity} openings`, job.active ? 'Active' : 'Closed'],
      },
      companyInfo: {
        initials: this.getInitials(job.company.name),
        name: job.company.name,
        logoUrl: companyLogoUrl,
        location: job.company.address,
        badges: [
          { label: job.company.industry, variant: 'default' },
          { label: `${job.company.companySize} employees`, variant: 'outline' },
        ],
        description: job.company.description,
      },
      summaryItems: [
        { label: 'Level', value: this.formatLevel(job.level), icon: 'briefcase' },
        { label: 'Openings', value: String(job.quantity), icon: 'users' },
        { label: 'Salary', value: this.formatCurrency(job.salary), icon: 'dollar' },
        { label: 'Start Date', value: this.formatDate(job.startDate), icon: 'calendar' },
        { label: 'Deadline', value: this.formatDate(job.endDate), icon: 'calendar' },
        { label: 'Location', value: job.location, icon: 'location' },
      ],
      sections: [
        {
          title: 'Job Description',
          content: job.description,
        },
        {
          title: 'Application Timeline',
          items: [
            `Start date: ${this.formatDate(job.startDate)}`,
            `Application deadline: ${this.formatDate(job.endDate)}`,
            `Status: ${job.active ? 'Open' : 'Closed'}`,
          ],
        },
        {
          title: 'About the Company',
          content: job.company.description,
        },
      ],
    };
  }

  private formatCurrency(value: number): string {
    return `${new Intl.NumberFormat('vi-VN').format(value)} VND`;
  }

  private formatDate(value: string | null | undefined): string {
    if (!value) {
      return '--';
    }

    return new Intl.DateTimeFormat('vi-VN').format(new Date(value));
  }

  private formatLevel(level: string): string {
    return level
      .toLowerCase()
      .split(/[_\s]+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
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
