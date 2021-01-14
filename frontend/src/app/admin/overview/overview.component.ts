import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {adminPages} from "../admin.pages";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  public sidebarPages = adminPages;
  public editOrgForm: FormGroup;

  constructor(private api: ApiService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.editOrgForm = this.formBuilder.group(
      {
        title: ['Test e.V.'],
        access_code: ['AAA-BBB'],
      }
    );
  }
}

