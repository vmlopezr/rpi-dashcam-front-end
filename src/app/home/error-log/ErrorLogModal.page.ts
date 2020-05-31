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
  /** Close the error log modal.
   */
  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  /** Send the back-end server a command to clear the error log table in the database,
   * and clear the stored log in the data service.
   */
  clearLog(): void {
    this.dataService.clearErrorLogfromDB().subscribe(() => {
      this.ErrorList.splice(0, this.ErrorList.length);
    });
  }
}
