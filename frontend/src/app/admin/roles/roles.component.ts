import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {adminBreadcrumb, adminPages} from '../admin.pages';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {RolesService} from '../../services/data/roles/roles.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {RoleData} from '../../interfaces/role.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
})
export class RolesComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  public breadcrumb = adminBreadcrumb;
  public loading = false;
  public current: string;
  @ViewChild('create', {static: true}) create: TemplateRef<unknown>;
  @ViewChild('edit', {static: true}) edit: TemplateRef<unknown>;

  constructor(
    public readonly titleBar: TitleBarService,
    private readonly slideOver: SlideOverService,
    public readonly roles: RolesService) {
  }

  ngOnInit(): void {
    this.titleBar.buttons$.next([{
      icon: 'plus',
      title: 'Rolle',
      function: () => {
        this.slideOver.showSlideOver('', this.create);
      }
    }]);
  }

  public editSlide(roles: RoleData) {
    this.current = roles.id || '';
    this.slideOver.showSlideOver('', this.edit);
  }


  ngOnDestroy(): void {
    this.titleBar.buttons$.next([]);
  }

}
