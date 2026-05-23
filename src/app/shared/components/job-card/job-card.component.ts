import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Bookmark,
  Clock,
  DollarSign,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  MapPin,
} from 'lucide-angular';
import { AppBadgeComponent } from '../app-badge/app-badge.component';
import { AppButtonComponent } from '../app-button/app-button.component';

export interface JobCardData {
  readonly id: number;
  readonly initials: string;
  readonly logoUrl?: string;
  readonly title: string;
  readonly company: string;
  readonly location: string;
  readonly salary: string;
  readonly type: string;
  readonly timePosted: string;
  readonly description?: string;
  readonly tags?: readonly string[];
}

type JobCardAppearance = 'featured' | 'search';

@Component({
  selector: 'app-job-card',
  imports: [AppBadgeComponent, AppButtonComponent, LucideAngularModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ Bookmark, Clock, DollarSign, MapPin }),
    },
  ],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobCardComponent {
  private _job!: JobCardData;

  @Input({ required: true })
  set job(value: JobCardData) {
    this._job = value;
    this.logoLoadFailed = false;
  }

  get job(): JobCardData {
    return this._job;
  }

  @Input() appearance: JobCardAppearance = 'featured';

  @Output() viewDetails = new EventEmitter<JobCardData>();

  logoLoadFailed = false;

  onViewDetails(): void {
    this.viewDetails.emit(this.job);
  }

  onLogoError(): void {
    this.logoLoadFailed = true;
  }
}
