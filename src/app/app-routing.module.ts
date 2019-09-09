import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{
		path: 'home',
		loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
	},
	{ path: 'video-list', loadChildren: './video-list/video-list.module#VideoListPageModule' },
	{ path: 'live-stream', loadChildren: './live-stream/live-stream.module#LiveStreamPageModule' },
	{
		path: 'local-stream',
		loadChildren: './local-stream/local-stream.module#LocalStreamPageModule',
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
	],
	exports: [
		RouterModule,
	],
})
export class AppRoutingModule {}
