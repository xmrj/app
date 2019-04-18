import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnlinemapPage } from './onlinemap';

@NgModule({
  declarations: [
    OnlinemapPage,
  ],
  imports: [
    IonicPageModule.forChild(OnlinemapPage),
  ],
})
export class OnlinemapPageModule {}
