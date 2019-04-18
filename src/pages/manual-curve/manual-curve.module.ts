import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManualCurvePage } from './manual-curve';

@NgModule({
  declarations: [
    ManualCurvePage,
  ],
  imports: [
    IonicPageModule.forChild(ManualCurvePage),
  ],
})
export class ManualCurvePageModule {}
