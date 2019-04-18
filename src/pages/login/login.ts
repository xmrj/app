import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController,Platform, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { User,Settings,Api } from '../../providers';
import { MainPage } from '../';
import {LocalStorageProvider} from '../../providers/local-storage/local-storage';
import { JPush } from '@jiguang-ionic/jpush';
//import { File } from '@ionic-native/file';
//import { FileOpener } from '@ionic-native/file-opener';
//import { Transfer, TransferObject } from '@ionic-native/transfer';
import { AppVersion } from '@ionic-native/app-version';
import { NativeServiceProvider } from '../../providers/native-service/native-service';
import { AppUpdateServiceProvider } from '../../providers/app-update-service/app-update-service'; 



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  // 极光注册号
  public registrationId: string;
  //private fileTransfer: TransferObject;
  submitted = false;

  account: { username: string, password: string } = {
    username: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    platform: Platform, 
    public user: User,
    public storage: Storage,
    public api: Api,
    public localStorage: LocalStorageProvider,
    public settings:Settings,
    public toastCtrl: ToastController,
    public alertCtrl:AlertController,
    public appVersion:AppVersion,
    private nativeService :NativeServiceProvider,
    private appUpdateService :AppUpdateServiceProvider,
    //private loadingCtrl: LoadingController,
    public jpush: JPush,
    //private file: File,
    //private fileOpener: FileOpener,
    //private transfer: Transfer,
    public translateService: TranslateService) {
      this.getUsername();
      this.getPassword();
      this.translateService.get('LOGIN_ERROR').subscribe((value) => {
        this.loginErrorString = value;
      });

      if (platform.is('ios')||platform.is('android')) {
        this.getRegistrationID();
      }

      if(this.account.username&&this.account.password){
        let form: NgForm;
        //form.valid = true;
        this.doLogin(form);
      }
 
  }

  checkUpdate(){

  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: '版本升级',
      message: '发现最新版本为是否更新?',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '升级',
          handler: () => {
            console.log('Agree clicked');
            //this.loadAPP();
          }
        }
      ]
    });
    confirm.present();
  }

  // 下载app
  // private loadAPP(url:string){
  //   let loading = this.loadingCtrl.create({
  //       spinner: 'ios',
  //       content: '安装包正在下载...',
  //       dismissOnPageChange: false
  //   });
  //   loading.present();
  //   // 下载 
  //   this.fileTransfer.download(url, "apk").then((entry) => {
  //     loading.dismiss();
  //     this.fileOpener.open("apk",'application/vnd.android.package-archive').then(()=>{});
  //   }, (error) => {
  //     // handle error
  //     console.log('download error');
  //     loading.dismiss();
  //   });
  //   // 进度
  //   this.fileTransfer.onProgress((event) => {
  //     //进度，这里使用文字显示下载百分比
  //     var downloadProgress = (event.loaded / event.total) * 100;
  //     loading.setContent("已经下载：" + Math.floor(downloadProgress) + "%");
  //     if (downloadProgress > 99) {
  //         loading.dismiss();
  //     }
  //   });
  // }

  getRegistrationID() {
    this.jpush.getRegistrationID()
      .then(rId => {
        this.registrationId = rId;
      });
  }

  // Attempt to login in through our User service
  doLogin(form: NgForm) {
    this.submitted = true;
    let loginSuccess:boolean = false;
    if (form.valid) {
      this.user.login(this.account,this.registrationId).subscribe((resp) => {
            let result:any = resp;
            console.log(resp);
            
            if(result.status == '1'){          
              window.localStorage.setItem('mobileSessionId',result.mobileSessionId);
              window.localStorage.setItem('userId',result.userId);
              window.localStorage.setItem('username',result.username);  
              window.localStorage.setItem('loginName',result.loginName);  
              window.localStorage.setItem('status',result.status);

              localStorage.setItem('username',result.username);
              localStorage.setItem('userId',result.userId); 
              localStorage.setItem("pwd",this.account.password);
              localStorage.setItem('loginName',result.loginName); 
              loginSuccess = true;
              //判断服务地址是否为空 add by jiady  2018/09/07
              if(localStorage.getItem("serverIP")==null||localStorage.getItem("serverIP")=='null'){
                localStorage.setItem("serverIP","47.94.236.108:18080")
              }
              this.navCtrl.push(MainPage);
        } else if(result.status == '0') {
          
          const alert = this.alertCtrl.create({
            title: '登录失败!',
            subTitle: result.message,
            buttons: ['OK']
          });
          alert.present();

        }
      }, (err) => {
        //this.navCtrl.push(MainPage);
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });

    }
  }


  toConfig() {
    let that = this;
    let prompt = this.alertCtrl.create({
      title: '设置服务器地址',
    //message: "请输入服务器地址",
      inputs: [
        {
          name: 'serverIP',
          placeholder: 'IP地址'
        },
        {
          name: 'portNO',
          placeholder: '端口号'
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: data => {
            console.log('serverIP',data.serverIP);
            if(this.validIP(data.serverIP)){
              window.localStorage.setItem("serverIP",data.serverIP+":"+data.portNO);
              // add by wangjunli 20180528 同步更新所连接的服务器的IP及端口
              that.api.updateAPI_URL();
            }else{
                return false;
            }
          }
        }
      ]
    });
    prompt.present();
  }

  validIP(ipStr:string):boolean{
    // if(ipStr.indexOf('.')<0){
    //   return false;
    // }else 
    // if(ipStr.indexOf(':')<0){
    //   return false;
    // }else 
    if(ipStr.length>25){
      return false;
    }
    return true;
     
  }

  getUsername() {
    this.user.getUsername().then((username) => {
      this.account.username = username;
    });
  }

  getPassword() {
    this.user.getPassword().then((password) => {
      this.account.password = password;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DelayApplyPage');
    
    this.isUpdate();
    let loginSuccess:boolean = false;
    this.account.username= localStorage.getItem("username");
    this.account.password=localStorage.getItem("pwd");
    if(this.account.username&&this.account.password){ 
          this.user.login(this.account,this.registrationId).subscribe((resp) => {
              let result:any = resp;           
              console.log(resp);
                    
          if(result.status == '1'){     
                this.navCtrl.push(MainPage);
          } else if(result.status == '0') {       
            const alert = this.alertCtrl.create({
              title: '登录失败!',
              subTitle: '账号或密码错误，登录失败',
              buttons: ['OK']
            });
            alert.present();

          }
        }, (err) => {
          //this.navCtrl.push(MainPage);
          // Unable to log in
          let toast = this.toastCtrl.create({
            message: this.loginErrorString,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        });
    }
  }

  ionViewDidEnter(){
  }

  isUpdate(){
      // 登录成功后，检查版本
      this.appVersion.getVersionCode().then((versionCode: string) => {  
        this.appUpdateService.getLastestVersion().subscribe(data => {
            if(data.appCode!=null&&parseInt(data.appCode)>parseInt(versionCode)){            
              this.nativeService.detectionUpgrade(data.appDownloadAddress, true); //提示升级 
            } 
        });  
      }).catch(err => {
          console.log('getVersionNumber:' + err);  
      }); 

  }


}
