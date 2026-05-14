import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ArrowLeft,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
} from 'lucide-angular';
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

interface CompanySection {
  readonly title: string;
  readonly content?: string;
  readonly items?: readonly string[];
}

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
  readonly companyInfo: CompanyInfoData = {
    initials: 'TC',
    name: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    websiteLabel: 'techcorp.example.com',
    websiteUrl: 'https://techcorp.example.com',
    badges: [
      { label: 'Technology', variant: 'default' },
      { label: '500-1000 employees', variant: 'outline' },
    ],
  };

  readonly companyInfoRows: readonly QuickStatItem[] = [
    { label: 'Industry', value: 'Technology' },
    { label: 'Company Size', value: '500-1000 employees' },
    { label: 'Founded', value: '2015' },
    { label: 'Location', value: 'San Francisco, CA' },
    { label: 'Open Jobs', value: '5 positions' },
  ];

  readonly quickStats: readonly QuickStatItem[] = [
    { label: 'Team Size', value: '750+ employees', icon: 'users' },
    { label: 'Open Positions', value: '5 jobs', icon: 'briefcase' },
    { label: 'Founded', value: '2015', icon: 'calendar' },
  ];

  readonly sections: readonly CompanySection[] = [
    {
      title: 'Our Mission',
      content:
        'TechCorp is a leading technology company building innovative solutions for the future of work. We are passionate about creating products that empower teams to collaborate more effectively and achieve their goals.',
    },
    {
      title: 'What We Do',
      content:
        'We develop cutting-edge software solutions for enterprise clients, focusing on productivity tools, collaboration platforms, and automation technologies. Our products are used by millions of users worldwide across various industries.',
    },
    {
      title: 'Our Culture',
      content:
        'We believe in fostering a culture of innovation, collaboration, and continuous learning. Our team is composed of talented individuals from diverse backgrounds who share a passion for technology and making a positive impact.',
    },
    {
      title: 'Benefits & Perks',
      items: [
        'Competitive salary and equity packages',
        'Comprehensive health, dental, and vision insurance',
        'Flexible work arrangements and remote options',
        'Professional development budget ($5,000/year)',
        'Generous PTO and parental leave',
      ],
    },
  ];

  onFollowCompany(): void {}
}
