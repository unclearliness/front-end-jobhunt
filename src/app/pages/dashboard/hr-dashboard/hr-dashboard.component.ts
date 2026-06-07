import { HttpClient } from '@angular/common/http';
import { renderAsync } from 'docx-preview';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CompanyApi, CompanyService } from '../../../services/company.service';
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
  User,
  UserCheck,
  Users,
  X,
} from 'lucide-angular';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppCardComponent } from '../../../shared/components/app-card/app-card.component';
import { DashboardHeaderComponent } from '../../../shared/layouts/dashboard-header/dashboard-header.component';
import { API_ENDPOINTS } from '../../../shared/constants/api-endpoints';
import { ToastService } from '../../../services/toast.service';
import { FileService } from '../../../services/file.service';
import { AppModalFormComponent, ModalFormField, ModalFormSubmitEvent } from "../../../shared/components/app-modal-form/app-modal-form.component";
import { DatePipe } from '@angular/common';
import { ResumeService } from '../../../services/resume.service';
import { SkillService } from '../../../services/skill.service';
import { JobService } from '../../../services/job.service';
import { AppPaginationComponent } from '../../../shared/components/app-pagination/app-pagination.component';
import { UserService } from '../../../services/user.service';


type HrDashboardFrameId = 'overview' | 'post-job' | 'my-jobs' | 'applicants' | 'company-profile' | 'profile';

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

import { FieldErrorComponent } from '../../../shared/components/app-field-error/app-field-error';

@Component({
  selector: 'app-hr-dashboard',
  imports: [DashboardHeaderComponent, LucideAngularModule, AppCardComponent, AppButtonComponent, ReactiveFormsModule, AppModalFormComponent, DatePipe, AppPaginationComponent, FieldErrorComponent],
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
        User,
        UserCheck,
        Users,
        X,
      }),
    },
  ],
  templateUrl: './hr-dashboard.component.html',
  styleUrl: './hr-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HrDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly companyService = inject(CompanyService);
  private readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly fileService = inject(FileService);
  private readonly resumeService = inject(ResumeService);
  private readonly skillService = inject(SkillService);
  private readonly jobService = inject(JobService);
  private readonly userService = inject(UserService);


  readonly company = signal<any>(null);
  readonly skillList = signal<any[]>([]);
  readonly activeFrame = signal<HrDashboardFrameId>('overview');
  readonly isUploadingLogo = signal<boolean>(false);
  readonly logoPreviewUrl = signal<string | null>(null);
  readonly isApplyModalOpen = signal(false);
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  // Quản lý trạng thái mở/đóng modal xem CV
  readonly isCvPreviewOpen = signal(false);
  readonly selectedApplicantName = signal('');
  readonly isLoadingCv = signal(false);
  readonly isPdf = signal(false);
  readonly pdfUrl = signal<SafeResourceUrl | null>(null);
  private currentBlobUrl: string | null = null;

  readonly jobs = signal<any[]>([]);
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly totalPages = signal(1);
  readonly totalItems = signal(0);
  readonly jobSearchQuery = signal<string>('');
  readonly applicantSearchQuery = signal<string>('');

  readonly isJobModalOpen = signal(false);
  readonly isEditMode = signal(false);

  readonly jobModalForm = this.fb.group({
    id: [null as number | null],
    name: ['', Validators.required],
    location: ['', Validators.required],
    salary: [null as number | null, [Validators.required, Validators.min(0)]],
    quantity: [null as number | null, [Validators.required, Validators.min(1)]],
    level: ['INTERN', Validators.required],
    description: ['', Validators.required],
    skills: [[] as number[], Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    active: [true, Validators.required],
  });

  readonly companyForm = this.fb.group({
    name: ['', Validators.required],
    industry: ['', Validators.required],
    companySize: [null as number | null, [Validators.required, Validators.min(1)]],
    founded: [null as number | null, [Validators.required, Validators.min(1800)]],
    address: ['', Validators.required],
    description: [''],
    logo: ['']
  });

  readonly jobPostForm = this.fb.group({
    name: ['', Validators.required],
    location: ['', Validators.required],
    salary: [null as number | null, [Validators.required, Validators.min(0)]],
    quantity: [null as number | null, [Validators.required, Validators.min(1)]],
    level: ['INTERN', Validators.required],
    description: ['', Validators.required],
    skills: [[] as number[], Validators.required], // Chứa danh sách các id của skill được chọn
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  readonly userProfile = signal<any>(null);
  readonly isUserProfileModalOpen = signal(false);

  readonly userAvatarUrl = computed(() => {
    const profile = this.userProfile();
    return profile?.logo ? `${API_ENDPOINTS.companies.logoBase}${profile.logo}` : null;
  });

  readonly userInitial = computed(() => {
    const name = this.userProfile()?.name || '';
    return name.slice(0, 1).toUpperCase() || 'U';
  });

  readonly editProfileFields: readonly ModalFormField[] = [
    { key: 'name', label: 'Full Name', type: 'text', required: true },
    { key: 'email', label: 'Email Address', type: 'email', required: true },
    { key: 'age', label: 'Age', type: 'text', required: true },
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: [
        { value: 'MALE', label: 'Male' },
        { value: 'FEMALE', label: 'Female' },
      ],
    },
    { key: 'address', label: 'Address', type: 'text', required: true },
    {
      key: 'logo',
      label: 'Avatar',
      type: 'file',
      required: false,
      accept: 'image/*',
      maxFileSizeMb: 2,
      hint: 'Upload JPG, PNG image (max 2MB)',
      uploadHandler: (file) => this.fileService.upload(file)
    }
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
    {
      id: 'profile',
      label: 'Profile',
      icon: 'user',
      buttonId: 'button-hr-profile',
      frameId: 'frame-hr-profile',
    },
  ];

  readonly overviewStats = computed<readonly HrStatCard[]>(() => {
    const jobsCount = this.jobs().length;
    const applicantsCount = this.applicants().length;
    return [
      { label: 'Active Jobs', value: String(jobsCount), helper: `Total: ${jobsCount} jobs`, icon: 'briefcase-business' },
      { label: 'Total Applicants', value: String(applicantsCount), helper: `Total: ${applicantsCount} applicants`, icon: 'users' },
    ];
  });



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

  readonly applicants = signal<any[]>([]);


  readonly companyDetails: readonly CompanyDetail[] = [
    { label: 'Company', value: 'TechCorp Inc.', icon: 'building-2' },
    { label: 'Website', value: 'techcorp.example.com', icon: 'globe' },
    { label: 'Email', value: 'hiring@techcorp.example.com', icon: 'mail' },
    { label: 'Phone', value: '+1 (555) 412-8090', icon: 'phone' },
    { label: 'Location', value: 'San Francisco, CA', icon: 'map-pin' },
    { label: 'Verified', value: 'Employer account approved', icon: 'shield-check' },
  ];

  readonly companyLogoUrl = computed(() => {
    const comp = this.company();
    if (comp && comp.logo) {
      return `${API_ENDPOINTS.companies.logoBase}${comp.logo}`;
    }
    return null;
  });

  readonly benefits: readonly string[] = [
    'Hybrid work policy',
    'Health insurance',
    'Learning budget',
    'Annual performance bonus',
  ];

  readonly editCompanyFields: readonly ModalFormField[] = [
    { key: 'name', label: 'Company Name', type: 'text', required: true },
    {
      key: 'industry',
      label: 'Industry',
      type: 'select',
      required: true,
      options: [
        { value: 'IT_SOFTWARE', label: 'IT Software' },
        { value: 'FINANCE_BANKING', label: 'Finance & Banking' },
        { value: 'E_COMMERCE', label: 'E-Commerce' },
        { value: 'MARKETING_MEDIA', label: 'Marketing & Media' },
        { value: 'EDUCATION', label: 'Education' },
        { value: 'HEALTHCARE', label: 'Healthcare' },
        { value: 'OTHER', label: 'Other' },
      ],
    },
    { key: 'companySize', label: 'Company Size', type: 'text', required: true },
    { key: 'founded', label: 'Founded Year', type: 'text', required: true },
    { key: 'address', label: 'Address', type: 'text', required: true },
    { key: 'description', label: 'Company Description', type: 'textarea', required: false },
    {
      key: 'logo',
      label: 'Company Logo',
      type: 'file',
      required: false,
      accept: 'image/*',
      maxFileSizeMb: 2,
      hint: 'Upload JPG, PNG image (max 2MB)',
      uploadHandler: (file) => this.fileService.upload(file) // Tận dụng upload tự động của modal-form
    }
  ];


  ngOnInit(): void {
    if (typeof window === 'undefined' || !window.localStorage.getItem('accessToken')) {
      return;
    }

    this.loadJobs();
    this.loadApplicants();

    this.skillService.getAll().subscribe({
      next: (res) => {
        // Case when API returns format { data: [...] } or array directly
        const data = res?.data.result || res || [];
        this.skillList.set(data);
      },
      error: (err) => {
        console.error('Error loading skills list:', err);
      }
    });
    this.authService.getAccount().subscribe({
      next: (account) => {
        if (account) {
          this.userService.getUserProfile(account.id).subscribe({
            next: (profile) => {
              this.userProfile.set(profile);
            },
            error: (err) => {
              console.error('Error loading user profile:', err);
            }
          });
        }
        if (account && account.company) {
          // 1. Gọi tiếp API lấy thông tin chi tiết công ty bằng company.id
          this.companyService.getById(account.company.id).subscribe({
            next: (companyDetail) => {
              // Lưu chi tiết công ty (bao gồm cả trường logo) vào signal
              this.company.set(companyDetail);

              // 2. Load dữ liệu chi tiết vào form
              this.companyForm.patchValue({
                name: companyDetail.name,
                industry: companyDetail.industry,
                companySize: companyDetail.companySize,
                founded: companyDetail.founded,
                address: companyDetail.address,
                description: companyDetail.description
              });
            },
            error: (err) => {
              console.error('Error getting company details:', err);
            }
          });
        } else {
          this.company.set(null);
          this.selectFrame('company-profile');// Not linked to a company yet
        }
      },
      error: (err) => {
        console.error('Error loading account info:', err);
      }
    });
  }

  selectFrame(frame: HrDashboardFrameId): void {
    this.activeFrame.set(frame);
    if (frame === 'applicants') {
      this.loadApplicants();
    } else if (frame === 'my-jobs') {
      this.loadJobs();
    }
  }

  isActive(frame: HrDashboardFrameId): boolean {
    return this.activeFrame() === frame;
  }

  onCreateCompanySubmit(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }
    this.companyService.createCompany(this.companyForm.value as CompanyApi).subscribe({
      next: (newCompany) => {
        // Gán công ty mới tạo vào signal để giao diện chuyển sang chế độ hiển thị profile
        this.company.set(newCompany);
        this.companyForm.reset();
        this.toastService.success('Company created successfully');
        window.location.reload();
      },
      error: (err) => {
        console.error('Error creating company:', err);
      }
    });
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];

    // 1. Bật trạng thái đang tải lên
    this.isUploadingLogo.set(true);
    // 2. Gọi service upload file
    this.fileService.upload(file).subscribe({
      next: (fileName) => {
        // Cập nhật tên file (ví dụ: "abc.png") vào formControl 'logo'
        this.companyForm.patchValue({ logo: fileName });
        // Tạo preview URL để hiển thị ảnh vừa upload lên giao diện
        this.logoPreviewUrl.set(`${API_ENDPOINTS.companies.logoBase}${fileName}`);
        this.isUploadingLogo.set(false);
        this.toastService.success('Logo uploaded successfully');
      },
      error: (err) => {
        this.isUploadingLogo.set(false);
        this.toastService.error('An error occurred during upload');
        console.error('Logo upload error:', err);
      }
    });
  }

  // Mở modal
  onEditCompany(): void {
    this.isApplyModalOpen.set(true);
  }
  // Đóng modal
  onCloseModal(): void {
    this.isApplyModalOpen.set(false);
  }

  onOpenUserProfileModal(): void {
    this.isUserProfileModalOpen.set(true);
  }

  onCloseUserProfileModal(): void {
    this.isUserProfileModalOpen.set(false);
  }

  onEditUserProfileSubmit(event: ModalFormSubmitEvent): void {
    const currentProfile = this.userProfile();
    if (!currentProfile) return;

    const updatedData = {
      id: currentProfile.id,
      name: event.values['name'] as string,
      email: event.values['email'] as string,
      age: Number(event.values['age']),
      gender: event.values['gender'] as string,
      address: event.values['address'] as string,
      logo: (event.uploadedFiles['logo'] as string) || currentProfile.logo,
    };

    this.userService.updateUserProfile(updatedData).subscribe({
      next: (updatedProfile) => {
        this.userProfile.set(updatedProfile);
        this.authService.userLogo.set(updatedProfile.logo || null);
        this.isUserProfileModalOpen.set(false);
        this.toastService.success('Profile updated successfully');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.toastService.error('Failed to update profile');
      }
    });
  }

  onEditCompanySubmit(event: ModalFormSubmitEvent): void {
    const currentCompany = this.company();
    if (!currentCompany) return;
    // Nếu có logo mới tải lên thì lấy logo mới, nếu không thì giữ logo cũ
    const uploadedLogo = event.uploadedFiles['logo'] || currentCompany.logo;
    const updatedData: CompanyApi = {
      id: currentCompany.id,
      name: event.values['name'] as string,
      industry: event.values['industry'] as string,
      companySize: Number(event.values['companySize']),
      founded: Number(event.values['founded']),
      address: event.values['address'] as string,
      description: event.values['description'] as string,
      logo: uploadedLogo
    };
    // Gọi API update qua CompanyService
    this.companyService.editCompany(updatedData).subscribe({
      next: () => {
        // Cập nhật lại signal company để giao diện tự cập nhật thông tin mới
        this.company.set(updatedData);

        this.isApplyModalOpen.set(false);
        this.toastService.success('Company profile updated successfully');
      },
      error: (err) => {
        console.error('Error updating company:', err);
        this.toastService.error('Update failed');
      }
    });
  }

  loadApplicants(): void {
    const query = this.applicantSearchQuery();
    const filter = query ? `user.name ~ '${query}'` : undefined;
    this.resumeService.getByHr(0, 10, filter).subscribe({
      next: (res) => {
        if (res && res.data && res.data.result) {
          this.applicants.set(res.data.result);
        }
      },
      error: (err) => {
        console.error('Error getting applicants list:', err);
        this.toastService.error('Unable to load applicants list');
      }
    });
  }

  onStatusChange(applicant: any, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    this.resumeService.update({ id: applicant.id, status: newStatus }).subscribe({
      next: () => {
        this.toastService.success('Status updated successfully');
        this.applicants.update(list =>
          list.map(item => item.id === applicant.id ? { ...item, status: newStatus } : item)
        );
      },
      error: (err) => {
        this.toastService.error('Update failed');
      }
    });
  }
  viewResume(applicant: any): void {
    if (!applicant || !applicant.url) {
      this.toastService.warning('Applicant has not attached a CV file.');
      return;
    }

    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
    this.pdfUrl.set(null);

    const isPdfFile = applicant.url.toLowerCase().endsWith('.pdf');
    this.isPdf.set(isPdfFile);

    this.selectedApplicantName.set(applicant.user?.name || 'Applicant');
    this.isCvPreviewOpen.set(true);
    this.isLoadingCv.set(true);

    const fileUrl = `${API_ENDPOINTS.companies.logoBase}${applicant.url}`;

    // Tải file dưới dạng Blob từ backend
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        this.isLoadingCv.set(false);
        if (isPdfFile) {
          this.currentBlobUrl = URL.createObjectURL(blob);
          this.pdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.currentBlobUrl));
        } else {
          // Đợi Angular render xong DOM modal
          setTimeout(() => {
            const container = document.getElementById('docx-preview-container');
            if (container) {
              container.innerHTML = ''; // Reset container
              // Gọi thư viện để vẽ file Word vào div container
              renderAsync(blob, container)
                .then(() => console.log('Rendered Word file successfully'))
                .catch(err => {
                  console.error('Render error:', err);
                  this.toastService.error('Cannot display this file format.');
                });
            }
          }, 100);
        }
      },
      error: (err) => {
        this.isLoadingCv.set(false);
        this.isCvPreviewOpen.set(false);
        console.error('Error loading CV file:', err);
        this.toastService.error('Unable to load CV file from server.');
      }
    });
  }

  closeCvPreview(): void {
    this.isCvPreviewOpen.set(false);
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
    this.pdfUrl.set(null);
  }

  sendEmail(applicant: any): void {
    console.log('Sending email to applicant:', applicant.email);
    // API send email will be implemented later
  }

  onSubmitJob(): void {
    if (this.jobPostForm.invalid) {
      this.jobPostForm.markAllAsTouched();
      this.toastService.warning('Please fill in all required fields');
      return;
    }

    const currentCompany = this.company();
    if (!currentCompany) {
      this.toastService.error('Recruiter account is not linked to a company!');
      return;
    }

    const formValues = this.jobPostForm.value;

    // Map list ID sang list object [{ id: X }]
    const skillsPayload = (formValues.skills || []).map((id: number) => ({ id }));

    // Tạo request payload khớp với mock yêu cầu
    const payload = {
      name: formValues.name,
      location: formValues.location,
      salary: Number(formValues.salary),
      quantity: Number(formValues.quantity),
      level: formValues.level,
      description: formValues.description,
      startDate: this.toInstantString(formValues.startDate),
      endDate: this.toInstantString(formValues.endDate),
      company: {
        id: currentCompany.id
      },
      skills: skillsPayload
    };

    // Gọi API tạo job
    this.jobService.create(payload).subscribe({
      next: (newJob) => {
        this.toastService.success('Job posted successfully!');
        this.jobPostForm.reset({ level: 'INTERN' }); // Reset form to default
        this.selectFrame('my-jobs'); // Redirect to Job list tab
      },
      error: (err: void) => {
        console.error('Error posting job:', err);
        this.toastService.error('Failed to post job');
      }
    });
  }

  // 1. Lấy danh sách Skill đã được chọn dựa trên mảng ID lưu trong Form
  getSelectedSkills(): any[] {
    const selectedIds = this.jobPostForm.get('skills')?.value || [];
    return this.skillList().filter(s => selectedIds.includes(s.id));
  }

  // 2. Lấy danh sách các Skill chưa được chọn để hiển thị trong Dropdown (Tránh trùng lặp)
  getAvailableSkills(): any[] {
    const selectedIds = this.jobPostForm.get('skills')?.value || [];
    return this.skillList().filter(s => !selectedIds.includes(s.id));
  }

  // 3. Xử lý khi click chọn 1 skill từ dropdown
  addSkill(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const skillId = Number(selectElement.value);
    if (!skillId) return;

    const currentSelected = this.jobPostForm.get('skills')?.value || [];
    if (!currentSelected.includes(skillId)) {
      this.jobPostForm.patchValue({
        skills: [...currentSelected, skillId]
      });
    }

    // Reset dropdown về placeholder ban đầu
    selectElement.value = '';
  }

  // 4. Xử lý khi click vào nút 'x' để xóa tag skill
  removeSkill(skillId: number): void {
    const currentSelected = this.jobPostForm.get('skills')?.value || [];
    const updatedSelected = currentSelected.filter((id: number) => id !== skillId);
    this.jobPostForm.patchValue({
      skills: updatedSelected
    });
  }

  loadJobs(): void {
    const query = this.jobSearchQuery();
    const filter = query ? `name ~ '${query}'` : undefined;
    this.jobService.getByHr(this.currentPage(), this.pageSize(), filter).subscribe({
      next: (res) => {
        const data = res?.data?.result || res || [];
        this.jobs.set(data);
        const meta = res?.data?.meta;
        if (meta) {
          this.totalPages.set(meta.pages || 1);
          this.totalItems.set(meta.total || 0);
        }
      },
      error: (err) => {
        console.error('Error loading jobs list:', err);
        this.toastService.error('Unable to load jobs list');
      }
    });
  }

  onJobSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.jobSearchQuery.set(value);
    this.currentPage.set(1);
    this.loadJobs();
  }

  onApplicantSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.applicantSearchQuery.set(value);
    this.loadApplicants();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadJobs();
  }

  viewJobDetail(id: number): void {
    this.isEditMode.set(false);
    this.jobService.getById(id).subscribe({
      next: (jobDetail) => {
        const skillsData = (jobDetail as any).skills || jobDetail.skill || [];
        const skillIds = skillsData.map((s: any) => {
          if (typeof s === 'string') {
            const found = this.skillList().find(sk => sk.name === s);
            return found ? found.id : null;
          }
          return s.id;
        }).filter((id: number | null): id is number => id !== null);
        this.jobModalForm.patchValue({
          id: jobDetail.id,
          name: jobDetail.name,
          location: jobDetail.location,
          salary: jobDetail.salary,
          quantity: jobDetail.quantity,
          level: jobDetail.level,
          description: jobDetail.description,
          skills: skillIds,
          startDate: this.formatDateForInput(jobDetail.startDate),
          endDate: this.formatDateForInput(jobDetail.endDate),
          active: jobDetail.active
        });
        this.jobModalForm.disable();
        this.isJobModalOpen.set(true);
      },
      error: (err) => {
        console.error('Error getting job details:', err);
        this.toastService.error('Unable to load job details');
      }
    });
  }

  editJobDetail(id: number): void {
    this.isEditMode.set(true);
    this.jobService.getById(id).subscribe({
      next: (jobDetail) => {
        const skillsData = (jobDetail as any).skills || jobDetail.skill || [];
        const skillIds = skillsData.map((s: any) => {
          if (typeof s === 'string') {
            const found = this.skillList().find(sk => sk.name === s);
            return found ? found.id : null;
          }
          return s.id;
        }).filter((id: number | null): id is number => id !== null);
        this.jobModalForm.patchValue({
          id: jobDetail.id,
          name: jobDetail.name,
          location: jobDetail.location,
          salary: jobDetail.salary,
          quantity: jobDetail.quantity,
          level: jobDetail.level,
          description: jobDetail.description,
          skills: skillIds,
          startDate: this.formatDateForInput(jobDetail.startDate),
          endDate: this.formatDateForInput(jobDetail.endDate),
          active: jobDetail.active
        });
        this.jobModalForm.enable();
        this.isJobModalOpen.set(true);
      },
      error: (err) => {
        console.error('Error getting job details:', err);
        this.toastService.error('Unable to load job details');
      }
    });
  }

  onCloseJobModal(): void {
    this.isJobModalOpen.set(false);
  }

  onSubmitModalJob(): void {
    if (this.jobModalForm.invalid) {
      this.jobModalForm.markAllAsTouched();
      this.toastService.warning('Please fill in all required fields');
      return;
    }

    const currentCompany = this.company();
    if (!currentCompany) {
      this.toastService.error('Recruiter account is not linked to a company!');
      return;
    }

    const formValues = this.jobModalForm.getRawValue();
    const skillsPayload = (formValues.skills || []).map((id: number) => ({ id }));

    const payload = {
      id: formValues.id,
      name: formValues.name,
      location: formValues.location,
      salary: Number(formValues.salary),
      quantity: Number(formValues.quantity),
      level: formValues.level,
      description: formValues.description,
      startDate: this.toInstantString(formValues.startDate),
      endDate: this.toInstantString(formValues.endDate),
      company: {
        id: currentCompany.id
      },
      skills: skillsPayload,
      active: formValues.active === true || (formValues.active as any) === 'true',
    };

    this.jobService.update(payload).subscribe({
      next: () => {
        this.toastService.success('Job posting updated successfully!');
        this.isJobModalOpen.set(false);
        this.loadJobs();
      },
      error: (err) => {
        console.error('Error updating job posting:', err);
        this.toastService.error('Failed to update job posting');
      }
    });
  }

  getSelectedSkillsForModal(): any[] {
    const selectedIds = this.jobModalForm.get('skills')?.value || [];
    return this.skillList().filter(s => selectedIds.includes(s.id));
  }

  getAvailableSkillsForModal(): any[] {
    const selectedIds = this.jobModalForm.get('skills')?.value || [];
    return this.skillList().filter(s => !selectedIds.includes(s.id));
  }

  addSkillToModal(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const skillId = Number(selectElement.value);
    if (!skillId) return;

    const currentSelected = this.jobModalForm.get('skills')?.value || [];
    if (!currentSelected.includes(skillId)) {
      this.jobModalForm.patchValue({
        skills: [...currentSelected, skillId]
      });
    }
    selectElement.value = '';
  }

  removeSkillFromModal(skillId: number): void {
    const currentSelected = this.jobModalForm.get('skills')?.value || [];
    const updatedSelected = currentSelected.filter((id: number) => id !== skillId);
    this.jobModalForm.patchValue({
      skills: updatedSelected
    });
  }

  private formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  private toInstantString(dateStr: string | null | undefined): string | null {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  onDeleteJob(id: number): void {
    if (confirm('Are you sure you want to delete this job posting?')) {
      this.jobService.delete(id).subscribe({
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
}