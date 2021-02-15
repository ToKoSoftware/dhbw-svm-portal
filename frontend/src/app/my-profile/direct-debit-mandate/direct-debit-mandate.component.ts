import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {myProfilePages} from '../my-profile.pages';
import {CurrentOrgService} from '../../services/current-org/current-org.service';
import {ApiService} from '../../services/api/api.service';
import {NotificationService} from '../../services/notification/notification.service';

@Component({
  selector: 'app-direct-debit-mandate',
  templateUrl: './direct-debit-mandate.component.html'
})
export class DirectDebitMandateComponent implements OnInit {
  public formGroup: FormGroup;
  public profilePages = myProfilePages;

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly currentOrg: CurrentOrgService,
    private readonly api: ApiService,
    private readonly notifications: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        bank_name: [],
        IBAN: ['', Validators.pattern('^(?:(?:IT|SM)\\d{2}[A-Z]\\d{22}|CY\\d{2}[A-Z]\\d{23}|NL\\d{2}[A-Z]{4}\\d{10}|LV\\d{2}[A-Z]{4}\\d{13}|(?:BG|BH|GB|IE)\\d{2}[A-Z]{4}\\d{14}|GI\\d{2}[A-Z]{4}\\d{15}|RO\\d{2}[A-Z]{4}\\d{16}|KW\\d{2}[A-Z]{4}\\d{22}|MT\\d{2}[A-Z]{4}\\d{23}|NO\\d{13}|(?:DK|FI|GL|FO)\\d{16}|MK\\d{17}|(?:AT|EE|KZ|LU|XK)\\d{18}|(?:BA|HR|LI|CH|CR)\\d{19}|(?:GE|DE|LT|ME|RS)\\d{20}|IL\\d{21}|(?:AD|CZ|ES|MD|SA)\\d{22}|PT\\d{23}|(?:BE|IS)\\d{24}|(?:FR|MR|MC)\\d{25}|(?:AL|DO|LB|PL)\\d{26}|(?:AZ|HU)\\d{27}|(?:GR|MU)\\d{28})$')],
      }
    );
  }

  public createMandate(): void {
    this.api.post('/direct-debit-mandates', this.formGroup.value).subscribe(
      () => this.notifications.savedSuccessfully(),
      () => this.notifications.savingFailed()
    )
  }
}
