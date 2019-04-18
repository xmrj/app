import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { ConferenceData } from '../../providers/conference-data';
import {ApprovalServiceProvider} from '../../providers/approval-service/approval-service';

/**
 * Generated class for the ApprovalFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-approval-filter',
  templateUrl: 'approval-filter.html',
})
export class ApprovalFilterPage {

  tracks: Array<{label:string,value: string, isChecked: boolean}> = [];

  constructor(
    public confData:ConferenceData,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public approvalService:ApprovalServiceProvider
  ) {
    let excludedTrackNames = this.navParams.data;

    let flowTypes : any[] = approvalService.getFlowTypes();
    console.log('flowTypes---',flowTypes);

      flowTypes.forEach(flowType => {
        this.tracks.push({
          label: flowType.label,
          value:flowType.value,
          isChecked: (excludedTrackNames.indexOf(flowType.label) === -1)
        });
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApprovalFilterPage');
  }


  resetFilters() {
    // reset all of the toggles to be checked
    this.tracks.forEach(track => {
      track.isChecked = false;
    });
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    let excludedTrackNames = this.tracks.filter(c => !c.isChecked).map(c => c.label);
    this.dismiss(excludedTrackNames);
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }

}
