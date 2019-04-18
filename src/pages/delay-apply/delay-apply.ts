import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ToastController } from 'ionic-angular';
import {ApprovalServiceProvider} from '../../providers/approval-service/approval-service';
import { FlowItem } from '../../models/FlowItem';


@IonicPage()
@Component({
  selector: 'page-delay-apply',
  templateUrl: 'delay-apply.html',
})
export class DelayApplyPage {
  item: any;
  historicItems:Array<FlowItem>;
  opinion:string; // 审批意见
  taskName: string;
  isShowFooter:boolean = true;// 是否显示审批按钮

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public approvalService:ApprovalServiceProvider,  
    public alertCtrl: AlertController,
    public toastCtrl: ToastController 
  ) {
    this.taskName = navParams.get('taskName');
    this.item =navParams.get('item');
    if(this.item.flagFrom===undefined ||this.item.flagFrom===null){
      // 默认true 显示
     } else {
       if(this.item.flagFrom=='his')
          this.isShowFooter = false; // 隐藏
     }
    
    if(this.item.filePath){
      let filepath:string = this.item.filePath;
      if(filepath&&filepath.length>0){
        this.item.fileName = filepath.substring(filepath.lastIndexOf('\/')+1);
      }    
    }   

    //流转记录
    this.getHistoricFlow(this.item.procInsId); 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DelayApplyPage');
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
      this.approvalService.doApprove(flag,this.item,this.opinion,'lims_b_task_extension_apply').subscribe((data:any)=>{
        console.log(' result of approve of task-detail.ts',data);
        let toast = this.toastCtrl.create({
          message: '审批完成.',
          duration: 3000,
          position:'middle'
        });
        toast.present();
        this.navCtrl.pop();
      });
    }
  }

}
