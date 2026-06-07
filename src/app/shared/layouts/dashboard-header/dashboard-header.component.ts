import { ChangeDetectionStrategy, Component, inject, signal, OnInit, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { API_ENDPOINTS } from '../../../shared/constants/api-endpoints';

@Component({
  selector: 'app-dashboard-header',
  imports: [RouterLink],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHeaderComponent implements OnInit {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  user = signal<{ name: string; role: string } | null>(null);

  readonly avatarUrl = computed(() => {
    const logo = this.authService.userLogo();
    return logo ? `${API_ENDPOINTS.companies.logoBase}${logo}` : null;
  });

  readonly dashboardLink = computed(() => {
    const u = this.user();
    if (!u) return null;
    const role = u.role.toLowerCase();
    if (role.includes('hr')) {
      return '/hr-dashboard';
    }
    if (role.includes('admin')) {
      return '/admin-dashboard';
    }
    return '/user-dashboard';
  });

  readonly isHr = computed(() => {
    const u = this.user();
    return u ? u.role.toLowerCase().includes('hr') : false;
  });

  readonly brandLink = computed(() => {
    const u = this.user();
    if (!u) return '/dashboard';
    const role = u.role.toLowerCase();
    if (role.includes('hr')) {
      return '/hr-dashboard';
    }
    return '/dashboard';
  });

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage.getItem('accessToken')) {
      this.authService.getAccount().subscribe({
        next: (res) => {
          if (res) {
            this.user.set({
              name: res.name,
              role: res.role.name,
            });
          }
        },
        error: () => {
          this.user.set(null);
        },
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.user.set(null);
    void this.router.navigateByUrl('/login');
  }
}
