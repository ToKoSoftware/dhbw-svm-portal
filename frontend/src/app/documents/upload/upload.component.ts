import {Component} from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {FileUploadService} from '../../services/file-upload/file-upload.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  private fileToUpload: File | null = null;
  public files: FileList | null = null;
  public uploading = false;

  constructor(
    private readonly modalService: ModalService,
    private readonly confirm: ConfirmModalService,
    private readonly slideOver: SlideOverService,
    private readonly fileUploadService: FileUploadService) {
  }

  /**
   * Callback for file change event
   * @param files
   */
  public handleFileChange(files: FileList): void {
    this.files = files;
    this.fileToUpload = files.item(0);
  }

  /**
   * Send file to server
   */
  public saveFile(): void {
    if (this.fileToUpload === null) {
      console.log('File Upload failed');
      return;
    }
    this.uploading = true;
    this.fileUploadService.upload('/documents', this.fileToUpload)
      .subscribe(
        async data => {
          this.uploading = false;
          this.files = null;
          this.fileToUpload = null;
          this.fileUploadService.uploadEvent$.next(true);
          this.slideOver.close();
        },
        error => {
          this.modalService.close();
          this.confirm.confirm({
            title: `Es ist ein Fehler beim Hochladen aufgetreten.`,
            confirmButtonType: 'info',
            confirmText: 'Ok',
            description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
            showCancelButton: false
          });
        }
      );
  }

  deleteAttachment(index: any): void {
    this.files = null;
  }

  public closeModal(): void {
    this.modalService.close();
  }
}
