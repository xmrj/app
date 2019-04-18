import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

 
/**
 * Generated class for the MaptabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-maptabs',
  templateUrl: 'maptabs.html',
})
export class MaptabsPage {
 
  tab1Root = 'OnlinemapPage';
  tab2Root = 'MapPage';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MaptabsPage');
  }

}
