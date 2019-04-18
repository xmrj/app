import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SampleTransferPage } from './sample-transfer';

@NgModule({
  declarations: [
    SampleTransferPage,
  ],
  imports: [
    IonicPageModule.forChild(SampleTransferPage),
  ],
})
export class SampleTransferPageModule {}
