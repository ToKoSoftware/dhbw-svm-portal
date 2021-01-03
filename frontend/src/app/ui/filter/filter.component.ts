import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Input() filters: AvailableFilter[] = [];
  @Output() filterValue = new EventEmitter<FilterValue[]>();
  public usedFilters: Array<AvailableFilter[]> = [];
  public selectedFilter: string[] = [];
  public selectedFilterValue: string[] = [];

  public filter(): void {
    this.filterValue.emit(this.selectedFilterValue.map((f, i) => {
      return {
        name: this.selectedFilter[i],
        value: f
      };
    }));
  }

  public addFilter(): void {
    this.selectedFilter.push(this.filters[0].name);
    this.selectedFilterValue.push('');
    this.usedFilters.push(this.filters);
    this.filter();
  }

  public removeFilter(index: number): void {
    this.selectedFilter.splice(index, 1);
    this.selectedFilterValue.splice(index, 1);
    this.usedFilters.splice(index, 1);
    this.filter();
  }

}

export interface AvailableFilter {
  title: string;
  name: string;
}

export interface FilterValue {
  name: string;
  value: string;
}
