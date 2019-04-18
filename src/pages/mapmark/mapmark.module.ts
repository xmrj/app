import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapmarkPage } from './mapmark';

@NgModule({
  declarations: [
    MapmarkPage,
  ],
  imports: [
    IonicPageModule.forChild(MapmarkPage),
  ],
})
export class MapmarkPageModule {}
