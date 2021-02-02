import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {loadStyleSheets} from '../../functions/style-loader-async.func';
import {FlatpickrOptions} from 'ng2-flatpickr';
import {German} from 'flatpickr/dist/l10n/de';
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl} from '@angular/forms';

@Component({
  selector: 'app-datetime-input',
  templateUrl: 'datetime-input.component.html',
})
export class DatetimeInputComponent implements AfterViewInit, OnInit, ControlValueAccessor  {
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() label: string;
  @Input() description: string;
  @Input() name: string;
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Output() enter = new EventEmitter<unknown>();
  @Output() valueChange = new EventEmitter<unknown>();
  @ViewChild('startPicker') pickerStart: ElementRef<any>;
  public value: unknown = '';
  public initialValue: unknown = '';

  startOptions: FlatpickrOptions = {
    locale: German,
    mode: 'single',
    dateFormat: 'd.m.Y',
    defaultDate: new Date(Date.now()),
  };
  form: FormGroup;


  constructor(
    // Retrieve the dependency only from the local injector,
    // not from parent or ancestors.
    @Self()
    // We want to be able to use the component without a form,
    // so we mark the dependency as optional.
    @Optional()
    public ngControl: NgControl,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  async ngAfterViewInit() {
    // Import calendar styles
    await loadStyleSheets([
      {
        // @ts-ignore
        stylePath: import('flatpickr/dist/flatpickr.min.css'),
        elementName: 'flatpickr-style-sheet',
      },
    ]);
  }

  ngOnInit(): void {
    this.initialValue = this.value;
  }

  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   * Write form disabled state to the DOM element (model => view)
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Update form when DOM element value changes (view => model)
   */
  registerOnChange(fn: any): void {
    // Store the provided function as an internal method.
    this.onChange = fn;
  }

  /**
   * Update form when DOM element is blurred (view => model)
   */
  registerOnTouched(fn: any): void {
    // Store the provided function as an internal method.
    this.onTouched = fn;
  }

  public onChange(event: Event): void {
    this.valueChange.emit(event);
  }

  public onTouched(): void {
  }

}
