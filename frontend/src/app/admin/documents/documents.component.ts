import { Component, OnInit } from '@angular/core';
import {adminPages} from '../admin.pages';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html'
})
export class DocumentsComponent implements OnInit {
  public sidebarPages = adminPages;

  constructor() { }

  ngOnInit(): void {
  }

}
