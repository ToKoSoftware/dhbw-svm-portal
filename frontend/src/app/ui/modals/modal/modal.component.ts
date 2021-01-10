import {Component, Input, OnInit} from '@angular/core';
import {ModalService} from '../../../services/modal/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() title = '';
  @Input() blocking = false; // modal cannot be closed (e.g. loading)

  constructor(private modalService: ModalService) {
  }

  public closeModal(): void {
    this.modalService.close();
  }

}
