import {Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import * as SimpleMDE from 'simplemde';

@Component({
  selector: 'app-markdown-input',
  templateUrl: './markdown-input.component.html'
})
export class MarkdownInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('simplemde', {static: true}) textarea: ElementRef;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() label: string;
  @Input() description: string;
  @Input() name: string;
  @Input() placeholder = '';
  @Output() enter = new EventEmitter<unknown>();
  @Output() valueChange = new EventEmitter<unknown>();

  public value: unknown = '';
  public initialValue: unknown = '';

  ngAfterViewInit() {
    const mde = new SimpleMDE({element: this.textarea.nativeElement.value});
    mde.codemirror.on('change', (v: unknown) => {
      this.value = mde.value()
      this.valueChange.emit(mde.value());
    });
  }

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


}
