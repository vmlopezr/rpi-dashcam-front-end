import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StreamService } from '../../services/streaming.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'livestream-modal',
  templateUrl: './livestream-modal.html',
  styleUrls: ['./livestream-modal.scss'],
})
export class LivestreamModal {
  header: boolean;
  platform: Platform;
  constructor(
    private _platform: Platform,
    private modalController: ModalController,
    private streamService: StreamService,
  ) {
    this.header = true;
  }
  CloseModal(): void {
    this.modalController.dismiss();
  }
}
