import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

type ButtonVariant = 'outline' | 'primary' | 'inverse';
type ButtonSize = 'default' | 'compact';
type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppButtonComponent {
  @Input() variant: ButtonVariant = 'outline';
  @Input() size: ButtonSize = 'default';
  @Input() type: ButtonType = 'button';
  @Input() fullWidth = false;
  @Input() disabled = false;

  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
