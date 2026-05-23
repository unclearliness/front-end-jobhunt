import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  Upload,
  X,
} from 'lucide-angular';
import { finalize, Observable } from 'rxjs';
import { AppButtonComponent } from '../app-button/app-button.component';

export type ModalFormFieldType = 'text' | 'email' | 'textarea' | 'file';

export interface ModalFormField {
  readonly key: string;
  readonly label: string;
  readonly type?: ModalFormFieldType;
  readonly placeholder?: string;
  readonly hint?: string;
  readonly required?: boolean;
  readonly rows?: number;
  readonly accept?: string;
  readonly maxFileSizeMb?: number;
  readonly validators?: readonly ValidatorFn[];
  readonly uploadHandler?: (file: File) => Observable<string>;
}

export interface ModalFormSubmitEvent {
  readonly values: Record<string, unknown>;
  readonly files: Record<string, File | null>;
  readonly uploadedFiles: Record<string, string | null>;
}

@Component({
  selector: 'app-modal-form',
  imports: [AppButtonComponent, LucideAngularModule, ReactiveFormsModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ Upload, X }),
    },
  ],
  templateUrl: './app-modal-form.component.html',
  styleUrl: './app-modal-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppModalFormComponent implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);

  @Input() open = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() submitLabel = 'Submit';
  @Input() cancelLabel = 'Cancel';
  @Input() fields: readonly ModalFormField[] = [];
  @Input() initialValues: Readonly<Record<string, unknown>> = {};

  @Output() closed = new EventEmitter<void>();
  @Input() submitAction?: (event: ModalFormSubmitEvent) => void;
  @Output() submitted = new EventEmitter<ModalFormSubmitEvent>();

  form = this.formBuilder.group({});
  readonly dragOverFieldKey = signal<string | null>(null);
  readonly fileErrorMessages = signal<Record<string, string>>({});
  readonly fileNames = signal<Record<string, string>>({});
  readonly uploadedFileValues = signal<Record<string, string>>({});
  readonly uploadingFieldKeys = signal<Record<string, boolean>>({});

  private submitAttempted = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] || changes['initialValues']) {
      this.rebuildForm();
    }

    if (changes['open']?.currentValue === true) {
      this.resetFormState();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.open) {
      this.onClose();
    }
  }

  onClose(): void {
    this.closed.emit();
  }

  onBackdropClick(): void {
    this.onClose();
  }

  onSubmit(): void {
    this.submitAttempted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const rawValues = this.form.getRawValue() as Record<string, unknown>;
    const values: Record<string, unknown> = {};
    const files: Record<string, File | null> = {};
    const uploadedFiles: Record<string, string | null> = {};

    for (const field of this.fields) {
      const value = rawValues[field.key] ?? null;

      if (field.type === 'file') {
        if (this.isUploading(field.key)) {
          this.updateSignalRecord(
            this.fileErrorMessages,
            field.key,
            `Please wait until ${field.label.toLowerCase()} finishes uploading.`,
          );
          this.getControl(field.key)?.markAsTouched();
          return;
        }

        const uploadedValue = this.uploadedFileValues()[field.key] ?? null;

        if (field.required && !uploadedValue) {
          this.updateSignalRecord(
            this.fileErrorMessages,
            field.key,
            `Please upload ${field.label.toLowerCase()} before submitting.`,
          );
          this.getControl(field.key)?.markAsTouched();
          return;
        }

        files[field.key] = value instanceof File ? value : null;
        uploadedFiles[field.key] = uploadedValue;
        values[field.key] = uploadedValue;
      } else {
        values[field.key] = value;
      }
    }

    const payload: ModalFormSubmitEvent = { values, files, uploadedFiles };
    console.log('app-modal-form emitting', payload);
    this.submitted.emit(payload);
    if (this.submitAction) {
      try {
        this.submitAction(payload);
      } catch (err) {
        // swallow errors from parent-provided function to avoid breaking modal
        console.error('submitAction threw', err);
      }
    }
  }

  onFileDragOver(event: DragEvent, fieldKey: string): void {
    event.preventDefault();
    this.dragOverFieldKey.set(fieldKey);
  }

  onFileDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOverFieldKey.set(null);
  }

  onFileDrop(event: DragEvent, field: ModalFormField): void {
    event.preventDefault();
    this.dragOverFieldKey.set(null);

    const droppedFile = event.dataTransfer?.files?.item(0) ?? null;
    this.handleFileSelection(field, droppedFile);
  }

  onFileSelected(event: Event, field: ModalFormField): void {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files?.item(0) ?? null;

    this.handleFileSelection(field, selectedFile);
    input.value = '';
  }

  getControl(fieldKey: string): AbstractControl | null {
    return this.form.get(fieldKey);
  }

  getFieldErrorMessage(field: ModalFormField): string | null {
    const control = this.getControl(field.key);

    if (!control || (!control.touched && !this.submitAttempted)) {
      return null;
    }

    if (field.type === 'file') {
      const fileErrorMessage = this.fileErrorMessages()[field.key] ?? null;

      if (fileErrorMessage) {
        return fileErrorMessage;
      }
    }

    if (control.hasError('required')) {
      return `${field.label} is required.`;
    }

    if (control.hasError('email')) {
      return `${field.label} is not a valid email address.`;
    }

    if (control.hasError('fileType') || control.hasError('fileSize')) {
      return this.fileErrorMessages()[field.key] ?? null;
    }

    return null;
  }

  getFileName(fieldKey: string): string | null {
    return this.fileNames()[fieldKey] ?? null;
  }

  getUploadedFileValue(fieldKey: string): string | null {
    return this.uploadedFileValues()[fieldKey] ?? null;
  }

  isUploading(fieldKey: string): boolean {
    return !!this.uploadingFieldKeys()[fieldKey];
  }

  getTextAreaRows(field: ModalFormField): number {
    return field.rows ?? 5;
  }

  private rebuildForm(): void {
    const controls: Record<string, FormControl<unknown>> = {};

    for (const field of this.fields) {
      const validators: ValidatorFn[] = [...(field.validators ?? [])];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      const initialValue =
        field.type === 'file' ? null : (this.initialValues[field.key] ?? '');

      controls[field.key] = new FormControl(initialValue, { validators });
    }

    this.form = this.formBuilder.group(controls);
  }

  private resetFormState(): void {
    this.submitAttempted = false;
    this.dragOverFieldKey.set(null);
    this.fileErrorMessages.set({});
    this.fileNames.set({});
    this.uploadedFileValues.set({});
    this.uploadingFieldKeys.set({});
    this.form.reset(this.buildResetValues());
  }

  private buildResetValues(): Record<string, unknown> {
    const values: Record<string, unknown> = {};

    for (const field of this.fields) {
      values[field.key] = field.type === 'file' ? null : (this.initialValues[field.key] ?? '');
    }

    return values;
  }

  private handleFileSelection(field: ModalFormField, file: File | null): void {
    this.setFileValue(field, file);

    if (file && field.uploadHandler && this.getControl(field.key)?.value instanceof File) {
      this.startFileUpload(field, file);
    }
  }

  private setFileValue(field: ModalFormField, file: File | null): void {
    const control = this.getControl(field.key);

    if (!control) {
      return;
    }

    if (!file) {
      this.updateSignalRecord(this.fileNames, field.key, null);
      this.updateSignalRecord(this.uploadedFileValues, field.key, null);
      this.updateSignalRecord(this.fileErrorMessages, field.key, field.required ? `${field.label} is required.` : null);
      control.setValue(null);
      control.setErrors(field.required ? { required: true } : null);
      control.markAsTouched();
      return;
    }

    if (field.accept && !this.matchesAcceptedFileType(file, field.accept)) {
      this.updateSignalRecord(this.fileNames, field.key, null);
      this.updateSignalRecord(this.uploadedFileValues, field.key, null);
      this.updateSignalRecord(this.fileErrorMessages, field.key, `Accepted file types: ${field.accept}.`);
      control.setValue(null);
      control.setErrors({ fileType: true });
      control.markAsTouched();
      return;
    }

    if (field.maxFileSizeMb && file.size > field.maxFileSizeMb * 1024 * 1024) {
      this.updateSignalRecord(
        this.fileNames,
        field.key,
        null,
      );
      this.updateSignalRecord(
        this.uploadedFileValues,
        field.key,
        null,
      );
      this.updateSignalRecord(
        this.fileErrorMessages,
        field.key,
        `${field.label} must be ${field.maxFileSizeMb}MB or smaller.`,
      );
      control.setValue(null);
      control.setErrors({ fileSize: true });
      control.markAsTouched();
      return;
    }

    this.updateSignalRecord(this.fileNames, field.key, file.name);
    this.updateSignalRecord(this.uploadedFileValues, field.key, null);
    this.updateSignalRecord(this.fileErrorMessages, field.key, null);
    control.setValue(file);
    control.setErrors(null);
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  private startFileUpload(field: ModalFormField, file: File): void {
    if (!field.uploadHandler) {
      return;
    }

    this.updateUploadingState(field.key, true);
    this.updateSignalRecord(this.fileErrorMessages, field.key, null);

    field
      .uploadHandler(file)
      .pipe(finalize(() => this.updateUploadingState(field.key, false)))
      .subscribe({
        next: (uploadedFileName) => {
          this.updateSignalRecord(this.uploadedFileValues, field.key, uploadedFileName);
          this.updateSignalRecord(this.fileErrorMessages, field.key, null);
        },
        error: () => {
          this.updateSignalRecord(
            this.fileErrorMessages,
            field.key,
            `Unable to upload ${field.label.toLowerCase()}.`,
          );
          this.updateSignalRecord(this.uploadedFileValues, field.key, null);
        },
      });
  }

  private matchesAcceptedFileType(file: File, accept: string): boolean {
    const acceptedTypes = accept
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean);

    if (!acceptedTypes.length) {
      return true;
    }

    const fileName = file.name.toLowerCase();
    const mimeType = file.type.toLowerCase();

    return acceptedTypes.some((acceptedType) => {
      if (acceptedType.startsWith('.')) {
        return fileName.endsWith(acceptedType);
      }

      if (acceptedType.endsWith('/*')) {
        return mimeType.startsWith(acceptedType.slice(0, -1));
      }

      return mimeType === acceptedType;
    });
  }

  private updateSignalRecord(
    targetSignal: WritableSignal<Record<string, string>>,
    key: string,
    value: string | null,
  ): void {
    targetSignal.update((currentValue) => {
      if (!value) {
        const { [key]: _removed, ...rest } = currentValue;
        return rest;
      }

      return {
        ...currentValue,
        [key]: value,
      };
    });
  }

  private updateUploadingState(key: string, isUploading: boolean): void {
    this.uploadingFieldKeys.update((currentValue) => {
      if (!isUploading) {
        const { [key]: _removed, ...rest } = currentValue;
        return rest;
      }

      return {
        ...currentValue,
        [key]: true,
      };
    });
  }
}
