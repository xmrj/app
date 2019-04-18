import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {OnlinemapProvider} from '../../providers/onlinemap/onlinemap'
import 'rxjs/add/operator/toPromise';
/**
 * Generated class for the PlaybackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var BMap;
declare var BMapLib;
 
@IonicPage()
@Component({
  selector: 'page-playback',
  templateUrl: 'playback.html',
})
 
export class PlaybackPage {

  @ViewChild('backmap') mapElement: ElementRef;
  playmap: any;//地图对象
  public playmarker: any;//标记
  state = 1;

 one=1;
  imei:any;
  arrPois=[];
  starttime="";
  endtime="";
  carno="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public onlinemapProvider:OnlinemapProvider) {
    this.imei = navParams.get('imei');
    this.carno = navParams.get('carno');

    this.starttime= new Date(new Date().getTime()+7*60*60*1000).toISOString();//开始时间;
    this.endtime= new Date(new Date().getTime()+8*60*60*1000).toISOString();//开始时间;
  }

  ionViewDidLoad() {
    let map = this.playmap = new BMap.Map(this.mapElement.nativeElement, { enableMapClick: true });//创建地图实例
    map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    map.enableContinuousZoom();//连续缩放效果，默认禁用
    let point = new BMap.Point(116.404, 39.915);//坐标可以通过百度地图坐标拾取器获取
    map.centerAndZoom(point, 16);//设置中心和地图显示级别

    
  }
  
  historyluxian() {
    document.getElementById('backtime').style.display = "none";
    let newtime = this.formatunxTime(this.starttime.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''));
    this.historyluxianChild(newtime);
  }

  historyluxianChild(newtime) {
    let startTimeF = newtime;
    let endTimeF = this.formatunxTime(this.endtime.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''));
   

    let access_token = localStorage.getItem("access_token");
    let url = "access_token=" + encodeURIComponent(access_token);
    url += "&map_type=" + encodeURIComponent("BAIDU");
    url += "&account=" + encodeURIComponent("化验室");    //您申请appkey时所用的汽车在线的登录账号
    url += "&imei=" + encodeURIComponent(this.imei);
    url += "&time=" + encodeURIComponent(this.unxtime() + "");
    url += "&begin_time=" + startTimeF;
    url += "&end_time=" + endTimeF;

    this.onlinemapProvider.history(url).toPromise().then((success) => {
      
      let result: any = success;
      let data = result.data;
      if (data.length == 0) {
        if(this.one==1){

        }else{
          this.chelianglushu();
        }
        
        return;
      }

      
      for (var i = 0; i < data.length; i++) {
        let obj = data[i];
        let point = new BMap.Point(obj.lng, obj.lat);
        this.arrPois.push(point);
        newtime = obj.gps_time;
      }
      
      this.one=2;
      this.historyluxianChild(newtime);

    }, (err) => {});
  }



addpoint(){
  var polyline = new BMap.Polyline(this.arrPois);
  this.playmap.addOverlay(polyline);
}
chelianglushu(){
  this.playmap.setViewport(this.arrPois);
 let marker=new BMap.Marker(this.arrPois[0],{
     icon  : new BMap.Icon('http://developer.baidu.com/map/jsdemo/img/car.png', new BMap.Size(52,26),{anchor : new BMap.Size(27, 13)})
  });

var label = new BMap.Label(this.carno,{offset:new BMap.Size(0,-30)});
label.setStyle({border:"1px solid rgb(204, 204, 204)",color: "rgb(0, 0, 0)",borderRadius:"10px",padding:"5px",background:"rgb(255, 255, 255)",});
marker.setLabel(label);

this.playmap.addOverlay(marker);	
var polyline = new BMap.Polyline(this.arrPois);
this.playmap.addOverlay(polyline);

 let lushu = new BMapLib.LuShu(this.playmap,this.arrPois,{
defaultContent:this.carno,//"从天安门到百度大厦"
autoView:true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
icon  : new BMap.Icon('http://developer.baidu.com/map/jsdemo/img/car.png', new BMap.Size(52,26),{anchor : new BMap.Size(27, 13)}),
speed: 450,
enableRotation:true,//是否设置marker随着道路的走向进行旋转
  landmarkPois:[
 
 ]
   
}); 
marker.enableMassClear(); //设置后可以隐藏改点的覆盖物
      marker.hide();
      lushu.start();
      
}

settime(num){ //1、前一小时，2、今天，3、昨天，4、前天
  let time=new Date();
  time.setHours(0);
  time.setMinutes(0);
  if(num==1){
    this.starttime= new Date(new Date().getTime()+7*60*60*1000).toISOString();//开始时间;
    this.endtime= new Date(new Date().getTime()+8*60*60*1000).toISOString();//开始时间;
  }else if(num==2){
    this.starttime= new Date(time.getTime()+8*60*60*1000).toISOString();//开始时间;
    this.endtime= new Date(new Date().getTime()+8*60*60*1000).toISOString();//开始时间;
  }else if(num==3){
    this.starttime= new Date(time.getTime()+(-16)*60*60*1000).toISOString();//开始时间;
    this.endtime= new Date(time.getTime()+(7)*60*60*1000).toISOString();//开始时间;
  }else if(num==4){
    this.starttime= new Date(time.getTime()+(-40)*60*60*1000).toISOString();//开始时间;
    this.endtime= new Date(time.getTime()+(-17)*60*60*1000).toISOString();//开始时间;
  }
  
}

//获取指定时间的unx
formatunxTime (time) {
  time= new Date(time);
  var mTime = Math.round(Date.parse(time)/1000);
  return mTime
}
//获取当前unx时间
unxtime(){
  // 参数为空时
var stdStrTime = new Date()+"";
console.log(stdStrTime);
 var mTime=Math.round(Date.parse(stdStrTime) / 1000)
 
return mTime;
}
}
