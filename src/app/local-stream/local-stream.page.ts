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
	dir_data: string[];
	storageDirectory: string = '';
	inputRowValue = [
		'number1',
		'number3',
		'number4',
	];
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
	onDelete (_event) {
		const index = this.dir_data.indexOf(_event, 0);

		this.dir_data.splice(index, 1);

		console.log(_event);
	}
	getDirs () {
		this.http.get('http://localhost:8080/rest/info/dir').subscribe((res) => {
			localStorage.setItem('dir_data', JSON.stringify(res['data']));
			this.dir_data = res['data'];
			//console.log(this.dir_data);
		});
	}
	trackByFn (index, item) {
		return index;
	}
}
export { LocalStreamPage };
