import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
import { DashboardHeaderComponent } from '../../shared/layouts/dashboard-header/dashboard-header.component';

interface JobDetail {
  readonly initials: string;
  readonly title: string;
  readonly company: string;
  readonly location: string;
  readonly salary: string;
  readonly postedAt: string;
  readonly tags: readonly string[];
  readonly aboutRole: string;
  readonly responsibilities: readonly string[];
  readonly qualifications: readonly string[];
}

@Component({
  selector: 'app-job-detail',
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
  private readonly router = inject(Router);

  readonly job: JobDetail = {
    initials: 'TC',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120k - $160k',
    postedAt: '2 days ago',
    tags: ['Full-time', 'Senior', 'Engineering'],
    aboutRole:
      'We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building and maintaining modern web applications using React, TypeScript, and the latest web technologies.',
    responsibilities: [
      'Develop new user-facing features using React and TypeScript',
      'Build reusable components and frontend libraries',
      'Optimize applications for maximum speed and scalability',
      'Collaborate with designers and backend engineers',
      'Participate in code reviews and mentor junior developers',
    ],
    qualifications: [
      '5+ years of experience in frontend development',
      'Expert knowledge of React, TypeScript, and modern JavaScript',
      'Strong understanding of responsive design and CSS',
      'Experience with state management tools',
      'Excellent communication and teamwork skills',
    ],
  };

  readonly companyInfo: CompanyInfoData = {
    initials: 'TC',
    name: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    badges: [{ label: 'Technology', variant: 'outline' }],
    description:
      'TechCorp is a leading technology company building innovative solutions for the future of work. We are a fast-growing team of talented individuals passionate about making a difference.',
  };

  readonly summaryItems: readonly QuickStatItem[] = [
    { label: 'Job Type', value: 'Full-time' },
    { label: 'Experience', value: 'Senior Level' },
    { label: 'Salary', value: '$120k - $160k' },
    { label: 'Location', value: 'San Francisco, CA' },
  ];

  onApply(): void {}

  onSave(): void {}

  onShare(): void {}

  onViewCompanyProfile(): void {
    void this.router.navigate(['/companies', 1]);
  }
}
