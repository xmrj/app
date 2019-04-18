import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WorkmapProvider } from '../../providers/workmap/workmap';
import { Platform, ActionSheetController } from 'ionic-angular';
import {LocalStorageProvider} from '../../providers/local-storage/local-storage';
import {OnlinemapProvider} from '../../providers/onlinemap/onlinemap'

/**
 * Generated class for the OnlinemapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var BMap;

@IonicPage()
@Component({
  selector: 'page-onlinemap',
  templateUrl: 'onlinemap.html',
})
export class OnlinemapPage {

  @ViewChild('onlinemap') mapElement: ElementRef;
  map: any;//地图对象
  public marker: any;//标记

  //通讯时间
  txsj="";
  //定位
  dingwei="";
  //地址
  dizhi="";
 //状态
 state="";
 //设备
 imei="";
 allcar="";
 carno="";
  constructor(public navCtrl: NavController, public localStorage: LocalStorageProvider, public navParams: NavParams,
    public workmapProvider: WorkmapProvider, public platform: Platform,
    public onlinemapProvider:OnlinemapProvider, public actionSheetCtrl: ActionSheetController) {
  }
  
  ionViewDidLoad() {
  

    let map = this.map = new BMap.Map(this.mapElement.nativeElement, { enableMapClick: true });//创建地图实例
    map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    map.enableContinuousZoom();//连续缩放效果，默认禁用
    let point = new BMap.Point(116.404, 39.915);//坐标可以通过百度地图坐标拾取器获取
    map.centerAndZoom(point, 16);//设置中心和地图显示级别

 
    /****************在线车辆********************** */
   
    this.findallcar();
  }
  

  ////关闭底部窗口
  closeinfowindow() {
    document.getElementById('apDiv3').style.display = "none";
  }


/******************************************在线地图接口**************************************************** */
access_token(){

  this.workmapProvider.access_token().subscribe((resp) => {

    console.log(resp);
   
    let result: any = resp;
    let access_token = result.access_token;
    localStorage.setItem("access_token",access_token);
    this.map.clearOverlays();
   
    setTimeout(() => {
      this.cheliang();
    }, 100);
    
  setTimeout(() => {
    this.zxcl();
  }, 20000);
  }, (err) => {

  });
}

 cheliang(){
  let access_token= localStorage.getItem("access_token");
  let url="access_token="+encodeURIComponent(access_token);
  url+="&map_type="+encodeURIComponent("BAIDU");
  url+="&target="+encodeURIComponent("化验室");     //要监控的账户(获取token时使用的经销商账户或者其子账户)
  url+="&account="+encodeURIComponent("化验室");    //您申请appkey时所用的汽车在线的登录账号
  url+="&time="+encodeURIComponent(this.unxtime()+"");
  this.onlinemapProvider.monitor(url).subscribe((success) => {
    let zxqc: any = success;
    let data=zxqc.data;
    var pointArray = new Array();
    for(let i=0;i<data.length;i++){
      let obje=data[i];
 
      let point = new BMap.Point(obje.lng, obje.lat);
      pointArray[i] = point;
     // var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/fox.gif", new BMap.Size(300,157));
     var myIcon ="";
     if(obje.device_info_new==4){
      myIcon = new BMap.Icon("assets/imgs/lcar.png", new BMap.Size(30,27));
     }else{
      myIcon = new BMap.Icon("assets/imgs/green_ne_1.png", new BMap.Size(30,27));
     }
     for(let i=0;i<this.allcar.length;i++){
       
      let car:any=this.allcar[i];
     if(car.imei==obje.imei){
        this.carno=car.carno
        break;
     }
   } 
   
     let marker = new BMap.Marker(point,{icon:myIcon});
     marker.setRotation(obje.course-90);
     this.map.addOverlay(marker);    //增加点
     var label = new BMap.Label(this.carno,{offset:new BMap.Size(0,-30)});
     label.setStyle({border:"1px solid rgb(204, 204, 204)",color: "rgb(0, 0, 0)",borderRadius:"10px",padding:"5px",background:"rgb(255, 255, 255)",});
     marker.setLabel(label);
     this.addClickqiche( obje,point, marker);
    }
    
    this.map.setViewport(pointArray);
    console.log(success);
    
  }, (err) => {

  }); 
 }

unxtime(){
  // 参数为空时
var stdStrTime = new Date()+"";
console.log(stdStrTime);
var mTime = Date.parse(stdStrTime);
return mTime;
}
zxcl(){
  
  this.map.clearOverlays();
  let access_token= localStorage.getItem("access_token");
  let url="access_token="+encodeURIComponent(access_token);
  url+="&map_type="+encodeURIComponent("BAIDU");
  url+="&target="+encodeURIComponent("化验室");     //要监控的账户(获取token时使用的经销商账户或者其子账户)
  url+="&account="+encodeURIComponent("化验室");    //您申请appkey时所用的汽车在线的登录账号
  url+="&time="+encodeURIComponent(this.unxtime()+"");
  this.onlinemapProvider.monitor(url).subscribe((success) => {
    let zxqc: any = success;
    let data=zxqc.data;
    var pointArray = new Array();
    for(var i=0;i<data.length;i++){
      let obje=data[i];
 
      for(let i=0;i<this.allcar.length;i++){
        
      let car:any=this.allcar[i];
      if(car.imei==obje.imei){
        this.carno=car.carno
        break;
      }
      } 
      let point = new BMap.Point(obje.lng, obje.lat);
      pointArray[i] = point;
     // var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/fox.gif", new BMap.Size(300,157));
     var myIcon ="";
     if(obje.device_info_new==4){
      myIcon = new BMap.Icon("assets/imgs/lcar.png", new BMap.Size(30,27));
     }else{
      myIcon = new BMap.Icon("assets/imgs/green_ne_1.png", new BMap.Size(30,27));
     }
     let marker = new BMap.Marker(point,{icon:myIcon});
      marker.setRotation(obje.course-90);
      var label = new BMap.Label(this.carno,{offset:new BMap.Size(0,-30)});
      label.setStyle({border:"1px solid rgb(204, 204, 204)",color: "rgb(0, 0, 0)",borderRadius:"10px",padding:"5px",background:"rgb(255, 255, 255)",});
      marker.setLabel(label);
     this.map.addOverlay(marker);    //增加点
     this.addClickqiche( obje,point, marker);
    }
    
    console.log(success);
  }, (err) => {

  });
   
  setTimeout(() => {
    this.zxcl();
  }, 20000);
}
addClickqiche( obje,point, marker) {
 
  let that=this;
  let access_token= localStorage.getItem("access_token");
  marker.addEventListener("click", function (e) {
   for(var i=0;i<that.allcar.length;i++){
      let car:any=that.allcar[i];
     if(car.imei==obje.imei){
        that.carno=car.carno
        break;
     }
   } 
    document.getElementById('apDiv3').style.display = "block";
   
    that.txsj =that.formatTime(obje.gps_time) ;
    if(obje.device_info_new==4){
        that.state="静止"+"时长"+that.secondsFormat(obje.seconds);
    }else{
      that.state="时速"+obje.speed;
    }
    that.imei=obje.imei;

    var label = new BMap.Label(that.carno,{offset:new BMap.Size(0,-30)});
    label.setStyle({border:"1px solid rgb(204, 204, 204)",color: "rgb(0, 0, 0)",borderRadius:"10px",padding:"5px",background:"rgb(255, 255, 255)",});
    marker.setLabel(label);
   // var address = '';
    //获取详细地址
    let url="lng="+encodeURIComponent(point.lng);
        url+="&lat="+encodeURIComponent(point.lat);
        url+="&access_token="+encodeURIComponent(access_token);
        url+="&account="+encodeURIComponent("化验室");    //您申请appkey时所用的汽车在线的登录账号
        url+="&map_type="+encodeURIComponent("BAIDU");
        url+="&time="+encodeURIComponent(that.unxtime()+"");
        that.onlinemapProvider.address(url).subscribe((resp) => {
          let data: any = resp;
         // let arrayaddress= [];
          that.dizhi =data.address;
       }, (err) => {

    });
      

  }
  );
}

findallcar(){
  this.workmapProvider.findallcar().subscribe((resp) => {
    let data: any = resp;
    this.allcar=data.data;
    this.access_token();
 }, (err) => {

});
}

formatTime (time) {
  let unixtime = time
  let unixTimestamp = new Date(unixtime * 1000)
  let Y = unixTimestamp.getFullYear()
  let M = ((unixTimestamp.getMonth() + 1) > 10 ? (unixTimestamp.getMonth() + 1) : '0' + (unixTimestamp.getMonth() + 1))
  let D = (unixTimestamp.getDate() > 10 ? unixTimestamp.getDate() : '0' + unixTimestamp.getDate())
  let toDay = Y + '-' + M + '-' + D
  return toDay
}
/* 
*@param s : 时间秒 
*/ 
 secondsFormat( s ) { 
  var day = Math.floor( s/ (24*3600) ); // Math.floor()向下取整 
  var hour = Math.floor( (s - day*24*3600) / 3600); 
  var minute = Math.floor( (s - day*24*3600 - hour*3600) /60 ); 
  var second = s - day*24*3600 - hour*3600 - minute*60; 
  return day +"天" + hour + " 时 " + minute + " 分 " + second + " 秒 "; 
  }

  playbackbutton(){
    this.navCtrl.push('PlaybackPage',{
      imei : this.imei,
      'carno':this.carno
  });
  }
}
