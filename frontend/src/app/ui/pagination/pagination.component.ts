import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() limitAndOffset: LimitAndOffset = {
    limit: 25,
    offset: 0
  };
  @Output() limitAndOffsetEvent = new EventEmitter<LimitAndOffset>();

  changePage(offset: number): void {
    this.limitAndOffset.offset = offset;
    this.limitAndOffsetEvent.emit(this.limitAndOffset);
  }

  changeLimit(count: number): void {
    this.limitAndOffset.limit = count;
    this.limitAndOffset.offset = 0;
    this.limitAndOffsetEvent.emit(this.limitAndOffset);
  }

}

export interface LimitAndOffset {
  limit: number;
  offset: number;
}
