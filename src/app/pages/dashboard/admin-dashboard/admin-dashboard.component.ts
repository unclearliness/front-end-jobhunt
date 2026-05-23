import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  BriefcaseBusiness,
  Building2,
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  CircleCheck,
  CircleX,
  ClipboardList,
  Edit,
  Eye,
  LayoutDashboard,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-angular';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppCardComponent } from '../../../shared/components/app-card/app-card.component';
import { DashboardHeaderComponent } from '../../../shared/layouts/dashboard-header/dashboard-header.component';

type AdminFrameId =
  | 'overview'
  | 'users'
  | 'companies'
  | 'job-postings'
  | 'roles'
  | 'permissions';

interface AdminNavItem {
  readonly id: AdminFrameId;
  readonly label: string;
  readonly icon: string;
  readonly buttonId: string;
  readonly frameId: string;
}

interface AdminStat {
  readonly label: string;
  readonly value: string;
  readonly helper: string;
  readonly icon: string;
}

interface ActivityItem {
  readonly title: string;
  readonly detail: string;
  readonly time: string;
}

interface UserRow {
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly status: string;
  readonly statusClass: string;
  readonly joined: string;
}

interface CompanyRow {
  readonly name: string;
  readonly owner: string;
  readonly jobs: string;
  readonly status: string;
  readonly statusClass: string;
  readonly verified: string;
}

interface JobPostingRow {
  readonly title: string;
  readonly company: string;
  readonly applicants: string;
  readonly status: string;
  readonly statusClass: string;
  readonly posted: string;
}

interface RoleRow {
  readonly name: string;
  readonly description: string;
  readonly users: string;
  readonly permissions: string;
}

interface PermissionGroup {
  readonly name: string;
  readonly description: string;
  readonly enabled: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [DashboardHeaderComponent, LucideAngularModule, AppCardComponent, AppButtonComponent],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        BriefcaseBusiness,
        Building2,
        ChartNoAxesColumnIncreasing,
        ChevronRight,
        CircleCheck,
        CircleX,
        ClipboardList,
        Edit,
        Eye,
        LayoutDashboard,
        Search,
        ShieldCheck,
        Trash2,
        UserCheck,
        Users,
      }),
    },
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  readonly activeFrame = signal<AdminFrameId>('overview');

  readonly dashboardNavigation: readonly AdminNavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'layout-dashboard',
      buttonId: 'button-admin-overview',
      frameId: 'frame-admin-overview',
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'users',
      buttonId: 'button-admin-users',
      frameId: 'frame-admin-users',
    },
    {
      id: 'companies',
      label: 'Companies',
      icon: 'building-2',
      buttonId: 'button-admin-companies',
      frameId: 'frame-admin-companies',
    },
    {
      id: 'job-postings',
      label: 'Job Postings',
      icon: 'briefcase-business',
      buttonId: 'button-admin-job-postings',
      frameId: 'frame-admin-job-postings',
    },
    {
      id: 'roles',
      label: 'Roles',
      icon: 'user-check',
      buttonId: 'button-admin-roles',
      frameId: 'frame-admin-roles',
    },
    {
      id: 'permissions',
      label: 'Permissions',
      icon: 'shield-check',
      buttonId: 'button-admin-permissions',
      frameId: 'frame-admin-permissions',
    },
  ];

  readonly overviewStats: readonly AdminStat[] = [
    { label: 'Total Users', value: '102,435', helper: '+12.5% from last month', icon: 'users' },
    { label: 'Total Companies', value: '5,234', helper: '+8.2% from last month', icon: 'building-2' },
    { label: 'Total Jobs', value: '12,567', helper: '+15.3% from last month', icon: 'briefcase-business' },
    {
      label: 'Applications',
      value: '45,892',
      helper: '+22.1% from last month',
      icon: 'chart-no-axes-column-increasing',
    },
  ];

  readonly recentActivities: readonly ActivityItem[] = [
    { title: 'New user registered', detail: 'John Doe', time: '5 minutes ago' },
    { title: 'Company verified', detail: 'TechCorp Inc.', time: '1 hour ago' },
    { title: 'Job posted', detail: 'Innovation Labs', time: '2 hours ago' },
    { title: 'Application submitted', detail: 'Sarah Johnson', time: '3 hours ago' },
  ];

  readonly quickStats: readonly { label: string; value: string }[] = [
    { label: 'Active Job Seekers', value: '85,234' },
    { label: 'Active Employers', value: '4,521' },
    { label: 'Jobs Posted This Month', value: '1,234' },
    { label: 'Successful Hires', value: '2,845' },
  ];

  readonly users: readonly UserRow[] = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Job Seeker',
      status: 'Active',
      statusClass: 'status-badge--green',
      joined: 'May 12, 2026',
    },
    {
      name: 'HoidaNit',
      email: 'hr@techcorp.example.com',
      role: 'HR',
      status: 'Verified',
      statusClass: 'status-badge--blue',
      joined: 'May 10, 2026',
    },
    {
      name: 'Linh Tran',
      email: 'linh@example.com',
      role: 'Admin',
      status: 'Active',
      statusClass: 'status-badge--green',
      joined: 'Apr 28, 2026',
    },
    {
      name: 'David Kim',
      email: 'david@example.com',
      role: 'Job Seeker',
      status: 'Suspended',
      statusClass: 'status-badge--red',
      joined: 'Apr 22, 2026',
    },
  ];

  readonly companies: readonly CompanyRow[] = [
    {
      name: 'TechCorp Inc.',
      owner: 'HoidaNit',
      jobs: '12',
      status: 'Verified',
      statusClass: 'status-badge--green',
      verified: 'May 14, 2026',
    },
    {
      name: 'Innovation Labs',
      owner: 'Maya Chen',
      jobs: '8',
      status: 'Pending',
      statusClass: 'status-badge--yellow',
      verified: 'Awaiting review',
    },
    {
      name: 'CloudSystems',
      owner: 'Alex Rivera',
      jobs: '5',
      status: 'Verified',
      statusClass: 'status-badge--green',
      verified: 'May 8, 2026',
    },
  ];

  readonly jobPostings: readonly JobPostingRow[] = [
    {
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      applicants: '42',
      status: 'Active',
      statusClass: 'status-badge--green',
      posted: 'May 15, 2026',
    },
    {
      title: 'Product Manager',
      company: 'Innovation Labs',
      applicants: '31',
      status: 'Under Review',
      statusClass: 'status-badge--blue',
      posted: 'May 13, 2026',
    },
    {
      title: 'Backend Engineer',
      company: 'CloudSystems',
      applicants: '18',
      status: 'Flagged',
      statusClass: 'status-badge--red',
      posted: 'May 11, 2026',
    },
  ];

  readonly roles: readonly RoleRow[] = [
    {
      name: 'Admin',
      description: 'Full platform management and security controls',
      users: '8',
      permissions: '24',
    },
    {
      name: 'HR',
      description: 'Manage companies, job postings, and applicants',
      users: '4,521',
      permissions: '12',
    },
    {
      name: 'User',
      description: 'Browse jobs, save jobs, and submit applications',
      users: '85,234',
      permissions: '7',
    },
  ];

  readonly permissions: readonly PermissionGroup[] = [
    {
      name: 'User Management',
      description: 'Create, edit, suspend, and verify user accounts',
      enabled: true,
    },
    {
      name: 'Company Moderation',
      description: 'Approve company profiles and employer verification requests',
      enabled: true,
    },
    {
      name: 'Job Posting Review',
      description: 'Review, publish, flag, or remove job postings',
      enabled: true,
    },
    {
      name: 'Role Assignment',
      description: 'Assign admin, HR, and user roles across the platform',
      enabled: false,
    },
  ];

  selectFrame(frame: AdminFrameId): void {
    this.activeFrame.set(frame);
  }

  isActive(frame: AdminFrameId): boolean {
    return this.activeFrame() === frame;
  }
}
