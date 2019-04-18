import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SampleRegisterPage } from './sample-register';

@NgModule({
  declarations: [
    SampleRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(SampleRegisterPage),
  ],
})
export class SampleRegisterPageModule {}
