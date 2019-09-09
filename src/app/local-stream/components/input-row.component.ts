import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-input-row',
	templateUrl: './input-row.component.html',
})
export class InputRowComponent implements OnInit {
	@Input() data: string;

	@Output() onDelete = new EventEmitter<any>();
	constructor () {}

	ngOnInit () {
		// this.data = new Date().getTime().toString();
	}

	deleteClicked () {
		console.log('deleteClicked');
		this.onDelete.next(this.data);
	}
}
export class InputRow {}
