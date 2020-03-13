import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../services/config.service';
@Component({
  selector: 'app-input-row',
  templateUrl: './input-row.component.html',
  styleUrls: ['./input-row.component.scss'],
})
export class InputRowComponent {
  @Input() data: string;
  @Input() index: number;
  @Output() deleteEvent = new EventEmitter<number>();
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    public alertController: AlertController,
  ) {}

  getVideoPath(): string {
    return '/local-stream/' + this.data;
  }
  getThumbnail(): string {
    const port = this.configService.getNodePort();
    const address = this.configService.getNodeAddress();
    const filename = this.data.substr(0, this.data.lastIndexOf('.'));
    return `http://${address}:${port}/videos/thumbnail/${filename}.jpg`;
  }
  getDate(): string {
    const date = this.data.substr(0, this.data.indexOf('-'));
    const values = date.split('_');
    return `${values[0]} ${parseInt(values[1])}, ${values[2]}`;
  }
  getTime(): string {
    const filename = this.data.substr(0, this.data.lastIndexOf('.'));
    const index = filename.indexOf('-') + 1;
    const timestamp = filename.substr(index, filename.length).split('.');
    return `${timestamp[0]}:${timestamp[1]}:${timestamp[2]} ${timestamp[3]}`;
  }
  deleteFile(): void {
    const port = this.configService.getNodePort();
    const address = this.configService.getNodeAddress();
    const filename = this.data.substr(0, this.data.lastIndexOf('.'));
    const URL = `http://${address}:${port}/videos/delete/${filename}`;

    this.deleteEvent.emit(this.index);
    this.http.get(URL).subscribe();
  }
  downloadPress(): void {
    const port = this.configService.getNodePort();
    const address = this.configService.getNodeAddress();
    const filename = this.data.substr(0, this.data.lastIndexOf('.'));

    const downloadFile = `http://${address}:${port}/videos/download/${filename}.mp4`;
    window.location.href = downloadFile;
  }
  async deleteAlertConfirm(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'Video will be deleted. Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteFile();
          },
        },
      ],
    });

    await alert.present();
  }
}

export class InputRow {}
