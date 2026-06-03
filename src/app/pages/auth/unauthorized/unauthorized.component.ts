import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import {
  ShieldAlert,
  ArrowLeft,
  LogOut,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
} from 'lucide-angular';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [LucideAngularModule, AppButtonComponent, RouterLink],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        ShieldAlert,
        ArrowLeft,
        LogOut,
      }),
    },
  ],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly userRole = signal<string | null>(null);
  readonly userName = signal<string | null>(null);

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage.getItem('accessToken')) {
      this.authService.getAccount().subscribe({
        next: (account) => {
          this.userName.set(account.name);
          this.userRole.set(account.role?.name || null);
        },
        error: () => {
          this.userName.set(null);
          this.userRole.set(null);
        },
      });
    }
  }

  onGoBack(): void {
    const role = this.userRole();
    if (!role) {
      void this.router.navigateByUrl('/login');
      return;
    }

    const normalizedRole = role.toLowerCase();
    if (normalizedRole.includes('admin')) {
      void this.router.navigateByUrl('/admin-dashboard');
    } else if (normalizedRole.includes('hr')) {
      void this.router.navigateByUrl('/hr-dashboard');
    } else {
      void this.router.navigateByUrl('/user-dashboard');
    }
  }

  onLogout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }
}
