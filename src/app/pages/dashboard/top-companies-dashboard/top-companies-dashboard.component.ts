import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import {
  CompanyCardComponent,
  CompanyCardData,
} from '../../../shared/components/company-card/company-card.component';
import { CompanyService } from '../../../services/company.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { API_ENDPOINTS } from '../../../shared/constants/api-endpoints';

export type Company = CompanyCardData;

@Component({
  selector: 'app-top-companies-dashboard',
  imports: [AppButtonComponent, CompanyCardComponent],
  templateUrl: './top-companies-dashboard.component.html',
  styleUrl: './top-companies-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopCompaniesDashboardComponent {
  private readonly router = inject(Router);
  private readonly companyService = inject(CompanyService);

  readonly companies = toSignal(
    this.companyService.search(1, 4).pipe(
      map((companies: any[]) =>
        companies.map((company) => ({
          id: company.id,
          name: company.name,
          location: company.address,
          description: company.description,
          logoUrl: company.logo
            ? `${API_ENDPOINTS.companies.logoBase}${company.logo}`
            : undefined,
          openJobs: 'View jobs',
        })),
      ),
    ),
    { initialValue: [] },
  );

  onViewAllCompanies(): void {
    void this.router.navigateByUrl('/companies');
  }

  onViewCompany(company: Company): void {
    void this.router.navigate(['/companies', company.id]);
  }
}
