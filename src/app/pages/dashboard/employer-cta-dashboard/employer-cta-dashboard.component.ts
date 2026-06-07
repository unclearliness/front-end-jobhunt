import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-employer-cta-dashboard',
  templateUrl: './employer-cta-dashboard.component.html',
  styleUrl: './employer-cta-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerCtaDashboardComponent {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  get isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!window.localStorage.getItem('accessToken');
  }

  onPostJob(): void {
    if (this.isLoggedIn) {
      this.toastService.warning('Only employer accounts can post jobs. Please register or log in with an employer account.');
    } else {
      void this.router.navigate(['/register-job-seeker'], { queryParams: { employer: 'true' } });
    }
  }
}
