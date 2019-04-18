import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController,Events } from 'ionic-angular';
import { SignaturePad  } from 'angular2-signaturepad/signature-pad';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
//import { File } from '@ionic-native/file';
import { ImageServiceProvider } from '../../providers/image-service/image-service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';


/**
 * Generated class for the SignaturePadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signature-pad',
  templateUrl: 'signature-pad.html',
})
export class SignaturePadPage {

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  signatureImage: string;   //定义类型

  fileTransfer: FileTransferObject = this.transfer.create();

  procInsId:string;
  taskDefKey:string;
  flowFlag:string;


   // passed through to szimek/signature_pad constructor

  private signaturePadOptions: Object = { 
    'minWidth': 1,
    'maxWidth':3,
    'velocityFilterWeight':1,
    'canvasWidth': 500,
    'canvasHeight': 200,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private transfer: FileTransfer, 
    //private file: File,
    private imageService:ImageServiceProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,    
    private events:Events,
    private screenOrientation: ScreenOrientation
  ) {
    this.procInsId = navParams.get('procInsId');
    this.taskDefKey = navParams.get('taskDefKey');
    this.flowFlag = navParams.get('flowFlag'); 
    console.log('constructor SignaturePadPage');   
  }

  canvasResize() {
 
    let canvas = document.querySelector('canvas');
    let ratio =  Math.max(window.devicePixelRatio || 1, 1);   
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
    this.signaturePad.set('velocityFilterWeight',1);
  }

  ngAfterViewInit() {
    //横屏显示
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    setTimeout(() => {
      this.canvasResize();
     }, 2000);

  }

   // 关闭返回首页
   drawCancel() {

   }

    // 清除模板
    drawClear() {
        this.signaturePad.clear();
        this.signatureImage = '';
    }


    drawComplete() {
      this.signatureImage = this.signaturePad.toDataURL();
      console.log(this.signatureImage); 
      //this.upload();
    }

    // full example
    upload() {
      if(typeof(this.signatureImage) == "undefined"||this.signatureImage.length==0){
        let alertPop = this.alertCtrl.create({
          title: '提示信息',
          subTitle: '请签名后提交!',
          buttons: [{text: 'OK',role: 'cancel'}],
          enableBackdropDismiss:false
        });
        alertPop.present();
      } else {
      
      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: 'name.jpg',
        headers: {},
        // 如果要传参数，写这里
        params: {
          maxSize: 5000000,
          modularName: 'CNL',
          allowType: 'jpg;png;pdf;doc;xls;xlsx;docx',
        }
      }

      let params ={
        base64ImgStr:this.signatureImage,
        'procInsId' : this.procInsId,
        'taskDefKey':this.taskDefKey,
        flowFlag:this.flowFlag
      };

      this.imageService.upload(params,"appr/limsBApproveManage/uploadSignature").subscribe((res:any)=>{

        let toast = this.toastCtrl.create({
          message: '签名上传成功!',
          duration: 2000,
          position:'middle'
        });
        toast.present();  
  
        this.navCtrl.pop().then(() => {
          // 发布 bevents事件
          this.events.publish(this.flowFlag, 'OK');
        });
        // 恢复屏幕
        this.screenOrientation.unlock();

        console.log('upload success', res);
      }, err => {
         console.error('ERROR upload signature', err);
       });
      }

      // this.fileTransfer.upload('123456', 'http://192.168.1.117:18080/LIMS/m/appr/limsBApproveManage/uploadSignature', options)
      // .then((data) => {
      //   console.log( "upload success");
      // }, (err) => {
      //    console.log("upload failed");
      // })
    }
 
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignaturePadPage');
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter SignaturePadPage');
  }

  ionViewWillLeave(){
    this.screenOrientation.unlock();
  }

}
