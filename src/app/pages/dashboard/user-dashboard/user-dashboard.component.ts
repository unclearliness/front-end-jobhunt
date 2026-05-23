import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  ChevronRight,
  CircleCheck,
  CircleDot,
  CircleX,
  Clock,
  DollarSign,
  Edit,
  Eye,
  FileText,
  LayoutDashboard,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Upload,
  User,
} from 'lucide-angular';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppCardComponent } from '../../../shared/components/app-card/app-card.component';
import { DashboardHeaderComponent } from '../../../shared/layouts/dashboard-header/dashboard-header.component';
import { AuthService } from '../../../services/auth.service';

type DashboardFrameId =
  | 'overview'
  | 'applied-jobs'
  | 'saved-jobs'
  | 'recommendations'
  | 'profile';

interface DashboardNavItem {
  readonly id: DashboardFrameId;
  readonly label: string;
  readonly icon: string;
  readonly buttonId: string;
  readonly frameId: string;
}

interface StatCard {
  readonly label: string;
  readonly value: string;
  readonly helper: string;
  readonly icon: string;
}

interface ActivityItem {
  readonly title: string;
  readonly company: string;
  readonly time: string;
}

interface ApplicationItem {
  readonly title: string;
  readonly company: string;
  readonly location: string;
  readonly appliedDate: string;
  readonly status: string;
  readonly statusClass: string;
  readonly nextStep: string;
}

interface DashboardJob {
  readonly initials: string;
  readonly title: string;
  readonly company: string;
  readonly location: string;
  readonly salary: string;
  readonly type: string;
  readonly posted: string;
  readonly tags: readonly string[];
  readonly match?: string;
}

interface ProfileDetail {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
}

@Component({
  selector: 'app-user-dashboard',
  imports: [DashboardHeaderComponent, LucideAngularModule, AppCardComponent, AppButtonComponent],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        Bookmark,
        BriefcaseBusiness,
        Building2,
        CalendarCheck,
        ChevronRight,
        CircleCheck,
        CircleDot,
        CircleX,
        Clock,
        DollarSign,
        Edit,
        Eye,
        FileText,
        LayoutDashboard,
        Mail,
        MapPin,
        Phone,
        Search,
        Send,
        Sparkles,
        Star,
        Trash2,
        TrendingUp,
        Upload,
        User,
      }),
    },
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly activeFrame = signal<DashboardFrameId>('overview');
  readonly userName = signal('John');
  readonly userInitial = computed(() => this.userName().charAt(0).toUpperCase() || 'J');

  readonly dashboardNavigation: readonly DashboardNavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'layout-dashboard',
      buttonId: 'button-dashboard-overview',
      frameId: 'frame-dashboard-overview',
    },
    {
      id: 'applied-jobs',
      label: 'Applied Jobs',
      icon: 'briefcase-business',
      buttonId: 'button-dashboard-applied-jobs',
      frameId: 'frame-dashboard-applied-jobs',
    },
    {
      id: 'saved-jobs',
      label: 'Saved Jobs',
      icon: 'bookmark',
      buttonId: 'button-dashboard-saved-jobs',
      frameId: 'frame-dashboard-saved-jobs',
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: 'sparkles',
      buttonId: 'button-dashboard-recommendations',
      frameId: 'frame-dashboard-recommendations',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'user',
      buttonId: 'button-dashboard-profile',
      frameId: 'frame-dashboard-profile',
    },
  ];

  readonly overviewStats: readonly StatCard[] = [
    { label: 'Applications', value: '12', helper: '+2 from last week', icon: 'briefcase-business' },
    { label: 'Interviews', value: '3', helper: 'Upcoming this week', icon: 'calendar-check' },
    { label: 'Saved Jobs', value: '5', helper: 'Jobs to review', icon: 'bookmark' },
  ];

  readonly recentActivities: readonly ActivityItem[] = [
    { title: 'Applied to Senior Developer', company: 'TechCorp Inc.', time: '2 days ago' },
    { title: 'Interview scheduled', company: 'DesignHub', time: '3 days ago' },
    { title: 'Saved Backend Engineer', company: 'CloudSystems', time: '5 days ago' },
  ];

  readonly applications: readonly ApplicationItem[] = [
    {
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      appliedDate: 'May 14, 2026',
      status: 'Under Review',
      statusClass: 'status-badge--blue',
      nextStep: 'Recruiter review',
    },
    {
      title: 'Product Designer',
      company: 'DesignHub',
      location: 'Remote',
      appliedDate: 'May 12, 2026',
      status: 'Interview',
      statusClass: 'status-badge--purple',
      nextStep: 'Technical call',
    },
    {
      title: 'Backend Engineer',
      company: 'CloudSystems',
      location: 'Austin, TX',
      appliedDate: 'May 8, 2026',
      status: 'Pending',
      statusClass: 'status-badge--yellow',
      nextStep: 'Awaiting response',
    },
    {
      title: 'Data Analyst',
      company: 'FinTech Solutions',
      location: 'New York, NY',
      appliedDate: 'May 1, 2026',
      status: 'Rejected',
      statusClass: 'status-badge--red',
      nextStep: 'Closed',
    },
  ];

  readonly savedJobs: readonly DashboardJob[] = [
    {
      initials: 'IL',
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'New York, NY',
      salary: '$130k - $180k',
      type: 'Full-time',
      posted: '1 week ago',
      tags: ['Product', 'Mid-Level'],
    },
    {
      initials: 'CS',
      title: 'Cloud DevOps Engineer',
      company: 'CloudSystems',
      location: 'Remote',
      salary: '$115k - $155k',
      type: 'Contract',
      posted: '1 day ago',
      tags: ['Cloud', 'Senior'],
    },
    {
      initials: 'DS',
      title: 'UX Researcher',
      company: 'DesignStudio',
      location: 'Los Angeles, CA',
      salary: '$95k - $125k',
      type: 'Full-time',
      posted: '3 days ago',
      tags: ['Research', 'Hybrid'],
    },
  ];

  readonly recommendations: readonly DashboardJob[] = [
    {
      initials: 'TC',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $160k',
      type: 'Full-time',
      posted: '2 days ago',
      tags: ['Angular', 'TypeScript', 'Senior'],
      match: '96% match',
    },
    {
      initials: 'NC',
      title: 'Frontend Platform Engineer',
      company: 'NextCloud',
      location: 'Remote',
      salary: '$125k - $170k',
      type: 'Full-time',
      posted: 'Today',
      tags: ['Design System', 'Remote'],
      match: '91% match',
    },
    {
      initials: 'SS',
      title: 'UI Engineer',
      company: 'ScaleSoft',
      location: 'Seattle, WA',
      salary: '$110k - $145k',
      type: 'Full-time',
      posted: '4 days ago',
      tags: ['UI', 'Accessibility'],
      match: '88% match',
    },
  ];

  readonly profileDetails: readonly ProfileDetail[] = [
    { label: 'Email', value: 'john.jobseeker@example.com', icon: 'mail' },
    { label: 'Phone', value: '+1 (555) 218-9042', icon: 'phone' },
    { label: 'Location', value: 'San Francisco, CA', icon: 'map-pin' },
    { label: 'Preferred role', value: 'Senior Frontend Developer', icon: 'briefcase-business' },
  ];

  ngOnInit(): void {
    if (typeof window === 'undefined' || !window.localStorage.getItem('accessToken')) {
      return;
    }

    this.authService.getAccount().subscribe({
      next: (account) => {
        this.userName.set(account.name);
      },
      error: () => {},
    });
  }

  selectFrame(frame: DashboardFrameId): void {
    this.activeFrame.set(frame);
  }

  isActive(frame: DashboardFrameId): boolean {
    return this.activeFrame() === frame;
  }
}
