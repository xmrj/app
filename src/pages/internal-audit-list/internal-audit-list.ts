import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {WorksProvider} from '../../providers/works/works';

/**
 * Generated class for the InternalAuditListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-internal-audit-list',
  templateUrl: 'internal-audit-list.html',
})
export class InternalAuditListPage {
  currentItems =[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public worksProvider: WorksProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InternalAuditListPage');
    

  }
  ionViewWillEnter(){
    this.findList();
  }
  addItem(){
    this.navCtrl.push("InternalAuditCreatePage");
  }

  findList(){
    this.worksProvider.findList().subscribe((res)=>{
        let result :any=res;
        this.currentItems=result.data;
    }, (err) => {

    });
  }

  deleteItem(item){
    let data={'id':item.id}
    this.worksProvider.delete(data).subscribe((res)=>{
    
      this.findList();
  }, (err) => {

  });
  }

  openItem(item){
this.navCtrl.push('InternalAuditCreatePage',{'item':item});
  }
}
