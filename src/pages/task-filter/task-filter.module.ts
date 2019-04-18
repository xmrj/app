import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskFilterPage } from './task-filter';

@NgModule({
  declarations: [
    TaskFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskFilterPage),
  ],
})
export class TaskFilterPageModule {}
