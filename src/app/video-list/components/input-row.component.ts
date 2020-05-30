import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-input-row',
  templateUrl: './input-row.component.html',
  styleUrls: ['./input-row.component.scss'],
})
export class InputRowComponent {
  @Input() data: string;
  @Output() deleteEvent = new EventEmitter<string>();
  constructor(
    private http: HttpClient,
    private dataService: DataService,
    public alertController: AlertController,
  ) {}

  getVideoPath(): string {
    return '/local-stream/' + this.data;
  }
  getThumbnail(): string {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    const filename = this.data.substr(0, this.data.lastIndexOf('.'));
    return `http://${IPAddress}:${NodePort}/videos/thumbnail/${filename}.jpg`;
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
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    const filename = this.data.substr(0, this.data.lastIndexOf('.'));
    const URL = `http://${IPAddress}:${NodePort}/videos/delete/${filename}`;
    this.deleteEvent.emit(this.data);
    this.http.get(URL).subscribe();
  }
  downloadPress(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    const filename = this.data.substr(0, this.data.lastIndexOf('.'));

    const downloadFile = `http://${IPAddress}:${NodePort}/videos/download/${filename}.mp4`;
    window.location.href = downloadFile;
  }
  async deleteAlertConfirm(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'Video will be deleted. Are you sure?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
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
