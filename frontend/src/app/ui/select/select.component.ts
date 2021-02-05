import {Component, EventEmitter, Input, OnChanges, Optional, Output, Self, SimpleChanges} from '@angular/core';
import {NgControl} from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html'
})
export class SelectComponent implements OnChanges {
  @Input() disabled: boolean;
  @Input() label: string;
  @Input() description: string;
  @Input() name: string;
  @Input() selected = '';
  @Input() items: [string | number, string | number][] = [];
  @Output() enter = new EventEmitter<unknown>();
  @Output() valueChange = new EventEmitter<unknown>();

  value: unknown = '';

  constructor(
    // Retrieve the dependency only from the local injector,
    // not from parent or ancestors.
    @Self()
    // We want to be able to use the component without a form,
    // so we mark the dependency as optional.
    @Optional()
    private ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
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
    this.valueChange.emit(this.value);
  }

  public updateValue(event: Event): void {
    this.value = event;
    this.onChange(event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.value){
      // set default value if not already set
      this.value = this.items != null && this.items.length != 0 ? this.items[0][0] : ''
    }
  }

  public onTouched(): void {
  }

}
