import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LiveStreamPage } from './live-stream.page';
import { DefaultCam } from './CamComponents/DefaultCam/DefaultCam.component';
import { LogitechC920 } from './CamComponents/LogitechC920/LogitechC920.component';
import { MSHD3000 } from './CamComponents/MSHD3000/MSHD3000.component';
const routes: Routes = [
  {
    path: '',
    component: LiveStreamPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [LiveStreamPage, DefaultCam, LogitechC920, MSHD3000],
  entryComponents: [DefaultCam, LogitechC920, MSHD3000],
})
export class LiveStreamPageModule {}
