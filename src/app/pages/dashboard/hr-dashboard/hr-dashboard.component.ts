import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  ChevronRight,
  CirclePlus,
  ClipboardList,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Globe,
  LayoutDashboard,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Upload,
  UserCheck,
  Users,
} from 'lucide-angular';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppCardComponent } from '../../../shared/components/app-card/app-card.component';
import { DashboardHeaderComponent } from '../../../shared/layouts/dashboard-header/dashboard-header.component';

type HrDashboardFrameId = 'overview' | 'post-job' | 'my-jobs' | 'applicants' | 'company-profile';

interface HrDashboardNavItem {
  readonly id: HrDashboardFrameId;
  readonly label: string;
  readonly icon: string;
  readonly buttonId: string;
  readonly frameId: string;
}

interface HrStatCard {
  readonly label: string;
  readonly value: string;
  readonly helper: string;
  readonly icon: string;
}

interface RecentApplication {
  readonly name: string;
  readonly role: string;
  readonly time: string;
}

interface JobPosting {
  readonly title: string;
  readonly location: string;
  readonly type: string;
  readonly applicants: string;
  readonly views: string;
  readonly status: string;
  readonly statusClass: string;
  readonly posted: string;
}

interface Applicant {
  readonly name: string;
  readonly role: string;
  readonly location: string;
  readonly stage: string;
  readonly stageClass: string;
  readonly score: string;
  readonly applied: string;
}

interface CompanyDetail {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
}

@Component({
  selector: 'app-hr-dashboard',
  imports: [DashboardHeaderComponent, LucideAngularModule, AppCardComponent, AppButtonComponent],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        BriefcaseBusiness,
        Building2,
        CalendarCheck,
        ChevronRight,
        CirclePlus,
        ClipboardList,
        DollarSign,
        Edit,
        Eye,
        FileText,
        Globe,
        LayoutDashboard,
        Mail,
        MapPin,
        Phone,
        Search,
        Send,
        ShieldCheck,
        Trash2,
        Upload,
        UserCheck,
        Users,
      }),
    },
  ],
  templateUrl: './hr-dashboard.component.html',
  styleUrl: './hr-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HrDashboardComponent {
  readonly activeFrame = signal<HrDashboardFrameId>('overview');

  readonly dashboardNavigation: readonly HrDashboardNavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'layout-dashboard',
      buttonId: 'button-hr-overview',
      frameId: 'frame-hr-overview',
    },
    {
      id: 'post-job',
      label: 'Post Job',
      icon: 'circle-plus',
      buttonId: 'button-hr-post-job',
      frameId: 'frame-hr-post-job',
    },
    {
      id: 'my-jobs',
      label: 'My Jobs',
      icon: 'briefcase-business',
      buttonId: 'button-hr-my-jobs',
      frameId: 'frame-hr-my-jobs',
    },
    {
      id: 'applicants',
      label: 'Applicants',
      icon: 'users',
      buttonId: 'button-hr-applicants',
      frameId: 'frame-hr-applicants',
    },
    {
      id: 'company-profile',
      label: 'Company Profile',
      icon: 'building-2',
      buttonId: 'button-hr-company-profile',
      frameId: 'frame-hr-company-profile',
    },
  ];

  readonly overviewStats: readonly HrStatCard[] = [
    { label: 'Active Jobs', value: '3', helper: 'Total: 5 jobs', icon: 'briefcase-business' },
    { label: 'Total Applicants', value: '105', helper: '+12 from last week', icon: 'users' },
    { label: 'Profile Views', value: '2,980', helper: 'This month', icon: 'eye' },
  ];

  readonly recentApplications: readonly RecentApplication[] = [
    { name: 'Sarah Johnson', role: 'Senior Frontend Developer', time: '1 hour ago' },
    { name: 'Michael Chen', role: 'Senior Frontend Developer', time: '3 hours ago' },
    { name: 'Emily Davis', role: 'Product Manager', time: '1 day ago' },
  ];

  readonly jobPostings: readonly JobPosting[] = [
    {
      title: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      type: 'Full-time',
      applicants: '42',
      views: '1,204',
      status: 'Active',
      statusClass: 'status-badge--green',
      posted: 'May 10, 2026',
    },
    {
      title: 'Product Manager',
      location: 'Remote',
      type: 'Full-time',
      applicants: '31',
      views: '856',
      status: 'Active',
      statusClass: 'status-badge--green',
      posted: 'May 6, 2026',
    },
    {
      title: 'UX Designer',
      location: 'Los Angeles, CA',
      type: 'Contract',
      applicants: '18',
      views: '512',
      status: 'Reviewing',
      statusClass: 'status-badge--yellow',
      posted: 'May 2, 2026',
    },
    {
      title: 'Backend Engineer',
      location: 'Austin, TX',
      type: 'Full-time',
      applicants: '14',
      views: '438',
      status: 'Draft',
      statusClass: 'status-badge--gray',
      posted: 'Apr 28, 2026',
    },
  ];

  readonly applicants: readonly Applicant[] = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      stage: 'Interview',
      stageClass: 'status-badge--purple',
      score: '94%',
      applied: '1 hour ago',
    },
    {
      name: 'Michael Chen',
      role: 'Senior Frontend Developer',
      location: 'Remote',
      stage: 'Under Review',
      stageClass: 'status-badge--blue',
      score: '88%',
      applied: '3 hours ago',
    },
    {
      name: 'Emily Davis',
      role: 'Product Manager',
      location: 'New York, NY',
      stage: 'New',
      stageClass: 'status-badge--green',
      score: '82%',
      applied: '1 day ago',
    },
    {
      name: 'David Kim',
      role: 'UX Designer',
      location: 'Los Angeles, CA',
      stage: 'Rejected',
      stageClass: 'status-badge--red',
      score: '64%',
      applied: '2 days ago',
    },
  ];

  readonly companyDetails: readonly CompanyDetail[] = [
    { label: 'Company', value: 'TechCorp Inc.', icon: 'building-2' },
    { label: 'Website', value: 'techcorp.example.com', icon: 'globe' },
    { label: 'Email', value: 'hiring@techcorp.example.com', icon: 'mail' },
    { label: 'Phone', value: '+1 (555) 412-8090', icon: 'phone' },
    { label: 'Location', value: 'San Francisco, CA', icon: 'map-pin' },
    { label: 'Verified', value: 'Employer account approved', icon: 'shield-check' },
  ];

  readonly benefits: readonly string[] = [
    'Hybrid work policy',
    'Health insurance',
    'Learning budget',
    'Annual performance bonus',
  ];

  selectFrame(frame: HrDashboardFrameId): void {
    this.activeFrame.set(frame);
  }

  isActive(frame: HrDashboardFrameId): boolean {
    return this.activeFrame() === frame;
  }
}
