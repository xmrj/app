import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApprovalFilterPage } from './approval-filter';

@NgModule({
  declarations: [
    ApprovalFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(ApprovalFilterPage),
  ],
})
export class ApprovalFilterPageModule {}

