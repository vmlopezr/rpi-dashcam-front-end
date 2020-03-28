import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ErrorLogModal } from './ErrorLogModal.page';

@NgModule({
  declarations: [ErrorLogModal],

  imports: [CommonModule, IonicModule.forRoot()],
  exports: [ErrorLogModal],

  entryComponents: [ErrorLogModal],
})
export class ErrorLogModalModule {}
