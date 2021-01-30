import {Component, OnInit} from '@angular/core';
import {adminPages} from '../admin.pages';
import {FormBuilder} from '@angular/forms';
import {ApiService} from '../../services/api/api.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnInit {
  public sidebarPages = adminPages;

  constructor(private api: ApiService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
  }
}
