import {Component} from '@angular/core';
import {ModalService} from '../../../services/modal/modal.service';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss']
})
export class CustomModalComponent {
  constructor(public readonly modalService: ModalService) {
  }

}
