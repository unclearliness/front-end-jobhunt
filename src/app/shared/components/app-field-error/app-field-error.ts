import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  templateUrl: './app-field-error.html',
  styleUrl: './app-field-error.scss',
})
export class FieldErrorComponent {
  control = input.required<AbstractControl | null>();
  fieldName = input<string>('Trường này');
}
