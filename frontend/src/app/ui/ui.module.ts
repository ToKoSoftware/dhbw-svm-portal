import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './navbar/navbar.component';
import {ButtonComponent} from './button/button.component';
import {ButtonGroupComponent} from './button-group/button-group.component';
import {TabsComponent} from './tabs/tabs.component';
import {ModalComponent} from './modals/modal/modal.component';
import {DropdownButtonComponent} from './dropdown-button/dropdown-button.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {IconsModule} from '../icons/icons.module';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {ContainerComponent} from './container/container.component';
import {StepsComponent} from './steps/steps.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NavSpacerComponent} from './nav-spacer/nav-spacer.component';
import {ButtonGroupButtonComponent} from './button-group-button/button-group-button.component';
import {SidebarItemComponent} from './sidebar-item/sidebar-item.component';
import {LoadingComponent} from './loading/loading.component';
import {ConfirmModalComponent} from './modals/confirm-modal/confirm-modal.component';
import {LoadingModalComponent} from './modals/loading-modal/loading-modal.component';
import {CustomModalComponent} from './modals/custom-modal/custom-modal.component';
import {LayoutComponent} from './layout/layout.component';
import {InputComponent} from './input/input.component';
import {LabeledValueComponent} from './labeled-value/labeled-value.component';
import {ZeroDataComponent} from './zero-data/zero-data.component';
import {FilterComponent} from './filter/filter.component';
import {PaginationComponent} from './pagination/pagination.component';
import {TopBarComponent} from './top-bar/top-bar.component';
import {SecondaryNavigationComponent} from './secondary-navigation/secondary-navigation.component';
import {NewsComponent} from './news/news.component';
import {TitledContentComponent} from './titled-content/titled-content.component';
import {NotificationComponent} from './notification/notification.component';
import {NotifierComponent} from './notifier/notifier.component';
import {SelectComponent} from './select/select.component';
import {UserPickerComponent} from './user-picker/user-picker.component';
import {RolePickerComponent} from './role-picker/role-picker.component';
import {CardComponent} from './card/card.component';
import {ScrollComponent} from './scroll/scroll.component';
import {MarkdownToHtmlModule} from 'markdown-to-html-pipe';
import {MomentModule} from 'ngx-moment';
import {PollComponent} from './poll/poll.component';
import {SlideOverComponent} from './slide-over/slide-over.component';
import {MarkdownInputComponent} from './markdown-input/markdown-input.component';
import {DatetimeInputComponent} from './datetime-input/datetime-input.component';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';


@NgModule({
  declarations: [
    NavbarComponent,
    ButtonComponent,
    ButtonGroupComponent,
    TabsComponent,
    ModalComponent,
    DropdownButtonComponent,
    SidebarComponent,
    HeaderComponent,
    ContainerComponent,
    StepsComponent,
    NavSpacerComponent,
    ButtonGroupButtonComponent,
    SidebarItemComponent,
    LoadingComponent,
    ConfirmModalComponent,
    LoadingModalComponent,
    CustomModalComponent,
    LayoutComponent,
    InputComponent,
    LabeledValueComponent,
    ZeroDataComponent,
    FilterComponent,
    PaginationComponent,
    TopBarComponent,
    SecondaryNavigationComponent,
    NewsComponent,
    TitledContentComponent,
    NotificationComponent,
    NotifierComponent,
    SelectComponent,
    UserPickerComponent,
    RolePickerComponent,
    CardComponent,
    ScrollComponent,
    PollComponent,
    SlideOverComponent,
    MarkdownInputComponent,
    DatetimeInputComponent,
    ProgressBarComponent
  ],
  exports: [
    NavbarComponent,
    DropdownButtonComponent,
    SidebarComponent,
    HeaderComponent,
    ContainerComponent,
    ButtonComponent,
    NavSpacerComponent,
    ButtonGroupComponent,
    LoadingComponent,
    ModalComponent,
    ConfirmModalComponent,
    LoadingModalComponent,
    CustomModalComponent,
    LayoutComponent,
    TabsComponent,
    StepsComponent,
    InputComponent,
    LabeledValueComponent,
    ZeroDataComponent,
    FilterComponent,
    PaginationComponent,
    TopBarComponent,
    NewsComponent,
    TitledContentComponent,
    NotificationComponent,
    NotifierComponent,
    SecondaryNavigationComponent,
    SelectComponent,
    RolePickerComponent,
    ScrollComponent,
    CardComponent,
    PollComponent,
    SlideOverComponent,
    MarkdownInputComponent,
    DatetimeInputComponent,
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    IconsModule,
    RouterModule,
    FormsModule,
    MarkdownToHtmlModule,
    MomentModule,
    Ng2FlatpickrModule,
    ReactiveFormsModule
  ]
})
export class UiModule {
}
