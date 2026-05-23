import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Building2,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  MapPin,
} from 'lucide-angular';
import { AppButtonComponent } from '../app-button/app-button.component';

export interface CompanyCardData {
  readonly id: number;
  readonly initials?: string;
  readonly name: string;
  readonly location: string;
  readonly industry?: string;
  readonly description: string;
  readonly openJobs: string;
  readonly logoUrl?: string;
}

@Component({
  selector: 'app-company-card',
  imports: [AppButtonComponent, LucideAngularModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ Building2, MapPin }),
    },
  ],
  templateUrl: './company-card.component.html',
  styleUrl: './company-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyCardComponent {
  @Input({ required: true }) company!: CompanyCardData;

  @Output() viewCompany = new EventEmitter<CompanyCardData>();

  onViewCompany(): void {
    this.viewCompany.emit(this.company);
  }
}
