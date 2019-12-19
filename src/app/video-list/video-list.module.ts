import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VideoListPage } from './video-list.page';
import { InputRowComponent } from './components/input-row.component';

const routes: Routes = [
  {
    path: '',
    component: VideoListPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [VideoListPage, InputRowComponent],
  entryComponents: [InputRowComponent],
})
export class VideoListPageModule {}
