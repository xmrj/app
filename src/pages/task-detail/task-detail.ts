import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,AlertController,ToastController,Events } from 'ionic-angular';
import {ApprovalServiceProvider} from '../../providers/approval-service/approval-service';
import {Api} from '../../providers/api/api';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FlowItem } from '../../models/FlowItem';
import {SignaturePadPage} from '../signature-pad/signature-pad';

/**
 * Generated class for the TaskDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html',
  providers: [FileTransfer, FileTransferObject, File,FileOpener]
})
export class TaskDetailPage {
  item: any;
  taskName: string;
  storageDirectory: string = '';
  opinion:string; // 审批意见
  signed:boolean = false;
  taskDefKey:string;
  flowFlag:string = 'lims_b_sampling_task';// 流程标识
  downPdfUrl :string ;
  historicItems:Array<FlowItem>;
  isShowFooter:boolean = true;

  constructor(
    public navCtrl: NavController,
    public approvalService:ApprovalServiceProvider,
    public navParams: NavParams,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,
    public platform: Platform, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public Api: Api,
    private events :Events,
  ) {
    this.platform.ready().then(() => {
      // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
      if(!this.platform.is('cordova')) {
        return false;
      }

      if (this.platform.is('ios')) {
        this.storageDirectory = cordova.file.documentsDirectory;
      }
      else if(this.platform.is('android')) {
        this.storageDirectory = cordova.file.dataDirectory;
      }
      else {
        // exit otherwise, but you could add further types here e.g. Windows
        return false;
      }
    });

    this.item =navParams.get('item');

    if(this.item.flagFrom===undefined ||this.item.flagFrom===null){
     // 默认true 显示
    }else{
      if(this.item.flagFrom=='his')
      this.isShowFooter = false; // 隐藏
    }
    
    this.taskName = navParams.get('taskName');
    this.taskDefKey = navParams.get('taskDefKey');
    
    if(this.item.filePath){
      let filepath:string = this.item.filePath;
      if(filepath&&filepath.length>0){
        this.item.fileName = filepath.substring(filepath.lastIndexOf('\/')+1);
      }    
    }
    //getHistoricFlow(this.item.);
    console.log('taskdetail====',this.item);
    // http://192.168.1.129:18081/LIMS/m/appr/limsBApproveManage/downloadSampTaskPDF?sampTaskHeadId=93d2f4e992cc431eaf816c6ed2ae50d8

    if(localStorage.getItem("serverIP")){
      this.downPdfUrl ="http://"+localStorage.getItem("serverIP")+"/LIMS/m/appr/limsBApproveManage/downloadSampTaskPDF?sampTaskHeadId="+ this.item.id;
    }else{
      this.downPdfUrl ="http://47.94.236.108:18080/LIMS/m/appr/limsBApproveManage/downloadSampTaskPDF?sampTaskHeadId="+ this.item.id;
    }
    this.getHistoricFlow(this.item.procInsId);

  }

  getHistoricFlow(procInsId:string){
    console.log('procInsId---',procInsId);
    this.approvalService.getHistoricFlow(procInsId).subscribe((res:any)=>{
      debugger
      this.historicItems = res;
      console.log('historicItems---',res);
    });
    
  }

   ionViewDidLoad() {
    console.log('ionViewDidLoad TaskDetailPage');
    //this.getHistoricFlow(this.item.procInsId);
  }

  approve(flag:string){
    if('no'===flag&&!this.opinion){
      let alertPop = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '请填写驳回理由!',
        buttons: [{text: 'OK',role: 'cancel'}]
      });
      alertPop.present();
    } else{
       // 判断是否签过名 , 1.同意 , 2.驳回+意见
       this.signName(flag);
    }
 
  }

  signName(flag:string){
    if('no'===flag){
      this.approvalService.doApprove('no',this.item,this.opinion,'lims_b_sampling_task').subscribe((data:any)=>{
        console.log(' result of approve of task-detail.ts',data);
        let toast = this.toastCtrl.create({
          message: '审批完成!',
          duration: 3000,
          position:'middle'
        });
        toast.present();        
        this.navCtrl.pop();
      });
    } else if('yes'===flag){
    this.events.subscribe(this.flowFlag, (params) => {
      // 接收B页面发布的数据
      if(params=='OK'){
        this.signed = true;     
        // 取消订阅
        this.events.unsubscribe(this.flowFlag);
         // 执行审批操作
         this.approvalService.doApprove('yes',this.item,this.opinion,'lims_b_sampling_task').subscribe((data:any)=>{
          console.log(' result of approve of task-detail.ts',data);
          let toast = this.toastCtrl.create({
            message: '审批完成!',
            duration: 3000,
            position:'middle'
          });
          toast.present();        
          this.navCtrl.pop();
        });
      }
     });  
    this.navCtrl.push(SignaturePadPage,{'procInsId':this.item.procInsId,'taskDefKey':this.taskDefKey,'flowFlag':this.flowFlag});
   }
  }


  upload() {

    const fileTransfer: FileTransferObject = this.transfer.create();
    // 更多的 Options 可以点进去自己看看，不懂的就谷歌翻译他的注释
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name.jpg',  // 文件类型
      headers: {},
      params: {}    // 如果要传参数，写这里
      
    }
  
    fileTransfer.upload('<file path>', '<api endpoint>', options)
      .then((data) => {
        // success
      }, (err) => {
        // error
    })
  }

  download() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = 'http://www.example.com/file.pdf';
    fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
      // entry.nativeURL 是上面那个插件文件下载后的保存路径
      this.fileOpener.open(entry.nativeURL, this.getFileMimeType('pdf'))
       .then(() => {
        console.log('File is opened');
       })
        .catch(e => {
          console.log('Error opening file', e);
        });

    }, (error) => {
      // handle error
    });
  }

  getFileType(fileName: string): string {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
  }

  getFileMimeType(fileType: string): string {
    let mimeType: string = '';
  
    switch (fileType) {
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'zip':
        mimeType = 'application/x-zip-compressed';
        break;
      case 'rar':
        mimeType = 'application/octet-stream';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      default:
        mimeType = 'application/' + fileType;
        break;
    }
    return mimeType;
  }


  retrieveImage(image) {

    this.file.checkFile(this.storageDirectory, image)
      .then(() => {

        const alertSuccess = this.alertCtrl.create({
          title: `File retrieval Succeeded!`,
          subTitle: `${image} was successfully retrieved from: ${this.storageDirectory}`,
          buttons: ['Ok']
        });

        return alertSuccess.present();

      })
      .catch((err) => {

        const alertFailure = this.alertCtrl.create({
          title: `File retrieval Failed!`,
          subTitle: `${image} was not successfully retrieved. Error Code: ${err.code}`,
          buttons: ['Ok']
        });

        return alertFailure.present();

      });
  }

  downloadImage(image) {

    this.platform.ready().then(() => {

      const fileTransfer: FileTransferObject = this.transfer.create();

      const imageLocation = `${cordova.file.applicationDirectory}www/assets/img/${image}`;

      fileTransfer.download(imageLocation, this.storageDirectory + image).then((entry) => {

        const alertSuccess = this.alertCtrl.create({
          title: `Download Succeeded!`,
          subTitle: `${image} was successfully downloaded to: ${entry.toURL()}`,
          buttons: ['Ok']
        });

        alertSuccess.present();

      }, (error) => {

        const alertFailure = this.alertCtrl.create({
          title: `Download Failed!`,
          subTitle: `${image} was not successfully downloaded. Error code: ${error.code}`,
          buttons: ['Ok']
        });

        alertFailure.present();

      });

    });

  }
pdf(item){
  
  if(localStorage.getItem("serverIP")){
    this.downPdfUrl ="http://"+localStorage.getItem("serverIP")+"/LIMS/m/pdf/yulan?path="+encodeURI(encodeURI(item.wordFilePath));
  }else{
    this.downPdfUrl="http://47.94.236.108:18080/LIMS/m/pdf/yulan?path="+encodeURI(encodeURI(item.wordFilePath));
  }
  const fileTransfer: FileTransferObject = this.transfer.create();
 
  
    let alert = this.alertCtrl.create({  
        title: '下载进度：0%',  
        enableBackdropDismiss: false,  
        buttons: ['后台下载']  
    });   
    alert.present(); 
  const url =  this.downPdfUrl;
  let vesion:number= this.platform.version().num;

  if(vesion>=6.0){
    
    fileTransfer.download(url, this.file.externalDataDirectory + 'file.pdf').then((entry) => {
      alert.dismiss();
      this.navCtrl.push("PdfPage",{"url":entry.nativeURL})
      console.log('download complete: ' + entry.toURL());
      // entry.nativeURL 是上面那个插件文件下载后的保存路径
    

    }, (error) => {
      // handle error
      
    });
  }else{
    
    fileTransfer.download(url, 'file:///storage/sdcard0/Download/' + 'file.pdf').then((entry) => {
      alert.dismiss();
      console.log('download complete: ' + entry.toURL());
      
      // entry.nativeURL 是上面那个插件文件下载后的保存路径
      this.navCtrl.push("PdfPage",{"url":entry.nativeURL})

    }, (error) => {
      // handle error
      
    });
    fileTransfer.onProgress((event: ProgressEvent) => {  
      let num = Math.floor(event.loaded / event.total * 100);  
      if (num === 100) {  
          alert.dismiss();  
      } else {  
          let title = document.getElementsByClassName('alert-title')[0];  
          title && (title.innerHTML = '下载进度：' + num + '%');  
      }  
  });
  }
 
}
}
