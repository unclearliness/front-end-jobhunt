import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employer-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employer-register.component.html',
  styleUrl: './employer-register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerRegisterComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly employerRegisterForm = this.formBuilder.nonNullable.group({
    companyName: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    phone: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.employerRegisterForm.invalid) {
      this.employerRegisterForm.markAllAsTouched();
    }
  }
}
