import {Component, EventEmitter, Input, OnInit, Optional, Output, Self} from '@angular/core';
import {ControlValueAccessor, NgControl, ValidationErrors} from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html'
})
export class InputComponent implements OnInit, ControlValueAccessor {
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() label: string;
  @Input() description: string;
  @Input() name: string;
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Output() enter = new EventEmitter<unknown>();
  @Output() valueChange = new EventEmitter<unknown>();

  public value: unknown = '';
  public initialValue: unknown = '';

  constructor(
    // Retrieve the dependency only from the local injector,
    // not from parent or ancestors.
    @Self()
    // We want to be able to use the component without a form,
    // so we mark the dependency as optional.
    @Optional()
    public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
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

  get errorMessage(): string | null {
    if (this.ngControl.errors == null) {
      return null;
    }
    for (let propertyName in this.ngControl.errors) {
      if (this.ngControl.errors.hasOwnProperty(propertyName)) {
        if (errorMessages.hasOwnProperty(propertyName)) {
          return errorMessages[propertyName];
        } else {
          return this.getComputedError(this.ngControl.errors);
        }
      }
    }

    return null;
  }

  private getComputedError(error: ValidationErrors): string | null {
    const keys = Object.keys(error);
    if (keys.length === 0) {
      return null;
    }
    const key = keys[0];
    switch (key) {
      case 'minlength':
        const missing = error.minlength.requiredLength - error.minlength.actualLength;
        return `Geben Sie bitte ${missing} weitere${missing === 1? 's' : ''} Zeichen ein`;
    }
    return 'Fehlerhafte Eingabe.';
  }
}

const errorMessages: { [k: string]: string } = {
  required: 'Bitte füllen Sie dieses Feld aus.',
  email: 'Bitte geben Sie eine valide E-Mail an.',
};
