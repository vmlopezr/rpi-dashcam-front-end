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
	constructor(private http: HttpClient) { }

	ngOnInit() { }

	saveData(): void {
		this.http
			.post('http://localhost:50000/rest/info/save', { name: this.userInput })
			.subscribe((res) => {
				console.log('res:', res);
			});
		console.log('done...');
	}
}
