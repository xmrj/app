import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, ActionSheetController  } from 'ionic-angular';
import { WorkmapProvider } from '../../providers/workmap/workmap';
import {LocalStorageProvider} from '../../providers/local-storage/local-storage';
//import {OnlinemapProvider} from '../../providers/onlinemap/onlinemap'
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  
 
  items = [];//对象数组
  savitems = [];//保存第一次查询的结果
  pointsDataArr = [];//点位数据
  pointString = "";
  allcar=[];
  constructor(public navCtrl: NavController, public localStorage: LocalStorageProvider, public navParams: NavParams,
    public workmapProvider: WorkmapProvider, public platform: Platform,
    public actionSheetCtrl: ActionSheetController) {
  }
 
  ionViewDidLoad() {
  
   this.initializeItems();  
    this.findallcar()
    
  }
 
  
  presentActionSheet(obje) {
    let actionSheet = this.actionSheetCtrl.create({
      title: '经纬度标注',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: '企业标注',
          role: '0',
          icon: !this.platform.is('ios') ? 'md-ionic' : null,
          handler: () => {
            console.log('Destructive clicked');
           // this.gender = 0;
           // this.marklpointdiv(obje)
           this.navCtrl.push('MapmarkPage',{
             'obje':obje,
             'method':'marklpointdiv'
           });
          }
        }, {
          text: '点位标注',
          icon: !this.platform.is('ios') ? 'md-pin' : null,
          handler: () => {
            console.log('Archive clicked');
           // this.gender = 1;
           // this.marklpointdiv(obje);
           // this.getponitbytaskid(obje);
           this.navCtrl.push('MapmarkPage',{
            'obje':obje,
            'method':'getponitbytaskid'
          });
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  chooseitem(obje) {
    let actionSheet = this.actionSheetCtrl.create({
      title: '功能选择',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: '查看标注',
          role: '0',
          icon: !this.platform.is('ios') ? 'md-eye' : null,
          handler: () => {
            console.log('Destructive clicked');
            //this.seemark(obje)
            this.navCtrl.push('MapmarkPage',{
              'obje':obje,
              'method':'seemark'
            });
          }
        }, {
          text: '位置标注',
          icon: !this.platform.is('ios') ? 'md-pin' : null,
          handler: () => {
            console.log('Archive clicked');

            this.presentActionSheet(obje);
          }
        }, {
          text: '查看车辆',
          icon: !this.platform.is('ios') ? 'car' : null,
          handler: () => {
            console.log('Archive clicked');
             this.showcars(obje);  
            
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  initializeItems() {
   let username = localStorage.getItem('username');
   let mobileSessionId= localStorage.getItem('mobileSessionId');
   let data='{"mobileSessionId":"'+mobileSessionId+'","pageSize":"10000","queryPage":"1","username":"'+username+'"}'
    this.workmapProvider.showdata(data).subscribe((resp) => {

      console.log(resp);
      let result: any = resp;
      let data = result.data;
      this.savitems = data;
      this.items = data;

    }, (err) => {

    });
  }


 //查看车辆
showcars(obje){
  //document.getElementById('carsdiv').style.display = "block";
  // var data: any;
  // data={'carid':obje.cars}
  let imei="";
  if(obje.cars!=null){
  var list=obje.cars.split(",");
  for(var i=0;i<list.length;i++){
    for(var j=0;j<this.allcar.length;j++){
      if(list[i]==this.allcar[j].id){
        imei += this.allcar[j].imei+",";
        break;
      }
    }
  }
  this.navCtrl.push('MapcarPage',{imei:imei});
}
  /**this.workmapProvider.findcars(data).subscribe((resp)=>{
    console.log(resp);
    let result: any = resp;
    let data = result.data;
    this.cars=data;
    let imei="";
    for(var i=0;i<data.length;i++){
        imei += data[i].imei+",";
    }
    this.navCtrl.push('MapcarPage',{imei:imei});
  }, (err) => {
  
    });
    **/
  }
  findallcar(){
    this.workmapProvider.findallcar().subscribe((resp) => {
      let data: any = resp;
      this.allcar=data.data;
       
   }, (err) => {
  
  });
  }
  getItems(ev: any) {
    this.items = this.savitems;
    // set val to the value of the searchbar
    let val = ev.target.value;
  
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.samplingTableName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  

}

