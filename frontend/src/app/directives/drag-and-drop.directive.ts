import {Directive, Output, Input, EventEmitter, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {

  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') private background = '#efefef';
  @HostBinding('style.opacity') private opacity = '1';

  @HostListener('dragover', ['$event']) onDragOver(evt: Event): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#ffffff';
    this.opacity = '0.8';
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt: Event): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#efefef';
    this.opacity = '1';
  }

  @HostListener('drop', ['$event'])
  public ondrop(evt: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#efefef';
    this.opacity = '1';
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }

}
