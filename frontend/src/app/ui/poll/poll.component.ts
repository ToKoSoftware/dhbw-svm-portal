import {Component, Input, OnInit} from '@angular/core';
import {PollData} from '../../interfaces/poll.interface';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
})
export class PollComponent implements OnInit {
  @Input() public poll: PollData;

  constructor() {
  }

  ngOnInit(): void {
  }

}
