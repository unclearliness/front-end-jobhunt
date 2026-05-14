import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  title?: string;
}

export interface ToastOptions {
  title?: string;
  duration?: number;
}

interface ApiErrorBody {
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastsSignal = signal<Toast[]>([]);
  private nextId = 1;

  readonly toasts = this.toastsSignal.asReadonly();

  success(message: string, options?: ToastOptions): void {
    this.show(message, 'success', options);
  }

  error(message: string, options?: ToastOptions): void {
    this.show(message, 'error', options);
  }

  apiError(error: HttpErrorResponse, statusCode = 400): void {
    if (error.status !== statusCode) {
      return;
    }

    const message = (error.error as ApiErrorBody)?.message;

    if (message) {
      this.error(message);
    }
  }

  info(message: string, options?: ToastOptions): void {
    this.show(message, 'info', options);
  }

  warning(message: string, options?: ToastOptions): void {
    this.show(message, 'warning', options);
  }

  dismiss(id: number): void {
    this.toastsSignal.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private show(message: string, type: ToastType, options?: ToastOptions): void {
    const toast: Toast = {
      id: this.nextId,
      message,
      type,
      title: options?.title,
    };

    this.nextId += 1;
    this.toastsSignal.update((toasts) => [...toasts, toast]);

    window.setTimeout(() => {
      this.dismiss(toast.id);
    }, options?.duration ?? 4000);
  }
}
