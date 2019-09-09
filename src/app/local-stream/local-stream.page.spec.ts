import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalStreamPage } from './local-stream.page';

describe('LocalStreamPage', () => {
	let component: LocalStreamPage;
	let fixture: ComponentFixture<LocalStreamPage>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [
					LocalStreamPage,
				],
				schemas: [
					CUSTOM_ELEMENTS_SCHEMA,
				],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(LocalStreamPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
