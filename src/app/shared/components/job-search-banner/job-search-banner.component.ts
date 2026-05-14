import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  MapPin,
  Search,
} from 'lucide-angular';
import { AppButtonComponent } from '../app-button/app-button.component';

@Component({
  selector: 'app-job-search-banner',
  imports: [AppButtonComponent, LucideAngularModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ MapPin, Search }),
    },
  ],
  templateUrl: './job-search-banner.component.html',
  styleUrl: './job-search-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobSearchBannerComponent {
  @Input() title: string = 'Search Jobs';
  @Input() searchPlaceholder: string = 'Job title...';
  @Input() searchAriaLabel = 'Job title or keyword';
  @Input() locationPlaceholder: string = 'Location...';
  @Input() showLocationField = true;
  @Input() submitLabel = 'Search';
  @Input() formAriaLabel = 'Search jobs';

  @Output() searchSubmitted = new EventEmitter<void>();

  onSubmit(): void {
    this.searchSubmitted.emit();
  }
}
