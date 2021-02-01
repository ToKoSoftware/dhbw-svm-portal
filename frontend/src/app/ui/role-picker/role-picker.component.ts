import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RoleData} from '../../interfaces/role.interface';

@Component({
  selector: 'app-role-picker',
  templateUrl: './role-picker.component.html'
})
export class RolePickerComponent implements OnInit {
  @Input() availableRoles: RoleData[] | null = [];
  @Input() selectedRoles: RoleData[] | null = [];
  @Input() removable = false;
  @Input() editable = false;
  @Input() deletable = false;
  @Output() roles: RoleData[] | null = [];
  @Output() editEvent = new EventEmitter<RoleData>();
  @Output() removeEvent = new EventEmitter<RoleData>();
  @Output() deleteEvent = new EventEmitter<RoleData>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
