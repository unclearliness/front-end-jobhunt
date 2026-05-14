import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type BadgeVariant = 'default' | 'outline';

@Component({
  selector: 'app-badge',
  templateUrl: './app-badge.component.html',
  styleUrl: './app-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBadgeComponent {
  @Input() variant: BadgeVariant = 'default';
}
