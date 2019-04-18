import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MsgCenterPage } from './msg-center';

@NgModule({
  declarations: [
    MsgCenterPage,
  ],
  imports: [
    IonicPageModule.forChild(MsgCenterPage),
  ],
})
export class MsgCenterPageModule {}
