import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { FieldErrorComponent } from '../../../shared/components/app-field-error/app-field-error';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, FieldErrorComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly registerForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    age: [18, [Validators.required, Validators.min(0)]],
    gender: ['MALE', Validators.required],
    address: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.toastService.success('Đăng ký thành công!');
        void this.router.navigateByUrl('/login');
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.apiError(error);
      },
    });
  }
}
