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
import { JobService } from '../../../services/job.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { API_ENDPOINTS } from '../../../shared/constants/api-endpoints';
import { UserService } from '../../../services/user.service';
import { AppModalFormComponent, ModalFormField, ModalFormSubmitEvent } from '../../../shared/components/app-modal-form/app-modal-form.component';
import { ToastService } from '../../../services/toast.service';

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
interface JobApi {
  id: number;
  name: string;
  location: string;
  salary: number;
  quantity: number;
  level: string;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  company: JobCompanyApi;
  resumeStatus: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: string;
  address: string;
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

interface JobCompanyApi {
  id: number;
  name: string;
  description: string;
  address: string;
  logo: string | null;
  industry: string;
  companySize: number;
  founded: number;
}
@Component({
  selector: 'app-user-dashboard',
  imports: [DashboardHeaderComponent, LucideAngularModule, AppCardComponent, AppButtonComponent, AppModalFormComponent],
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
  private readonly jobService = inject(JobService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  readonly isApplyModalOpen = signal(false);

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

  readonly jobs = toSignal(
    this.jobService.getApplicationsByResume().pipe(
      map((responseList: any[]) =>
        responseList
          // Lọc theo thuộc tính active nằm bên trong đối tượng job
          .filter((item) => item.job && item.job.active)
          // Ánh xạ dữ liệu từ đối tượng job bên trong
          .map((item) => ({
            id: item.job.id,
            logoUrl: item.job.company?.logo
              ? `${API_ENDPOINTS.companies.logoBase}${item.job.company.logo}`
              : undefined,
            title: item.job.name,
            company: item.job.company?.name || 'Unknown Company',
            location: item.job.location,
            timePosted: this.formatDeadline(item.job.endDate),
            resumeStatus: item.resumeStatus,
          })),
      ),
    ),
  );

  readonly userProfile = signal<UserProfile | null>(null);

  readonly editProfileFields: readonly ModalFormField[] = [
    { key: 'name', label: 'Họ và tên', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'age', label: 'Tuổi', type: 'text', required: false },
    { key: 'gender', label: 'Giới tính', type: 'text', required: false },
    { key: 'address', label: 'Địa chỉ', type: 'text', required: false },
  ];

  readonly profileInitialValues = computed(() => {
    const profile = this.userProfile();
    if (!profile) return {};
    return {
      name: profile.name,
      email: profile.email,
      age: profile.age,
      gender: profile.gender,
      address: profile.address
    };
  });

  readonly editProfileSubmitAction = (event: ModalFormSubmitEvent) => this.onEditProfileSubmit(event);



  ngOnInit(): void {
    if (typeof window === 'undefined' || !window.localStorage.getItem('accessToken')) {
      return;
    }

    this.authService.getAccount().pipe(
      switchMap((account) => {
        this.userName.set(account.name);
        return this.userService.getUserProfile(account.id);
      })
    ).subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
      },
      error: (err) => {
        console.error('Lỗi khi tải thông tin tài khoản hoặc profile:', err);
      },
    });
  }


  selectFrame(frame: DashboardFrameId): void {
    this.activeFrame.set(frame);
  }

  isActive(frame: DashboardFrameId): boolean {
    return this.activeFrame() === frame;
  }

  private formatDeadline(deadline: string): string {
    const parsedDate = new Date(deadline);
    if (Number.isNaN(parsedDate.getTime())) {
      return 'Open now';
    }

    return `Apply by ${new Intl.DateTimeFormat('vi-VN').format(parsedDate)}`;
  }


  onApply(): void {
    this.isApplyModalOpen.set(true);
  }

  onCloseModal(): void {
    this.isApplyModalOpen.set(false);
  }

  onEditProfileSubmit(event: ModalFormSubmitEvent): void {
    const currentProfile = this.userProfile();
    if (!currentProfile) return;

    // Chuẩn bị dữ liệu cập nhật
    const updatedData: Partial<UserProfile> = {
      id: this.userProfile()?.id,
      name: event.values['name'] as string,
      email: event.values['email'] as string,
      age: Number(event.values['age']),
      gender: event.values['gender'] as string,
      address: event.values['address'] as string,
    };

    // Gọi API cập nhật
    this.userService.updateUserProfile(updatedData).subscribe({
      next: (updatedProfile) => {
        // Cập nhật lại thông tin mới vào signal để giao diện tự render lại
        this.userProfile.set(updatedProfile);
        this.userName.set(updatedProfile.name);
        // Đóng modal
        this.isApplyModalOpen.set(false);
        this.toastService.success('Profile updated successfully');
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật profile:', err);
      }
    });
  }






}
