import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { FieldErrorComponent } from '../../../shared/components/app-field-error/app-field-error';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FieldErrorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submitForm(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.navigateAfterLogin();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.apiError(error);
      },
    });
  }

  private navigateAfterLogin(): void {
    this.authService.getAccount().subscribe({
      next: (account) => {
        void this.router.navigateByUrl(this.getDashboardRoute(account.role.name));
      },
      error: () => {
        void this.router.navigateByUrl('/dashboard');
      },
    });
  }

  private getDashboardRoute(roleName: string): string {
    const normalizedRole = roleName.toLowerCase();

    if (normalizedRole.includes('admin')) {
      return '/admin-dashboard';
    }

    if (normalizedRole.includes('hr')) {
      return '/hr-dashboard';
    }

    if (normalizedRole.includes('user')) {
      return '/dashboard';
    }



    return '/dashboard';
  }
}
