import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
export class RegisterComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const isEmp = this.route.snapshot.queryParamMap.get('employer') === 'true';
    if (isEmp) {
      this.registerForm.patchValue({ isEmployer: true });
    }
  }

  readonly registerForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    age: [18, [Validators.required, Validators.min(0)]],
    gender: ['MALE', Validators.required],
    address: ['', Validators.required],
    isEmployer: [false],
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.getRawValue();
    const payload = {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password,
      age: formValue.age,
      gender: formValue.gender,
      address: formValue.address,
    };

    const request$ = formValue.isEmployer
      ? this.authService.registerHr(payload)
      : this.authService.register(payload);

    request$.subscribe({
      next: () => {
        this.toastService.success(formValue.isEmployer ? 'Register Employer successfully!' : 'Register successfully');
        void this.router.navigateByUrl('/login');
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.apiError(error);
      },
    });
  }
}
