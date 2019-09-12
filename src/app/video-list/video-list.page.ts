import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-video-list',
	templateUrl: './video-list.page.html',
	styleUrls: [
		'./video-list.page.scss',
	],
})
export class VideoListPage implements OnInit {
	dir_data: string[];
	storageDirectory: string = '';

	constructor (private http: HttpClient) {
		const cache = localStorage.getItem('dir_data');
		if (cache) {
			this.dir_data = JSON.parse(cache);
		}
	}
	ngOnInit () {
		this.getDirs();
	}
	addRow () {
		this.dir_data.push('new');
	}
	getDirs () {
		this.http.get('http://localhost:50000/rest/info/dir').subscribe((res) => {
			localStorage.setItem('dir_data', JSON.stringify(res['data']));
			this.dir_data = res['data'];
			//console.log(this.dir_data);
		});
	}
	trackByFn (index, item) {
		return index;
	}
}
