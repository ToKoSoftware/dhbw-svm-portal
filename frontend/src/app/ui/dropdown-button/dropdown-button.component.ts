import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.scss']
})
export class DropdownButtonComponent implements OnInit {
  @ViewChild('dropdown') profileMenu: ElementRef<any>;

  constructor() {
  }

  ngOnInit(): void {
  }

  public toggleDropdown(): void {
    if (this.profileMenu.nativeElement.classList.contains('opacity-0')) {
      this.profileMenu.nativeElement.classList.remove(['opacity-0']);
      this.profileMenu.nativeElement.classList.remove('scale-95');
      this.profileMenu.nativeElement.classList.add('opacity-100');
      this.profileMenu.nativeElement.classList.add('scale-100');
    } else {
      this.profileMenu.nativeElement.classList.remove('opacity-100');
      this.profileMenu.nativeElement.classList.remove('scale-100');
      this.profileMenu.nativeElement.classList.add('opacity-0');
      this.profileMenu.nativeElement.classList.add('scale-95');
    }
  }
}
