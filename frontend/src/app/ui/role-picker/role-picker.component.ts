import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-role-picker',
  templateUrl: './role-picker.component.html'
})
export class RolePickerComponent implements OnInit {
  @Input() availableRoles: Role[] | null = mockData;
  @Input() selectedRoles: Role[] | null = mockData;
  @Input() removable = false;
  @Input() editable = false;
  @Input() deletable = false;
  @Output() roles: Role[] | null = mockData;
  @Output() editEvent = new EventEmitter<Role>();
  @Output() removeEvent = new EventEmitter<Role>();
  @Output() deleteEvent = new EventEmitter<Role>();

  constructor() {
  }

  ngOnInit(): void {
  }

}

export interface Role {
  id: string;
  user_deletable?: boolean;
  title: string;
}

export const mockData: Role[] = [{
  title: "Administratoren",
  id: "1",
  user_deletable: false
}, {
  title: "Nicht angemeldete Benutzer (öffentlich)",
  id: "2",
  user_deletable: false
}, {
  title: "Angemeldete Benutzer",
  id: "3",
  user_deletable: false
}, {
  title: "Vorstand",
  id: "4",
  user_deletable: true
}, {
  title: "Jugend",
  id: "5",
  user_deletable: true
}]
