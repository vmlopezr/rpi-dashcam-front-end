import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-local-stream',
	templateUrl: './local-stream.page.html',
	styleUrls: [
		'./local-stream.page.scss',
	],
})
class LocalStreamPage {
	constructor (private http: HttpClient) {}
	stopVideo () {
		this.http.post('http://localhost:8080/rest/video/stop', {}).subscribe((res) => {
			console.log('res:', res);
		});
	}
}
export { LocalStreamPage };
