import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams,AlertController } from 'ionic-angular';

/**
 * Generated class for the TaskFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-task-filter',
  templateUrl: 'task-filter.html',
})
export class TaskFilterPage {
  
  startDate :string;
  endDate:string ;
  flowType:string;

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController, 
  ) {
    // passed in array of track names that should be excluded (unchecked)
    let excludedTrackNames = this.navParams.data;
    this.startDate = this.getDateStr(7);
    this.endDate = this.getNowFormatDate(new Date());
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskFilterPage');
  }

  resetFilters() {
    // reset all of the toggles to be checked
    this.startDate='';//this.getDateStr(7);
    this.endDate='';//this.getNowFormatDate(new Date());
    this.flowType='';
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    if(this.getDays(this.endDate,this.startDate)>30){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '检测结果审核，请在电脑端审核！',
        buttons: ['确定']
      });
      alert.present();
    }

    let filterCond = {'flowType':this.flowType,'startDate':this.startDate,'endDate':this.endDate};
    this.dismiss(filterCond);
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }

   getNowFormatDate(dateParam:Date):any { 
    let date = dateParam;
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let monthStr;
    let strDate = date.getDate();
    let dayStr;
    if (month >= 1 && month <= 9) {
      monthStr = "0" + month;
    }else{
      monthStr = month.toString();
    }
    if (strDate >= 0 && strDate <= 9) {
      dayStr = "0" + strDate;
    }else{
      dayStr = strDate.toString();
    }
    let currentdate = date.getFullYear() + seperator1 + monthStr + seperator1 + dayStr
    return currentdate;
  }

   getDateStr(AddDayCount:number) :any { 
    var nextDate = new Date(); 
    nextDate.setDate(nextDate.getDate()-AddDayCount);//获取AddDayCount天后的日期
    debugger; 
    return this.getNowFormatDate(nextDate);
  }

   getDays(strDateStart,strDateEnd):number{
    let strSeparator = "-"; //日期分隔符
    let oDate1;
    let oDate2;
    let iDays:number;
    oDate1= strDateStart.split(strSeparator);
    oDate2= strDateEnd.split(strSeparator);
    let strDateS = new Date(oDate1[0] + "-" + oDate1[1] + "-" + oDate1[2]);
    let strDateE = new Date(oDate2[0] + "-" + oDate2[1] + "-" + oDate2[2]);
    iDays =Math.abs(strDateE.getTime() - strDateS.getTime() )/1000/60/60/24;//把相差的毫秒数转换为天数 
 
    return iDays ;
 }  

}
