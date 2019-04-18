import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
//import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FileTransfer,  FileTransferObject } from '@ionic-native/file-transfer';
import { Platform,AlertController} from 'ionic-angular';
import {InAppBrowser} from '@ionic-native/in-app-browser';

/*
  Generated class for the NativeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NativeServiceProvider {

  constructor(public http: HttpClient,
    private platform: Platform,
    public  alertCtrl:AlertController,
    //private loadingCtrl: LoadingController,
    private file: File,
    private appVersion: AppVersion,
    private fileOpener: FileOpener,
    private fileTransfer: FileTransfer,
    private inAppBrowser: InAppBrowser
  ) {
    console.log('Hello NativeServiceProvider Provider');
  }

  detectionUpgrade(apkUrl, allowChoose) {

    if (allowChoose) {
        const confirm = this.alertCtrl.create({
          title: '版本升级',
          message: '发现新版本,是否立即升级?',
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
                this.downloadApp(apkUrl);
              }
            }
          ]
        });
        confirm.present();
    } else {  
        this.downloadApp(apkUrl);  
    }  
  }  

 
  downloadApp(apkUrl) {  
    if (this.isAndroid()) {
      let alert = this.alertCtrl.create({  
          title: '下载进度：0%',  
          enableBackdropDismiss: false,  
          buttons: ['后台下载']  
      });   
      alert.present();  
        
      const fileTransferObject: FileTransferObject = this.fileTransfer.create();  
      const apk = this.file.externalDataDirectory + 'limsAppr.apk'; //apk保存的目录  
      fileTransferObject.download(apkUrl, apk).then((entry) => {  
          this.fileOpener.open(apk, 'application/vnd.android.package-archive').then(() =>{  
              console.log('File is opened')  
          }).catch(e => {  
              console.log('Error openening file', e)  
          });  
      }, (error) => {
        // handle error
        console.log('download error');
        alert.dismiss();
      }
    );  
      fileTransferObject.onProgress((event: ProgressEvent) => {  
          let num = Math.floor(event.loaded / event.total * 100);  
          if (num === 100) {  
              alert.dismiss();  
          } else {  
              let title = document.getElementsByClassName('alert-title')[0];  
              title && (title.innerHTML = '下载进度：' + num + '%');  
          }  
      });  
    }

    if (this.isIos()) {
      this.openUrlByBrowser("这里边填写下载iOS地址");
    }

  }  

    /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url:string):void {
    this.inAppBrowser.create(url, '_system');
  }

  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   * @returns {Promise<string>}
   */
  getVersionNumber(): Promise<string> {
    return new Promise((resolve) => {
      this.appVersion.getVersionNumber().then((value: string) => {
        resolve(value);
      }).catch(err => {
        console.log('getVersionNumber:' + err);
      });
    });
  }
  
}
