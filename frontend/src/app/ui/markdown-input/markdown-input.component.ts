import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import * as SimpleMDE from 'simplemde';

@Component({
  selector: 'app-markdown-input',
  templateUrl: './markdown-input.component.html'
})
export class MarkdownInputComponent implements OnInit, ControlValueAccessor, OnChanges {
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
  private mde: SimpleMDE;

  ngAfterViewInit() {
    this.mde = new SimpleMDE(
      {
        element: this.textarea.nativeElement,
        forceSync: true,
        spellChecker: false,
        renderingConfig: {
          codeSyntaxHighlighting: true,
        },
      }
    );
    this.mde.value(this.value as string || '');
    this.mde.codemirror.on('change', (v: unknown) => {
      if (this.value !== this.mde.value()) {
        // manually trigger change detection of form
        this.onChange(this.mde.value());
      }
      this.value = this.mde.value();
      this.valueChange.emit(this.mde.value());
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
    if (this.mde != undefined) {
      this.mde.value(this.value as string || '');
      this.ngControl.viewToModelUpdate(this.value);
    }
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

  public onChange(event: Event | string): void {
    this.valueChange.emit(event);
  }

  public onTouched(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mde != undefined) {
      this.mde.value(this.value as string || '');
    }
  }

}
