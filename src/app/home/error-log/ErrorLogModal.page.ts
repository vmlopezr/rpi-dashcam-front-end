import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService, ErrorLog } from '../../services/data.service';
@Component({
  selector: 'modal-page',
  templateUrl: './ErrorLogModal.page.html',
  styleUrls: ['./ErrorLogModal.page.scss'],
})
export class ErrorLogModal {
  ErrorList: ErrorLog[];
  constructor(
    private dataService: DataService,
    private modalController: ModalController,
  ) {
    this.ErrorList = dataService.getErrorLog();
  }
  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  clearLog(): void {
    this.dataService.clearErrorLogfromDB().subscribe(() => {
      this.ErrorList.splice(0, this.ErrorList.length);
    });
  }
}
