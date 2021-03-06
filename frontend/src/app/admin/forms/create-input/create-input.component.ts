import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-input',
  templateUrl: './create-input.component.html'
})
export class CreateInputComponent implements OnInit {
  public formGroup: FormGroup;
  public answerOptions: [string | number, string | number][] = [
    [
      'text', 'Text (Einzeilig)'
    ],
    [
      'markdown', 'Text (Mehrzeilig)'
    ],
    [
      'select', 'Listen-Auswahl'
    ],
  ];

  constructor(
    private readonly formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        title: [],
        field_type: [],
      }
    );
  }

  public addField(): void {
  }
}
