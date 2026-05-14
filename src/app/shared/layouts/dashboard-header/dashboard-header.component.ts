import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  imports: [RouterLink],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHeaderComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  user = signal<{ name: string; role: string } | null>(null);

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
