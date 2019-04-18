import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,AlertController,Events,ToastController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { SignForPcPage } from '../sign-for-pc/sign-for-pc';
import { User} from '../../providers/user/user';

/**
 * Generated class for the QrScannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-scanner',
  templateUrl: 'qr-scanner.html',
})
export class QrScannerPage {
  currentUserName:string='';
  light: boolean;//判断闪光灯
  frontCamera: boolean;//判断摄像头
  isShow: boolean = false;//控制显示背景，避免切换页面卡顿


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,
    private viewCtrl: ViewController,
    public userData:User,
    private qrScanner: QRScanner,
    public toastCtrl: ToastController,
    private events :Events,
  ) {
     //默认为false
     this.light = false;
     this.frontCamera = false;
  }

  ionViewDidLoad() {
    this.getUsername();
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
         
            let userName = text.slice(text.indexOf('userName')+9,text.indexOf('&'));
            let uuid = text.slice(text.indexOf('uuid')+5,text.lastIndexOf('&')); 
            let datetime = text.slice(text.indexOf('time')+5); 
            // 判断用户是否一致
            if(userName!=this.currentUserName){
              this.showAlert('当前二维码对您不可用,请登录自己的账号扫描二维码');
            }else if(!this.validateTime(datetime)){
              // 判断时间超时 10分钟
              this.showAlert('当前二维码超时,请在电脑端重新生成后再扫描');
            } else{           
              this.qrScanner.hide(); // hide camera preview
              scanSub.unsubscribe(); // stop scanning         

              // 签完字后，回调 返回上一页
              this.events.subscribe('signEventOver', (params) => {
                // 接收B页面发布的数据
                if(params=='OK2') {
                  // 取消订阅
                  this.events.unsubscribe('signEventOver'); 
                      
                  let toast = this.toastCtrl.create({
                    message: '签字完成!',
                    duration: 3000,
                    position:'middle'
                  });
                  toast.present();        
                  this.navCtrl.pop();
                } else if(params=='-1'){
                  this.navCtrl.pop();
                }
               })

              this.navCtrl.push(SignForPcPage,{'uuid':uuid});
            }
          });

          // show camera preview
          this.qrScanner.show();

          // wait for user to scan something, then the observable callback will be called
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }
// 判断时间超时 10分钟
  validateTime(serverTime:any){
    
    var d = new Date();
    if((d.getTime()-serverTime)/(1000*60)>10 ) return false;
    else return true;
  }

  showAlert(errMsg:string) {
    const alert = this.alertCtrl.create({
      title: '错误提示!',    
      subTitle: errMsg,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // user has clicked the alert button
            // begin the alert's dismiss transition
            let navTransition = alert.dismiss();
            navTransition.then(() => {
              this.navCtrl.pop();
            });
            return false;
          }
        }],
      enableBackdropDismiss:false
    });
    alert.present();
  }

  ionViewDidEnter(){
    //页面可见时才执行
    this.showCamera();
    this.isShow = true;//显示背景
  }

  sign (){
    this.navCtrl.push(SignForPcPage);
  }

  getUsername() {
    this.userData.getUsername().then((username) => {
      this.currentUserName = username;
    });
  }


  /**
   * 闪光灯控制，默认关闭
   */
  toggleLight() {
    if (this.light) {
      this.qrScanner.disableLight();
    } else {
      this.qrScanner.enableLight();
    }
    this.light = !this.light;
  }

  /**
   * 前后摄像头互换
   */
  toggleCamera() {
    if (this.frontCamera) {
      this.qrScanner.useBackCamera();
    } else {
      this.qrScanner.useFrontCamera();
    }
    this.frontCamera = !this.frontCamera;
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }
  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    this.qrScanner.hide();//需要关闭扫描，否则相机一直开着
  }
 
  ionViewWillLeave() {
    this.hideCamera();
    this.destroyCamera();
  }

  destroyCamera(){
    this.qrScanner.destroy();
  }

}
