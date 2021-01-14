import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoadingModalService} from '../../../services/loading-modal/loading-modal.service';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html'
})
export class LoadingModalComponent {

  constructor(public loadingModalService: LoadingModalService) { }

}
