import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorksPage } from './works';

@NgModule({
  declarations: [
    WorksPage,
  ],
  imports: [
    IonicPageModule.forChild(WorksPage),
  ],
})
export class WorksPageModule {}
