import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  SlidersHorizontal,
} from 'lucide-angular';
import { AppButtonComponent } from '../app-button/app-button.component';

export interface FilterOption {
  readonly label: string;
  readonly checked: boolean;
}

export interface FilterGroup {
  readonly title: string;
  readonly options: readonly FilterOption[];
}

@Component({
  selector: 'app-job-filter-sidebar',
  imports: [AppButtonComponent, LucideAngularModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ SlidersHorizontal }),
    },
  ],
  templateUrl: './job-filter-sidebar.component.html',
  styleUrl: './job-filter-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobFilterSidebarComponent {
  @Input() filterGroups: readonly FilterGroup[] = [];
  @Output() filtersReset = new EventEmitter<void>();
  @Output() filterChanged = new EventEmitter<{ groupTitle: string; optionLabel: string; checked: boolean }>();

  onResetFilters(): void {
    this.filtersReset.emit();
  }
  onToggleOption(groupTitle: string, optionLabel: string): void {
    this.filterChanged.emit({ groupTitle, optionLabel, checked: true });
  }
}
