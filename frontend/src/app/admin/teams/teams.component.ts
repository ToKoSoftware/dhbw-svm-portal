import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {adminPages} from '../admin.pages';
import {UserData} from '../../interfaces/user.interface';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {TeamService} from '../../services/data/teams/team.service';
import {TeamData} from '../../interfaces/team.interface';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {RoleData} from '../../interfaces/role.interface';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html'
})
export class TeamsComponent implements OnInit {
  public sidebarPages = adminPages;
  public results: UserData[] = [];
  public current: string;
  @ViewChild('create', {static: true}) create: TemplateRef<unknown>;
  @ViewChild('edit', {static: true}) edit: TemplateRef<unknown>;
  @ViewChild('updateUsers', {static: true}) updateUsers: TemplateRef<unknown>;

  constructor(
    public teams: TeamService,
    private readonly slideOver: SlideOverService,
    public readonly titleBar: TitleBarService) {
  }

  ngOnInit(): void {
    this.titleBar.buttons$.next([{
      icon: 'plus',
      title: 'Team',
      function: () => {
        this.slideOver.showSlideOver('', this.create);
      }
    }]);
  }

  public editSlide(event: TeamData) {
    this.current = event.id || '';
    this.slideOver.showSlideOver('', this.edit);
  }

  public updateUsersSlide(event: Event, teams: TeamData) {
    event.stopPropagation();
    this.current = teams.id || '';
    this.slideOver.showSlideOver('', this.updateUsers);
  }

  ngOnDestroy(): void {
    this.titleBar.buttons$.next([]);
  }
}
