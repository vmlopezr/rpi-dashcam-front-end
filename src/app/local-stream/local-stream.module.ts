import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LocalStreamPage } from './local-stream.page';
import { InputRowComponent } from './components/input-row.component';

const routes: Routes = [
	{
		path: '',
		component: LocalStreamPage,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
	declarations: [
		LocalStreamPage,
		InputRowComponent,
	],
	entryComponents: [
		InputRowComponent,
	],
})
export class LocalStreamPageModule {}
