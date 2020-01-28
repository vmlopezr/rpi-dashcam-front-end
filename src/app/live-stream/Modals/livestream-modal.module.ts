import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';// The modal's component of the previous chapter
import {LivestreamModal} from './livestream-modal';

@NgModule({
     declarations: [
       LivestreamModal
     ],
     imports: [
       IonicModule,
       CommonModule
     ],
     entryComponents: [
       LivestreamModal
     ]
})
export class LivestreamModalModule {}