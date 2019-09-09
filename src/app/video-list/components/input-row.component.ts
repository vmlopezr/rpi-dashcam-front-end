import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-input-row',
	templateUrl: './input-row.component.html',
	styleUrls: [
		'./input-row.component.scss',
	],
})
export class InputRowComponent implements OnInit {
	@Input() data: string;

	@Output() onDelete = new EventEmitter<any>();
	constructor (private http: HttpClient) {}

	ngOnInit () {
		// this.data = new Date().getTime().toString();
	}

	deleteClicked () {
		console.log('deleteClicked');
		this.onDelete.next(this.data);
	}
	changeVideo () {
		console.log(this.data);
		this.http
			.post('http://localhost:8080/rest/video/newvid', { title: this.data })
			.subscribe((res) => {
				console.log('res:', res);
			});
	}
}
export class InputRow {}
