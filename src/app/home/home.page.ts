import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: [
		'home.page.scss',
	],
})
export class HomePage implements OnInit {
	data: any = { name: 'poop' };

	userInput: string = '';
	constructor (
		private alertCtrl: AlertController,
		private navCtrl: NavController,
		private http: HttpClient,
	) {}

	ngOnInit () {
		this.http.get('http://localhost:8080/rest/info/file').subscribe((res) => {
			this.data.name = res['data'];
		});
	}

	saveData () {
		this.http
			.post('http://localhost:8080/rest/info/save', { name: this.userInput })
			.subscribe((res) => {
				console.log('res:', res);
			});
		console.log('done...');
	}
	/* 	changeVideo () {
		this.http
			.post('http://localhost:8080/rest/video/newvid', { title: 'Mar23_2019_19-22-31.mp4' })
			.subscribe((res) => {
				console.log('res:', res);
			});
	} */
}
