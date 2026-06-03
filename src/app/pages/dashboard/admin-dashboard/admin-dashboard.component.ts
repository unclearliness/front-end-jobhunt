import { ChangeDetectionStrategy, Component, inject, signal, OnInit, computed } from '@angular/core';
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
import { ModalFormField, AppModalFormComponent, ModalFormSubmitEvent } from '../../../shared/components/app-modal-form/app-modal-form.component';
import { FileService } from '../../../services/file.service';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { API_ENDPOINTS } from '../../../shared/constants/api-endpoints';
import { AppPaginationComponent } from "../../../shared/components/app-pagination/app-pagination.component";
import { CompanyService } from '../../../services/company.service';
import { JobService } from '../../../services/job.service';

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
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly status: string;
  readonly statusClass: string;
  readonly joined: string;
  readonly logo: string | null;
  readonly initials: string;
}

interface CompanyRow {
  readonly id: number;
  readonly name: string;
  readonly owner: string;
  readonly jobs: string;
  readonly status: string;
  readonly statusClass: string;
  readonly verified: string;
  readonly logo: string | null;
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
  imports: [DashboardHeaderComponent, LucideAngularModule, AppCardComponent, AppButtonComponent, AppModalFormComponent, AppPaginationComponent],
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
export class AdminDashboardComponent implements OnInit {
  private readonly fileService = inject(FileService);
  private readonly userService = inject(UserService);
  private readonly companyService = inject(CompanyService);
  private readonly jobService = inject(JobService);
  private readonly toastService = inject(ToastService);
  readonly isAddUserModalOpen = signal(false);
  readonly activeFrame = signal<AdminFrameId>('overview');

  ngOnInit(): void {
    this.loadUsers();
    this.loadCompanies();
    this.loadJobs();
  }

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

  readonly overviewStats = computed<AdminStat[]>(() => {
    return [
      { label: 'Total Users', value: this.totalItems().toLocaleString(), helper: 'Registered platform users', icon: 'users' },
      { label: 'Total Companies', value: this.companyTotalItems().toLocaleString(), helper: 'Verified company profiles', icon: 'building-2' },
      { label: 'Total Jobs', value: this.jobTotalItems().toLocaleString(), helper: 'Active job openings', icon: 'briefcase-business' }
    ];
  });

  readonly users = signal<UserRow[]>([]);

  readonly companies = signal<CompanyRow[]>([]);
  readonly companyCurrentPage = signal(1);
  readonly companyPageSize = signal(8);
  readonly companyTotalPages = signal(1);
  readonly companyTotalItems = signal(0);
  readonly companySearchQuery = signal<string>('');

  readonly jobs = signal<any[]>([]);
  readonly jobCurrentPage = signal(1);
  readonly jobPageSize = signal(8);
  readonly jobTotalPages = signal(1);
  readonly jobTotalItems = signal(0);
  readonly jobSearchQuery = signal<string>('');

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

  readonly searchQuery = signal<string>('');

  readonly modalType = signal<'user' | 'company' | 'job'>('user');

  readonly userModalFields = computed<ModalFormField[]>(() => {
    const mode = this.modalMode();
    const isReadOnly = mode === 'view';

    // 1. Khởi tạo mảng có định nghĩa kiểu rõ ràng
    const fields: ModalFormField[] = [
      { key: 'name', label: 'Name', type: 'text', required: true, disabled: isReadOnly },
      { key: 'email', label: 'Email', type: 'email', required: true, disabled: isReadOnly }
    ];

    // 2. Thêm trường password bằng push() nếu ở chế độ add
    if (mode === 'add') {
      fields.push({ key: 'password', label: 'Password', type: 'password', required: true });
    }

    // 3. Đẩy tiếp các trường còn lại vào mảng
    fields.push(
      { key: 'age', label: 'Age', type: 'text', required: true, disabled: isReadOnly },
      {
        key: 'gender',
        label: 'Gender',
        type: 'select',
        required: true,
        disabled: isReadOnly,
        options: [
          { value: 'MALE', label: 'Male' },
          { value: 'FEMALE', label: 'Female' },
          { value: 'OTHER', label: 'Other' }
        ]
      },
      { key: 'address', label: 'Address', type: 'text', required: true, disabled: isReadOnly },
      {
        key: 'role',
        label: 'Role',
        type: 'select',
        required: true,
        disabled: isReadOnly,
        options: [
          { value: 'HR', label: 'HR' },
          { value: 'USER', label: 'USER' },
          { value: 'ADMIN', label: 'ADMIN' }
        ]
      },
      {
        key: 'logo',
        label: 'Logo',
        type: 'file',
        required: false,
        disabled: isReadOnly,
        accept: 'image/*',
        maxFileSizeMb: 2,
        uploadHandler: (file) => this.fileService.upload(file)
      }
    );

    return fields;
  });

  readonly companyModalFields = computed<ModalFormField[]>(() => {
    return [
      { key: 'name', label: 'Company Name', type: 'text', required: true, disabled: true },
      { key: 'industry', label: 'Industry', type: 'text', required: true, disabled: true },
      { key: 'companySize', label: 'Company Size', type: 'text', required: true, disabled: true },
      { key: 'founded', label: 'Founded Year', type: 'text', required: true, disabled: true },
      { key: 'address', label: 'Address', type: 'text', required: true, disabled: true },
      { key: 'description', label: 'Description', type: 'textarea', required: false, disabled: true },
      {
        key: 'logo',
        label: 'Company Logo',
        type: 'file',
        required: false,
        disabled: true,
        accept: 'image/*',
        maxFileSizeMb: 2
      }
    ];
  });

  readonly jobModalFields = computed<ModalFormField[]>(() => {
    return [
      { key: 'name', label: 'Job Title', type: 'text', required: true, disabled: true },
      { key: 'companyName', label: 'Company', type: 'text', required: true, disabled: true },
      { key: 'location', label: 'Location', type: 'text', required: true, disabled: true },
      { key: 'salary', label: 'Salary', type: 'text', required: true, disabled: true },
      { key: 'quantity', label: 'Quantity', type: 'text', required: true, disabled: true },
      { key: 'level', label: 'Level', type: 'text', required: true, disabled: true },
      { key: 'description', label: 'Description', type: 'textarea', required: false, disabled: true },
      { key: 'startDate', label: 'Start Date', type: 'text', required: false, disabled: true },
      { key: 'endDate', label: 'End Date', type: 'text', required: false, disabled: true }
    ];
  });

  readonly currentModalFields = computed<ModalFormField[]>(() => {
    const type = this.modalType();
    if (type === 'company') {
      return this.companyModalFields();
    }
    if (type === 'job') {
      return this.jobModalFields();
    }
    return this.userModalFields();
  });

  readonly modalTitle = computed(() => {
    const type = this.modalType();
    const mode = this.modalMode();
    if (type === 'company') {
      return 'Company Details (Read-only)';
    }
    if (type === 'job') {
      return 'Job Details (Read-only)';
    }
    if (mode === 'add') return 'Add New User';
    if (mode === 'view') return 'User Details (Read-only)';
    return 'Edit User Details';
  });

  readonly modalSubmitLabel = computed(() =>
    this.modalMode() === 'add' ? 'Create User' : 'Save Changes'
  );

  readonly modalHideSubmit = computed(() => {
    const type = this.modalType();
    return type === 'company' || type === 'job' || this.modalMode() === 'view';
  });



  readonly modalMode = signal<'add' | 'view' | 'edit'>('add');
  readonly isModalOpen = signal(false);
  readonly modalInitialValues = signal<any>({});

  readonly currentPage = signal(1);
  readonly pageSize = signal(8); // Số lượng user hiển thị trên 1 trang
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);


  selectFrame(frame: AdminFrameId): void {
    this.activeFrame.set(frame);
  }

  isActive(frame: AdminFrameId): boolean {
    return this.activeFrame() === frame;
  }

  onSubmitModal(event: ModalFormSubmitEvent): void {
    if (this.modalMode() === 'add') {
      this.handleCreateUser(event);
    } else if (this.modalMode() === 'edit') {
      this.handleUpdateUser(event);
    }
  }

  private handleCreateUser(event: ModalFormSubmitEvent): void {
    const roleName = event.values['role'] as string;
    const roleIdMap: Record<string, number> = {
      'ADMIN': 3,
      'HR': 2,
      'USER': 1,
    };

    const payload = {
      name: event.values['name'] as string,
      email: event.values['email'] as string,
      password: event.values['password'] as string,
      age: Number(event.values['age']),
      gender: event.values['gender'] as string,
      address: event.values['address'] as string,
      logo: event.uploadedFiles['logo'] || '',
      role: {
        id: roleIdMap[roleName] || 1,
        name: roleName
      }
    };

    this.userService.createUser(payload).subscribe({
      next: () => {
        this.toastService.success('User added successfully!');
        this.isModalOpen.set(false); // Close shared modal
        this.loadUsers(); // Reload list
      },
      error: (err: unknown) => {
        console.error('Error adding user:', err);
        this.toastService.error('Failed to add user');
      }
    });
  }

  private handleUpdateUser(event: ModalFormSubmitEvent): void {
    const roleName = event.values['role'] as string;
    const roleIdMap: Record<string, number> = {
      'ADMIN': 3,
      'HR': 2,
      'USER': 1,
    };

    // Lấy thông tin user hiện tại từ dữ liệu khởi tạo của modal
    const currentUser = this.modalInitialValues();

    const payload = {
      id: currentUser.id, // Bắt buộc gửi ID để backend biết cần update user nào
      name: event.values['name'] as string,
      email: event.values['email'] as string,
      age: Number(event.values['age']),
      gender: event.values['gender'] as string,
      address: event.values['address'] as string,
      // Nếu có ảnh mới upload thì dùng ảnh mới, nếu không giữ lại logo hiện có của user
      logo: event.uploadedFiles['logo'] || currentUser.logo || '',
      role: {
        id: roleIdMap[roleName] || 1,
        name: roleName
      }
    };

    this.userService.updateUserProfile(payload).subscribe({
      next: () => {
        this.toastService.success('User updated successfully!');
        this.isModalOpen.set(false); // Close shared modal
        this.loadUsers(); // Reload list to update new data on UI
      },
      error: (err: unknown) => {
        console.error('Error updating user:', err);
        this.toastService.error('Failed to update user');
      }
    });
  }



  loadUsers(): void {
    const query = this.searchQuery().trim();
    const filter = query ? `name ~ '${query}'` : undefined;

    this.userService.getUsers(this.currentPage(), this.pageSize(), filter).subscribe({
      next: (res) => {
        const data = res?.data?.result || res?.data || res || [];
        const mapped = data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role?.name || 'USER',
          status: 'Active',
          statusClass: 'status-badge--green',
          joined: u.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(u.createdAt)) : '--',
          logo: u.logo ? `${API_ENDPOINTS.companies.logoBase}${u.logo}` : null,
          initials: this.getInitials(u.name)
        }));
        this.users.set(mapped);
        const meta = res?.data?.meta;
        if (meta) {
          this.totalPages.set(meta.pages || 1);
          this.totalItems.set(meta.total || 0);
        }
      },
      error: (err: unknown) => {
        console.error('Error loading users list:', err);
        this.toastService.error('Unable to load users list');
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadUsers(); // Gọi lại API tải danh sách trang mới
  }

  onOpenAddUser(): void {
    this.modalType.set('user');
    this.modalMode.set('add');
    this.modalInitialValues.set({});
    this.isModalOpen.set(true);
  }

  onOpenViewUser(user: any): void {
    this.modalType.set('user');
    this.modalMode.set('view');
    this.loadUserDetailToModal(user.id);
  }

  onOpenEditUser(user: any): void {
    this.modalType.set('user');
    this.modalMode.set('edit');
    this.loadUserDetailToModal(user.id);
  }

  onOpenViewCompany(company: any): void {
    this.modalType.set('company');
    this.modalMode.set('view');
    this.loadCompanyDetailToModal(company.id);
  }

  onDeleteCompany(companyId: number): void {
    if (confirm('Are you sure you want to delete this company?')) {
      this.companyService.deleteCompany(companyId).subscribe({
        next: () => {
          this.toastService.success('Company deleted successfully!');
          this.loadCompanies();
        },
        error: (err: unknown) => {
          console.error('Error deleting company:', err);
          this.toastService.error('Failed to delete company');
        }
      });
    }
  }

  private loadCompanyDetailToModal(companyId: number): void {
    this.companyService.getById(companyId).subscribe({
      next: (detail) => {
        this.modalInitialValues.set({
          name: detail.name,
          industry: detail.industry,
          companySize: detail.companySize,
          founded: detail.founded,
          address: detail.address,
          description: detail.description,
          logo: detail.logo
        });
        this.isModalOpen.set(true);
      },
      error: (err: unknown) => {
        console.error('Error getting company details:', err);
        this.toastService.error('Unable to load company details');
      }
    });
  }

  onSearch(keyword: string): void {
    this.searchQuery.set(keyword);
    this.currentPage.set(1);
    this.loadUsers();
  }


  private loadUserDetailToModal(userId: number): void {
    this.userService.getUserProfile(userId).subscribe({
      next: (detail) => {
        this.modalInitialValues.set({
          ...detail,
          role: detail.role?.name || ''
        });
        this.isModalOpen.set(true);
      },
      error: (err: unknown) => {
        console.error('Error loading user details:', err);
        this.toastService.error('Unable to load user details');
      }
    });
  }

  onSearchCompanies(keyword: string): void {
    this.companySearchQuery.set(keyword);
    this.companyCurrentPage.set(1);
    this.loadCompanies();
  }

  onCompanyPageChange(page: number): void {
    this.companyCurrentPage.set(page);
    this.loadCompanies();
  }

  loadCompanies(): void {
    const query = this.companySearchQuery().trim();
    const filter = query ? `name ~ '${query}'` : undefined;

    this.companyService.searchPaginated(this.companyCurrentPage(), this.companyPageSize(), filter).subscribe({
      next: (res) => {
        const data = res?.data?.result || res?.data || res || [];
        const mapped = data.map((c: any) => ({
          id: c.id,
          name: c.name,
          owner: c.industry || 'N/A',
          jobs: c.companySize ? `${c.companySize} employees` : 'N/A',
          status: c.founded ? `Founded: ${c.founded}` : 'Active',
          statusClass: 'status-badge--green',
          verified: c.address || 'N/A',
          logo: c.logo ? `${API_ENDPOINTS.companies.logoBase}${c.logo}` : null
        }));
        this.companies.set(mapped);

        const meta = res?.data?.meta;
        if (meta) {
          this.companyTotalPages.set(meta.pages || 1);
          this.companyTotalItems.set(meta.total || 0);
        }
      },
      error: (err: unknown) => {
        console.error('Error loading companies:', err);
        this.toastService.error('Unable to load companies list');
      }
    });
  }

  loadJobs(): void {
    const query = this.jobSearchQuery().trim();
    const filter = query ? `name ~ '${query}'` : undefined;

    this.jobService.searchPaginated(this.jobCurrentPage(), this.jobPageSize(), filter).subscribe({
      next: (res) => {
        const data = res?.data?.result || res?.data || res || [];
        const mapped = data.map((j: any) => ({
          id: j.id,
          title: j.name,
          companyName: j.company?.name || 'N/A',
          location: j.location || 'N/A',
          salary: j.salary ? `${j.salary.toLocaleString()} VND` : 'N/A',
          level: j.level || 'N/A',
          logo: j.company?.logo ? `${API_ENDPOINTS.companies.logoBase}${j.company.logo}` : null,
          initials: j.company?.name ? this.getInitials(j.company.name) : 'JB',
          posted: j.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(j.createdAt)) : '--'
        }));
        this.jobs.set(mapped);

        const meta = res?.data?.meta;
        if (meta) {
          this.jobTotalPages.set(meta.pages || 1);
          this.jobTotalItems.set(meta.total || 0);
        }
      },
      error: (err: unknown) => {
        console.error('Error loading jobs:', err);
        this.toastService.error('Unable to load jobs list');
      }
    });
  }

  onSearchJobs(keyword: string): void {
    this.jobSearchQuery.set(keyword);
    this.jobCurrentPage.set(1);
    this.loadJobs();
  }

  onJobPageChange(page: number): void {
    this.jobCurrentPage.set(page);
    this.loadJobs();
  }

  onOpenViewJob(job: any): void {
    this.modalType.set('job');
    this.modalMode.set('view');
    this.loadJobDetailToModal(job.id);
  }

  onDeleteJob(jobId: number): void {
    if (confirm('Are you sure you want to delete this job posting?')) {
      this.jobService.delete(jobId).subscribe({
        next: () => {
          this.toastService.success('Job posting deleted successfully!');
          this.loadJobs();
        },
        error: (err: unknown) => {
          console.error('Error deleting job posting:', err);
          this.toastService.error('Failed to delete job posting');
        }
      });
    }
  }

  private loadJobDetailToModal(jobId: number): void {
    this.jobService.getById(jobId).subscribe({
      next: (detail) => {
        this.modalInitialValues.set({
          name: detail.name,
          companyName: detail.company?.name || 'N/A',
          location: detail.location,
          salary: detail.salary ? `${detail.salary.toLocaleString()} VND` : 'N/A',
          quantity: detail.quantity,
          level: detail.level,
          description: detail.description,
          startDate: detail.startDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(detail.startDate)) : '--',
          endDate: detail.endDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(detail.endDate)) : '--'
        });
        this.isModalOpen.set(true);
      },
      error: (err: unknown) => {
        console.error('Error getting job details:', err);
        this.toastService.error('Unable to load job details');
      }
    });
  }

  onDeleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.toastService.success('User deleted successfully!');
          this.loadUsers();
        },
        error: (err: unknown) => {
          console.error('Error deleting user:', err);
          this.toastService.error('Failed to delete user');
        }
      });
    }
  }

  private getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }
}
