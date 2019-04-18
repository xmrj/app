import { NgModule } from '@angular/core';
import { ActionsheetComponent } from './actionsheet/actionsheet';

import { BrowserModule } from '@angular/platform-browser';

@NgModule({
	declarations: [ActionsheetComponent],
	imports: [BrowserModule],
	exports: [ActionsheetComponent]
})
export class ComponentsModule {}
