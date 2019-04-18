import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,AlertController, ToastController,Events } from 'ionic-angular';
import { ApprovalServiceProvider} from '../../providers/approval-service/approval-service';
import { FlowItem } from '../../models/FlowItem';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import {SignaturePadPage} from '../signature-pad/signature-pad';

/**
 * Generated class for the ManualCurvePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manual-curve',
  templateUrl: 'manual-curve.html',
})
export class ManualCurvePage {
  item: any;
  historicItems:Array<FlowItem>;
  downPdfUrl :string ;
  opinion:string; // 审批意见
  taskName: string;
  taskDefKey:string; // 岗位
  flowFlag:string = 'lims_b_curve_manual_summary';// 流程标识
  isShowFooter:boolean = true;// 是否显示审批按钮
    arr=[];
    itemname=[];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public approvalService:ApprovalServiceProvider,  
    public alertCtrl: AlertController,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,
    public platform: Platform, 
    private events :Events,
    public toastCtrl: ToastController 
  ) {
    
    this.item =navParams.get('item');
    this.taskName = navParams.get('taskName');
    this.taskDefKey = navParams.get('taskDefKey');
    if(this.item.flagFrom===undefined ||this.item.flagFrom===null){
      // 默认true 显示
     } else {
       if(this.item.flagFrom=='his')
          this.isShowFooter = false; // 隐藏
     }
     
   /* if(this.item.wordFilePath){
      let filepath:string = this.item.wordFilePath;
      if(filepath&&filepath.length>0){
        this.item.fileName = filepath.substring(filepath.lastIndexOf('\/')+1);
      }    
    } */
   
     
      let filepath:string = this.item.pdfFilePath;
      //Jiadaoyuan  2018/09/05
      if(filepath&&filepath!='null'){
        this.arr=filepath.split(",");      
        for(var i=0;i<this.arr.length;i++){
            this.itemname.push(this.arr[i].substring(this.arr[i].lastIndexOf('\\')+1));
        }
      }
   

    if(localStorage.getItem("serverIP")){
      this.downPdfUrl ="http://"+localStorage.getItem("serverIP")+"/LIMS/m/base/limsBCurveManualSummary/downLoadTestDetail?id="+ this.item.id;
    } else {
      this.downPdfUrl ="http://47.94.236.108:18080/LIMS/m/base/limsBCurveManualSummary/downLoadTestDetail?id="+ this.item.id;
      // 192.168.1.146 ,47.94.236.108
    }

    //流转记录
    this.getHistoricFlow(this.item.procInsId); 
  }

  getHistoricFlow(procInsId:string){
    this.approvalService.getHistoricFlow(procInsId).subscribe((res:any)=>{
      this.historicItems = res;
    });    
  }

  approve(flag:string){
    if('no'===flag&&!this.opinion){
      let alertPop = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '请填写驳回理由!',
        buttons: [{text: 'OK',role: 'cancel'}]
      });
      alertPop.present();
    } else {
      this.signName(flag);
    }
  }

  signName(flag:string){
    if('no'===flag){
      this.approvalService.doApprove(flag,this.item,this.opinion,this.flowFlag).subscribe((data:any)=>{
        let toast = this.toastCtrl.create({
          message: '审批完成.',
          duration: 3000,
          position:'middle'
        });
        toast.present();
        this.navCtrl.pop();
      });
    } else if('yes'===flag){
      this.events.subscribe(this.flowFlag, (params) => {
        // 接收B页面发布的数据, 签名上传
        if(params=='OK'){
          this.events.unsubscribe(this.flowFlag);
          this.approvalService.doApprove(flag,this.item,this.opinion,this.flowFlag).subscribe((data:any)=>{
            let toast = this.toastCtrl.create({
              message: '审批完成.',
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

  pdf(path){
   
    if(localStorage.getItem("serverIP")){
      this.downPdfUrl ="http://"+localStorage.getItem("serverIP")+"/LIMS/m/pdf/yulan2?path="+encodeURI(encodeURI(path));
    }else{
      this.downPdfUrl="http://47.94.236.108:18080/LIMS/m/pdf/yulan2?path="+encodeURI(encodeURI(path));
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
    } else {
      
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManualCurvePage');
  }

}
