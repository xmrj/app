import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MaptabsPage } from './maptabs';

@NgModule({
  declarations: [
    MaptabsPage,
  ],
  imports: [
    IonicPageModule.forChild(MaptabsPage),
  ],
})
export class MaptabsPageModule {}
