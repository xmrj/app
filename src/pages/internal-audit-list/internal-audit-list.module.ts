import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InternalAuditListPage } from './internal-audit-list';

@NgModule({
  declarations: [
    InternalAuditListPage,
  ],
  imports: [
    IonicPageModule.forChild(InternalAuditListPage),
  ],
})
export class InternalAuditListPageModule {}
