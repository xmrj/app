
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WorkmapProvider } from '../../providers/workmap/workmap';
import { Platform, ActionSheetController } from 'ionic-angular';
import {LocalStorageProvider} from '../../providers/local-storage/local-storage';

/**
 * Generated class for the MapmarkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var BMap;
declare var BMap_Symbol_SHAPE_POINT;
declare var BMAP_NAVIGATION_CONTROL_LARGE;
declare var BMAP_STATUS_SUCCESS;
//declare let appAvailability: any;
@IonicPage()
@Component({
  selector: 'page-mapmark',
  templateUrl: 'mapmark.html',
})
export class MapmarkPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;//地图对象
  public marker: any;//标记
  items = [];//对象数组
  savitems = [];//保存第一次查询的结果
  pointsDataArr = [];//点位数据
  pointString = "";
  title = "";
  point: { lng: string, lat: string } = {
    lng: '',
    lat: ''
  };
  passpoint: { lng: string, lat: string } = {
    lng: '',
    lat: ''
  };
  gender = 0;
  item: any;//对象
  customerName: any;
  detectionPoint = [];//点位
  buttonstate = 0;//按钮状态 0,无按钮操作、1获取当前经纬度2、手动标注
  contacts = "";
  telet = "";
  //点击的点位
  clickpoint: { lng: string, lat: string } = {
    lng: '',
    lat: ''
  };
  //当前位置
  currentlocation: { lng: string, lat: string } = {
    lng: '',
    lat: ''
  };

  constructor(public navCtrl: NavController, public localStorage: LocalStorageProvider, public navParams: NavParams,
    public workmapProvider: WorkmapProvider, public platform: Platform,
    public actionSheetCtrl: ActionSheetController) {
    
  }

  ionViewDidLoad() {
    let that = this;
    this.title = "标题";

    let map = this.map = new BMap.Map(this.mapElement.nativeElement, { enableMapClick: true });//创建地图实例
    map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    map.enableContinuousZoom();//连续缩放效果，默认禁用
    let point = new BMap.Point(116.404, 39.915);//坐标可以通过百度地图坐标拾取器获取
    map.centerAndZoom(point, 16);//设置中心和地图显示级别
    //if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.mobelpoint();
      //setTimeout(obtainmobelpoint(), 5000); //半分钟调用一次
   // } else {
      // window.location.href = "http://news.baidu.com/";
     // 

   // }

    
   
    
    let obje =  this.navParams.get("obje");
    let method = this.navParams.get("method");
    
    if(method=="seemark"){
      this.seemark(obje,that);
    }else if(method=="marklpointdiv"){
       this.gender = 0;
       this.marklpointdiv(obje,that);
    }else if(method=="getponitbytaskid"){
      this.gender = 1;
      this.marklpointdiv(obje,that);
      this.getponitbytaskid(obje);
    }
  }

   mobelpoint() {

    // 添加带有定位的导航控件
    var navigationControl = new BMap.NavigationControl({

      type: BMAP_NAVIGATION_CONTROL_LARGE,
      // 启用显示定位
      enableGeolocation: true
    });
    this.map.addControl(navigationControl);
    var geolocation = new BMap.Geolocation();
    geolocation.enableSDKLocation();

    geolocation.getCurrentPosition(function (r) {
      // 指示浏览器获取高精度的位置，默认为false  

      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
       // var mk = new BMap.Marker(r.point);
        //this.map.addOverlay(mk);
       // map.panTo(r.point);

        this.currentlocation = r.point;

      }
      else {

      }
    }, { enableHighAccuracy: true })
    // 添加定位控件
    var geolocationControl = new BMap.GeolocationControl();
    geolocationControl.addEventListener("locationSuccess", function (e) {
      // 定位成功事件
     /** var address = '';
      address += e.addressComponent.province;
      address += e.addressComponent.city;
      address += e.addressComponent.district;
      address += e.addressComponent.street;
      address += e.addressComponent.streetNumber;*/
      //alert("当前定位地址为：" + address);
    });
    geolocationControl.addEventListener("locationError", function (e) {
      // 定位失败事件
      alert(e.message);
    });
    this.map.addControl(geolocationControl);
  }
  cancel() {//取消操作
    document.getElementById('apDiv1').style.display = "none";
  }
  marklpointdiv(item,that) {

    this.item = item;
    this.customerName = item.customerName;
    document.getElementById('apDiv1').style.display = "block";
    var myCity = new BMap.LocalCity();
    myCity.get(pcpoint);
   function pcpoint(result) {
     var cityName = result.name;
     that.map.setCenter(cityName);

   }
  }
 //标注点位
 markpoint() {

  // 百度地图API功能
  //GPS坐标
  var x = this.point.lng;
  var y = this.point.lat;
  var ggPoint = new BMap.Point(x, y);
  if (this.buttonstate != 0) {
    if (this.gender == 0) {
      // 企业
      // 企业
      this.marker = new BMap.Marker(ggPoint)

      this.map.addOverlay(this.marker);
      this.map.setCenter(ggPoint);

     /** var opts = {
        width: 200,     // 信息窗口宽度
        height: 200,     // 信息窗口高度
        title: this.item.customername, // 信息窗口标题         
      };*/

      this.addClickHandler(this, this.item, this.pointString, this.marker); //开启信息窗口

    } else {

      this.marker = new BMap.Marker(new BMap.Point(ggPoint.lng, ggPoint.lat), {
        // 指定Marker的icon属性为Symbol
        icon: new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
          scale: 1,//图标缩放大小
          fillColor: "orange",//填充颜色
          fillOpacity: 0.8//填充透明zz度
        })
      });
      this.map.addOverlay(this.marker);
      this.map.setCenter(ggPoint);

      

      this.addClickHandler(this, this.item, this.pointString, this.marker); //开启信息窗口

    }
  } else {

    let that = this;
    setTimeout(() => {
      var convertor = new BMap.Convertor();
      var pointArr = [];
      
      var x = that.passpoint.lng;
      var y = that.passpoint.lat;
      var xarr =x.split("-");
      var xd = xarr[0];
      var xf = xarr[1];
      var xm = xarr[2];
      
      var ff:number = parseFloat(xf) + parseFloat((Number(xm) /60).toString());
      var dux = parseFloat((ff/60).toString()) + parseFloat(xd);

      var yarr =y.split("-");
      var yd = yarr[0];
      var yf = yarr[1];
      var ym = yarr[2];
      
      var ff:number = parseFloat(yf) + parseFloat((Number(ym) /60).toString());
      var duy = parseFloat((ff/60).toString()) + parseFloat(yd);

      var ggPoint = new BMap.Point(dux, duy);
      pointArr.push(ggPoint);
      convertor.translate(pointArr, 1, 5, //坐标转换完之后的回调函数
        function (data) {

          if (data.status == 0) {


            if (that.gender == 0) {
              // 企业
              // 企业
              that.marker = new BMap.Marker(data.points[0])

              that.map.addOverlay(that.marker);
              that.map.setCenter(data.points[0]);
              that.point = data.points[0];
            

              that.addClickHandler(that, that.item, that.pointString, that.marker); //开启信息窗口


            } else {

              that.marker = new BMap.Marker(new BMap.Point(data.points[0].lng, data.points[0].lat), {
                // 指定Marker的icon属性为Symbol
                icon: new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
                  scale: 1,//图标缩放大小
                  fillColor: "orange",//填充颜色
                  fillOpacity: 0.8//填充透明zz度
                })
              });
              that.map.addOverlay(that.marker);
              that.map.setCenter(data.points[0]);
              that.point = data.points[0];

              that.addClickHandler(that, that.item, that.pointString, that.marker); //开启信息窗口

            }

          }
        }
      )
    }, 1000);
  }
  document.getElementById('apDiv1').style.display = "none";
  this.savemark();

}
savemark() {//保存坐标

  var data: any;
  if (this.gender == 0) {
    data = {'taskid': this.item.id ,'customerid': this.item.customerId ,'pointname': this.pointString ,'testAgreementId':this.item.testAgreementId,'userid':'08327b84d3e74870b5b1ffe670ba4ef8','lng': this.point.lng ,'lat': this.point.lat ,'type':'0','createBy':'08327b84d3e74870b5b1ffe670ba4ef8','updateBy':'08327b84d3e74870b5b1ffe670ba4ef8'};
  } else {
    data = {'taskid': this.item.id  ,'customerid': this.item.customerId ,'pointname': this.pointString ,'testAgreementId': this.item.testAgreementId ,'userid':'08327b84d3e74870b5b1ffe670ba4ef8','lng': this.point.lng ,'lat': this.point.lat,'type':'1','createBy':'08327b84d3e74870b5b1ffe670ba4ef8','updateBy':'08327b84d3e74870b5b1ffe670ba4ef8'};
  }
  this.workmapProvider.saveMark(data).subscribe((resp) => {

    console.log(resp);
    let result: any = resp;
    let data = result.data;

    this.items = data;
  }, (err) => {

  });
  this.reset();
}
seemark(obje,that) {
  document.getElementById('apDiv1').style.display = "none";
 
  this.workmapProvider.seemark(obje).subscribe((resp) => {
   
    that.map.clearOverlays();
    console.log(resp);
    let result: any = resp;
    let data = result.data;
    var pointArray = new Array();
    for (var i = 0; i < data.length; i++) {
      var point = new BMap.Point(data[i].lng, data[i].lat);

      pointArray[i] = point;
      var marker;
      if (data[i].type == 0) {
        marker = new BMap.Marker(point);
      } else {
        marker = new BMap.Marker(point, {
          // 指定Marker的icon属性为Symbol
          icon: new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
            scale: 1,//图标缩放大小
            fillColor: "orange",//填充颜色
            fillOpacity: 0.8//填充透明zz度
          })
        })
      }
      
      that.map.addOverlay(marker);    //增加点
     
      that.addClickHandler(that, obje, data[i].pointname, marker);

    }
    //让所有点在视野范围内

    that.map.setViewport(pointArray);


  }, (err) => {

  });
 
}

addClickHandler(that, content, title, marker) {

  marker.addEventListener("click", function (e) {
    // openInfo(content, e)
    document.getElementById('apDiv2').style.display = "block";
    that.contacts = content.contactPersonName;
    that.telet = content.contactTel;
    that.title = title;
    var p = e.target;
    that.clickpoint = p.getPosition();

  }
  );
}

 


getponitbytaskid(obje) {

  this.workmapProvider.fidpointbytaskid(obje.id).subscribe((resp) => {


    console.log(resp);
    let result: any = resp;
    let data = result.data;

    this.pointsDataArr = data;



  }, (err) => {

  });
}

//获取当前位置
getcurrentpoint() {
  document.getElementById('shouchi').style.display = "none";
  document.getElementById('baiduzuobiao').style.display = "block";
  this.buttonstate = 1;
  var geolocation = new BMap.Geolocation();
  geolocation.enableSDKLocation();
  let letmap = this;
  geolocation.getCurrentPosition(function (r) {
    // 指示浏览器获取高精度的位置，默认为false  

    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
     // var mk = new BMap.Marker(r.point);
      letmap.point = r.point;

    }
    else {

    }
  }, { enableHighAccuracy: true })
}
selfpoint() {
  document.getElementById('shouchi').style.display = "none";
  document.getElementById('baiduzuobiao').style.display = "block";
  let that = this;
  this.buttonstate = 2;
  this.map.addEventListener("longpress", showInfo);
  let thatMap = this.map;
  function showInfo(e) {
    thatMap.clearOverlays();

    that.point = e.point;
    document.getElementById('apDiv1').style.display = "block";
  }
  document.getElementById('apDiv1').style.display = "none";
}


shouchipoint(){
  this.point.lat="";
  this.point.lng="";
  document.getElementById('shouchi').style.display = "block";
  document.getElementById('baiduzuobiao').style.display = "none";
  this.buttonstate = 0;
}


// 百度地图   点击时打开
openBaiduMap() {

  let url = 'origin=&destination=' + this.clickpoint.lat + ',' + this.clickpoint.lng + '&mode=driving';
  //let url='origin=39.98871,116.43234&destination=40.057406655722,116.2964407172&mode=riding';
  window.location.href = 'bdapp://map/direction?' + url;
  /**appAvailability.check(
     'com.baidu.BaiduMap',
     function() {  // 已下载
       //device.platform === 'iOS'?
        // window.location.href = 'baidumap://map/direction?origin=latlng:116.291226,39.965221|name:世纪城&destination=latlng:39.9761,116.3282|name:钓点位置':
         window.location.href = 'bdapp://map/direction?&origin=latlng:116.291226,39.965221|name:世纪城&destination=latlng:39.9761,116.3282|name:钓点位置'
     },
     function() { // 未下载
       // 打开浏览器
       window.open(" http://api.map.baidu.com/direction?origin=latlng:34.264642646862,108.95108518068|name:当前位置&destination=latlng:39.9761,116.3282|name:钓点位置&mode=driving&region=西安&output=html&src=yourCompanyName|yourAppName");
     }
   );**/
}
reset() {
  this.buttonstate = 0;
  this.pointString = "";
  this.map.removeEventListener("longpress", showInfo);
  this.point.lat = "";
  this.point.lng = "";
  let that = this;
  function showInfo(e) {
    that.map.clearOverlays();
    that.point = e.point;
    document.getElementById('apDiv1').style.display = "block";
  }
}
 ////关闭底部窗口
 closeinfowindow() {
  document.getElementById('apDiv2').style.display = "none";
 
}

itemSelected(obje){
  this.navCtrl.push('MapcarPage',{imei:obje.imei});
}
}
