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
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { API_ENDPOINTS } from '../../../shared/constants/api-endpoints';
import { UserService } from '../../../services/user.service';
import { AppModalFormComponent, ModalFormField, ModalFormSubmitEvent } from '../../../shared/components/app-modal-form/app-modal-form.component';
import { ToastService } from '../../../services/toast.service';
import { FileService } from '../../../services/file.service';
import { ResumeService } from '../../../services/resume.service';

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
  skill: any[];
}

interface UserProfile {
  id: number;
  logo?: string;
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
  imports: [DashboardHeaderComponent, LucideAngularModule, AppCardComponent, AppButtonComponent, AppModalFormComponent, RouterLink],
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
  private readonly fileService = inject(FileService);

  readonly activeFrame = signal<DashboardFrameId>('overview');
  readonly userName = signal('John');
  readonly userInitial = computed(() => this.userName().charAt(0).toUpperCase() || 'J');
  private readonly jobService = inject(JobService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly resumeService = inject(ResumeService);

  readonly isApplyModalOpen = signal(false);
  readonly isEditResumeModalOpen = signal(false);
  readonly editingResumeId = signal<number | null>(null);
  readonly editingResumeOldUrl = signal<string>('');
  readonly editResumeInitialValues = signal<any>({});

  readonly editResumeModalFields: readonly ModalFormField[] = [
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
      required: false,
      accept: '.pdf,.doc,.docx',
      maxFileSizeMb: 5,
      hint: 'PDF, DOC, DOCX (max 5MB)',
      uploadHandler: (file) => this.fileService.upload(file),
    },
  ];

  readonly userAvatarUrl = computed(() => {
    const profile = this.userProfile();
    return profile?.logo
      ? `${API_ENDPOINTS.companies.logoBase}${profile.logo}`
      : null;
  });

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
      id: 'profile',
      label: 'Profile',
      icon: 'user',
      buttonId: 'button-dashboard-profile',
      frameId: 'frame-dashboard-profile',
    },
  ];

  readonly savedJobs = signal<any[]>([]);

  readonly overviewStats = computed<StatCard[]>(() => {
    const appliedCount = this.jobs()?.length || 0;
    const savedCount = this.savedJobs()?.length || 0;
    return [
      { label: 'Applications', value: String(appliedCount), helper: 'Submitted applications', icon: 'briefcase-business' },
      { label: 'Saved Jobs', value: String(savedCount), helper: 'Jobs bookmarked', icon: 'bookmark' },
    ];
  });

  readonly recentActivities: readonly ActivityItem[] = [
    { title: 'Applied to Senior Developer', company: 'TechCorp Inc.', time: '2 days ago' },
    { title: 'Interview scheduled', company: 'DesignHub', time: '3 days ago' },
    { title: 'Saved Backend Engineer', company: 'CloudSystems', time: '5 days ago' },
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

  readonly jobs = signal<any[]>([]);

  loadAppliedJobs(): void {
    if (typeof window === 'undefined' || !window.localStorage.getItem('accessToken')) {
      return;
    }
    this.jobService.getApplicationsByResume().pipe(
      map((responseList: any[]) =>
        responseList
          .filter((item) => item.job && item.job.active)
          .map((item) => ({
            id: item.job.id,
            resumeId: item.resumeId,
            logoUrl: item.job.company?.logo
              ? `${API_ENDPOINTS.companies.logoBase}${item.job.company.logo}`
              : undefined,
            title: item.job.name,
            company: item.job.company?.name || 'Unknown Company',
            location: item.job.location,
            timePosted: this.formatDeadline(item.job.endDate),
            resumeStatus: item.resumeStatus,
            createdAt: this.formatDate(item.job.createdAt),
          })),
      ),
    ).subscribe({
      next: (data) => {
        this.jobs.set(data);
      },
      error: (err) => {
        console.error('Error loading applied jobs:', err);
      }
    });
  }

  readonly userProfile = signal<UserProfile | null>(null);

  readonly editProfileFields: readonly ModalFormField[] = [
    { key: 'name', label: 'Full Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'age', label: 'Age', type: 'text', required: false },
    { key: 'gender', label: 'Gender', type: 'text', required: false },
    { key: 'address', label: 'Address', type: 'text', required: false },
    {
      key: 'logo',
      label: 'Avatar',
      type: 'file',
      required: false,
      accept: 'image/*',
      maxFileSizeMb: 5,
      uploadHandler: (file: File) => this.fileService.upload(file),
    },
  ];

  readonly profileInitialValues = computed(() => {
    const profile = this.userProfile();
    if (!profile) return {};
    return {
      name: profile.name,
      email: profile.email,
      age: profile.age,
      gender: profile.gender,
      address: profile.address,
      logo: profile.logo || '',
    };
  });

  readonly editProfileSubmitAction = (event: ModalFormSubmitEvent) => this.onEditProfileSubmit(event);



  loadSavedJobs(): void {
    this.jobService.getSavedJobs().subscribe({
      next: (jobs) => {
        this.savedJobs.set(jobs.map(job => this.mapJobToDashboardJob(job)));
      },
      error: (err) => {
        console.error('Error loading saved jobs:', err);
      }
    });
  }

  onRemoveSavedJob(jobId: number): void {
    this.jobService.unsaveJob(jobId).subscribe({
      next: () => {
        this.toastService.success('Job unsaved successfully');
        this.savedJobs.update(jobs => jobs.filter(j => j.id !== jobId));
      },
      error: (err) => {
        console.error('Error unsaving job:', err);
        this.toastService.error('Failed to unsave job');
      }
    });
  }

  private mapJobToDashboardJob(job: JobApi) {
    const initials = job.company?.name
      ? job.company.name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
      : '--';
    return {
      id: job.id,
      initials,
      title: job.name,
      company: job.company?.name || 'Unknown Company',
      location: job.location,
      salary: `${new Intl.NumberFormat('vi-VN').format(job.salary)} VND`,
      type: this.formatLevel(job.level),
      posted: `Apply by ${this.formatDate(job.endDate)}`,
      tags: (job.skill as any[] || []).map(s => String(s)),
      logoUrl: job.company?.logo
        ? `${API_ENDPOINTS.companies.logoBase}${job.company.logo}`
        : undefined,
    };
  }

  private formatLevel(level: string): string {
    if (!level) return '';
    return level
      .toLowerCase()
      .split(/[_\s]+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  ngOnInit(): void {
    if (typeof window === 'undefined' || !window.localStorage.getItem('accessToken')) {
      return;
    }

    this.loadSavedJobs();
    this.loadAppliedJobs();

    this.authService.getAccount().pipe(
      switchMap((account) => {
        this.userName.set(account.name);
        return this.userService.getUserProfile(account.id);
      })
    ).subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
        this.authService.userLogo.set(profile.logo || null);
      },
      error: (err) => {
        console.error('Error loading account or profile details:', err);
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

  private formatDate(dateStr: string): string {
    const parsedDate = new Date(dateStr);
    if (Number.isNaN(parsedDate.getTime())) {
      return '--';
    }

    return new Intl.DateTimeFormat('vi-VN').format(parsedDate);
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
      logo: (event.uploadedFiles['logo'] as string) || this.userProfile()?.logo,
    };

    // Gọi API cập nhật
    this.userService.updateUserProfile(updatedData).subscribe({
      next: (updatedProfile) => {
        // Cập nhật lại thông tin mới vào signal để giao diện tự render lại
        this.userProfile.set(updatedProfile);
        this.userName.set(updatedProfile.name);
        this.authService.userLogo.set(updatedProfile.logo || null);
        // Đóng modal
        this.isApplyModalOpen.set(false);
        this.toastService.success('Profile updated successfully');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
      }
    });
  }

  onEditResume(resumeId: number): void {
    this.editingResumeId.set(resumeId);
    this.resumeService.getById(resumeId).subscribe({
      next: (res) => {
        const data = res.data || res;
        this.editingResumeOldUrl.set(data.url);
        this.editResumeInitialValues.set({
          email: data.email,
          resume: data.url
        });
        this.isEditResumeModalOpen.set(true);
      },
      error: (err) => {
        console.error('Error fetching resume details:', err);
        this.toastService.error('Failed to fetch resume details');
      }
    });
  }

  onCloseEditResumeModal(): void {
    this.isEditResumeModalOpen.set(false);
    this.editingResumeId.set(null);
    this.editingResumeOldUrl.set('');
    this.editResumeInitialValues.set({});
  }

  onEditResumeSubmit(event: ModalFormSubmitEvent): void {
    const resumeId = this.editingResumeId();
    if (!resumeId) return;

    const email = event.values['email'] as string;
    const newResumeUrl = event.uploadedFiles['resume'] as string;
    const oldResumeUrl = this.editingResumeOldUrl();

    const updatedData = {
      id: resumeId,
      email: email.trim(),
      url: newResumeUrl || oldResumeUrl,
    };

    this.resumeService.update(updatedData).subscribe({
      next: () => {
        this.isEditResumeModalOpen.set(false);
        this.toastService.success('Application updated successfully');
        this.loadAppliedJobs();
      },
      error: (err) => {
        console.error('Error updating resume:', err);
        this.toastService.error(err.error?.message || 'Failed to update application');
      }
    });
  }

  onDeleteResume(resumeId: number): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.resumeService.delete(resumeId).subscribe({
        next: () => {
          this.toastService.success('Application deleted successfully');
          this.loadAppliedJobs();
        },
        error: (err) => {
          console.error('Error deleting resume:', err);
          this.toastService.error('Failed to delete application');
        }
      });
    }
  }
}
