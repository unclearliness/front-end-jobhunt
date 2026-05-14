import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  BriefcaseBusiness,
  Calendar,
  DollarSign,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  MapPin,
  Users,
} from 'lucide-angular';
import { AppCardComponent } from '../app-card/app-card.component';

export type QuickStatIcon = 'briefcase' | 'calendar' | 'dollar' | 'location' | 'users';

export interface QuickStatItem {
  readonly label: string;
  readonly value: string;
  readonly icon?: QuickStatIcon;
}

type QuickStatsVariant = 'stats' | 'summary';

@Component({
  selector: 'app-quick-stats',
  imports: [AppCardComponent, LucideAngularModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        BriefcaseBusiness,
        Calendar,
        DollarSign,
        MapPin,
        Users,
      }),
    },
  ],
  templateUrl: './quick-stats.component.html',
  styleUrl: './quick-stats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickStatsComponent {
  @Input() title = 'Quick Stats';
  @Input() titleId = '';
  @Input() items: readonly QuickStatItem[] = [];
  @Input() variant: QuickStatsVariant = 'stats';
}
