import { Component, OnInit } from '@angular/core';
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
	constructor (private http: HttpClient) {}

	ngOnInit () {}

	saveData () {
		this.http
			.post('http://localhost:50000/rest/info/save', { name: this.userInput })
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
