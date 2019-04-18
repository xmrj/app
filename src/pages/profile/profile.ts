import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,Platform } from 'ionic-angular';
import { LocalStorageProvider} from '../../providers/local-storage/local-storage';
import { User} from '../../providers/user/user';
import { App} from  'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
// import { TranslateService } from '@ngx-translate/core';
// import { Config, Nav, Platform } from 'ionic-angular';
// import { JPush } from '@jiguang-ionic/jpush';
import { NativeServiceProvider } from '../../providers/native-service/native-service';
import { AppUpdateServiceProvider } from '../../providers/app-update-service/app-update-service'; 
import {SignaturePadPage} from '../signature-pad/signature-pad';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  currentUserName:string='';
  userRealName:string='';
  currentVersionName:string;
  ipStr :string = "47.94.236.108:18080";
  constructor(
    public navCtrl: NavController,
    public localStorage: LocalStorageProvider,
    public alertCtrl:AlertController,
    public navParams: NavParams,
    public app :App,
    platform: Platform, 
    public userData:User,
    private appVersion:AppVersion,
    private appUpdateService:AppUpdateServiceProvider,
    private nativeService:NativeServiceProvider
  ) {
    this.userRealName = localStorage.get("loginName")?localStorage.get("loginName"):'';
    if (platform.is('ios')||platform.is('android')) {
      this.appVersion.getVersionNumber().then(version=>{
        this.currentVersionName = version;
      })
      if(window.localStorage.getItem("serverIP")==null||window.localStorage.getItem("serverIP")=='null'){
        this.ipStr = "47.94.236.108:18080";
      }else{
        this.ipStr = window.localStorage.getItem("serverIP");
      }
      // this.ipStr = window.localStorage.getItem("serverIP")?:"47.94.236.108:18080";
    } else {
      this.ipStr = "47.94.236.108:18080";
    }    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ngAfterViewInit() {
    this.getUsername();
  }

  getUsername() {
    this.userData.getUsername().then((username) => {
      this.currentUserName = username;
    });
  }


  logout() {
    this.userData.logout();
    this.localStorage.remove("username");
    this.localStorage.remove("loginName");
    let ipStr = window.localStorage.getItem("serverIP");
    window.localStorage.clear();
    //判断是否为空 add by jiady 2018/09/07
    if(ipStr !=null&&ipStr!=""&&ipStr!='null'){
      window.localStorage.setItem("serverIP",ipStr);
    }
    
    
	  let confirm = this.alertCtrl.create({
      title: '您确定要退出应用吗?',
      //message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            this.app.getRootNav().push('LoginPage');
            setTimeout(() => {
              this.navCtrl.popToRoot();   
          },1000);
          }
        }
      ]
    });
    confirm.present();
  }

  checkVersion(){
    this.appVersion.getVersionCode().then((version: string) => {
      this.appUpdateService.getLastestVersion().subscribe(data => {
        if(data.appCode!=null&&parseInt(data.appCode)>parseInt(version)){
              this.nativeService.detectionUpgrade(data.appDownloadAddress, true); //提示升级  
        }else if(parseInt(data.appCode)==parseInt(version)){
         this.showAlert();
        }
         
     }); 
    }).catch(err => {
        console.log('getVersionNumber:' + err);  
    }); 
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: '',
      subTitle: '当前版本已是最新版本!',
      buttons: ['OK']
    });
    alert.present();
  }

  signPad(){
    this.navCtrl.push(SignaturePadPage);
  }

}
