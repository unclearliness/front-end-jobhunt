import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  Globe,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  MapPin,
} from 'lucide-angular';
import { AppBadgeComponent } from '../app-badge/app-badge.component';

export interface CompanyInfoBadge {
  readonly label: string;
  readonly variant?: 'default' | 'outline';
}

export interface CompanyInfoData {
  readonly initials: string;
  readonly name: string;
  readonly location?: string;
  readonly websiteLabel?: string;
  readonly websiteUrl?: string;
  readonly badges?: readonly CompanyInfoBadge[];
  readonly description?: string;
}

type CompanyInfoHeadingLevel = 'h1' | 'h2' | 'h3';
type CompanyInfoVariant = 'default' | 'compact';

@Component({
  selector: 'app-company-info',
  imports: [AppBadgeComponent, LucideAngularModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ Globe, MapPin }),
    },
  ],
  templateUrl: './company-info.component.html',
  styleUrl: './company-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyInfoComponent {
  @Input({ required: true }) company!: CompanyInfoData;
  @Input() headingLevel: CompanyInfoHeadingLevel = 'h2';
  @Input() variant: CompanyInfoVariant = 'default';
}
