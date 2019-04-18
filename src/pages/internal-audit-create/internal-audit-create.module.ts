import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InternalAuditCreatePage } from './internal-audit-create';

@NgModule({
  declarations: [
    InternalAuditCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(InternalAuditCreatePage),
  ],
})
export class InternalAuditCreatePageModule {}
