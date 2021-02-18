import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { PollData } from 'src/app/interfaces/poll.interface';
import { ConfirmModalService } from 'src/app/services/confirm-modal/confirm-modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import {PollsService} from '../../services/data/polls/polls.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {teamPages} from '../teams.pages';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html'
})
export class PollsComponent implements OnInit, OnDestroy {
  public sidebarPages = teamPages;
  public current: string;
  @ViewChild('pollCreate', {static: true}) pollCreate: TemplateRef<unknown>;
  @ViewChild('pollEdit', {static: true}) pollEdit: TemplateRef<unknown>;

  constructor(public readonly polls: PollsService,
              private readonly slideOver: SlideOverService,
              private readonly confirm: ConfirmModalService,
              private readonly notifications: NotificationService,
              private readonly titleBarService: TitleBarService) {
  }

  ngOnInit(): void {
    this.titleBarService.buttons$.next([{
      title: 'Neue Umfrage',
      icon: 'plus',
      function: () => {
        this.slideOver.showSlideOver('', this.pollCreate);
      }
    }]);
  }

  public edit(poll: PollData) {
    this.current = poll.id || '';
    this.slideOver.showSlideOver('', this.pollEdit);
  }

  ngOnDestroy() {
    this.titleBarService.buttons$.next([]);
  }

  public async delete(event: Event, poll: PollData): Promise<void> {
    event.stopPropagation();
    const confirm = await this.confirm.confirm({
      title: 'Löschen bestätigen',
      description: `Sind Sie sicher, dass sie "${poll.title}" löschen möchten? Dies kann nicht rückgängig gemacht werden.`,
      confirmText: 'Löschen',
      confirmButtonType: 'danger'
    });
    if (!confirm){
      return;
    }
    this.polls.delete(poll).subscribe(
      () => this.notifications.deletedSuccessfully()
    );
  }

}
