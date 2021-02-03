import { Component, OnInit } from '@angular/core';
import {PollsService} from '../../services/data/polls/polls.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {

  constructor(public polls: PollsService) { }

  ngOnInit(): void {
  }

}
