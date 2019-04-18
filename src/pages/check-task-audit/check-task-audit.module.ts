import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckTaskAuditPage } from './check-task-audit';

@NgModule({
  declarations: [
    CheckTaskAuditPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckTaskAuditPage),
  ],
})
export class CheckTaskAuditPageModule {}
