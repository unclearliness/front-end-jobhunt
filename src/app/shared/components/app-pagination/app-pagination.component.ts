import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ChevronLeft, ChevronRight, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';

@Component({
  selector: 'app-pagination',
  imports: [LucideAngularModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ ChevronLeft, ChevronRight }),
    },
  ],
  templateUrl: './app-pagination.component.html',
  styleUrl: './app-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() totalItems?: number;
  @Input() pageSize?: number;
  @Input() siblingCount = 1;

  @Output() readonly pageChange = new EventEmitter<number>();

  get pageRange(): (number | string)[] {
    const totalPageNumbers = this.siblingCount * 2 + 5; // siblingCount + firstPage + lastPage + currentPage + 2*ellipsis

    // If totalPages is less than page numbers we want to show, show all
    if (this.totalPages <= totalPageNumbers) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(this.currentPage - this.siblingCount, 1);
    const rightSiblingIndex = Math.min(this.currentPage + this.siblingCount, this.totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < this.totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * this.siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', this.totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * this.siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => this.totalPages - rightItemCount + 1 + i
      );
      return [1, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, '...', ...middleRange, '...', this.totalPages];
    }

    return [];
  }

  onPageClick(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
