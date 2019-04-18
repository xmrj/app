import { Component,ViewChild } from '@angular/core';
import { IonicPage,App, NavController,ModalController, AlertController,NavParams,List,ToastController,LoadingController } from 'ionic-angular';
import { ApprovalServiceProvider} from '../../providers/approval-service/approval-service';
import { PushMsgProvider} from '../../providers/push-msg/push-msg';
import { Item } from '../../models/item';
import { TaskFilterPage} from '../task-filter/task-filter';
import { MsgCenterPage} from  '../msg-center/msg-center';
import { SearchPage } from '../search/search';

/**
 * Generated class for the ApprovalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-approval',
  templateUrl: 'approval.html',
})
export class ApprovalPage {

  @ViewChild('taskList', { read: List }) taskList: List;
  excludeTracks: any = [];
  segment = 'todo';
  queryText = '';
  size =0;
  state:number=0;
  unReadedCnt:number=0;
  
  shownTasks: any = [];
  doneTasks: any = [];
  istartedProcesses:any=[];
  queryCond:any={};

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private alertCtrl:AlertController,
    public navParams: NavParams,
    public approvalService:ApprovalServiceProvider,
    public loadingCtrl: LoadingController,
    public pushMsgService:PushMsgProvider,
    public app: App,
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApprovalPage');
    this.app.setTitle('Schedule');
    //this.updateTask();
  }

  ionViewWillEnter(){
    this.updateTask();
  }

  selectDoneTask(){
    this.segment = 'done';
    let loader = this.loadingCtrl.create({
      content: "数据加载中...",
    });
    loader.present();
   
    this.doneTasks=[];// 清空
    this.approvalService.getDoneTaskList(this.queryText, this.queryCond).subscribe((data: any) => {
      loader.dismiss();
      console.log("selectDoneTask===========",data);
      this.doneTasks = data; 
    }); 

  }

  selectMyStarted(){
    this.segment = 'istarted';
    let loader = this.loadingCtrl.create({
      content: "数据加载中...",
    });
    loader.present();
   
    this.istartedProcesses=[];// 清空
    this.approvalService.getIStartedProcessList(this.queryText, this.queryCond).subscribe((data: any) => {
      loader.dismiss();
      console.log("data===========",data);
      this.istartedProcesses = data; 
    });     
  }


  updateTask() {
    let loader = this.loadingCtrl.create({
      content: "数据加载中...",
    });
    loader.present();
    this.taskList && this.taskList.closeSlidingItems();
    //this.approvalService.load();
    this.shownTasks=[];// 清空
    this.approvalService.getTaskList(this.queryText, this.queryCond).subscribe((data: any) => {
      loader.dismiss();
      console.log("data===========",data);
      this.shownTasks = data;
      
      console.log("this.shownTasks.size===========",this.shownTasks.length);
      if(this.shownTasks)
      this.size=this.shownTasks.length; 
     
    });   
    
    this.pushMsgService.getUnReadedCnt().subscribe(data=>{
      this.unReadedCnt = data;
    });
    
  }

   /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {

    let flowFlag:string =item.procDefId.slice(0,item.procDefId.indexOf(":"));
    if('lims_b_test_result_task'==flowFlag){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '检测结果审核，请在电脑端审核！',
        buttons: ['确定']
      });
      alert.present();

    } else {
        this.approvalService.getTaskDetail(item).subscribe((data:Item)=>{     
        var targetPage='';
        switch(flowFlag){
          case "lims_b_sampling_task":{
            targetPage='TaskDetailPage'; //采样任务单审批
            break; 
          } 
          case "lims_b_test_task":{
            targetPage='CheckTaskAuditPage'; //检测任务单审批流程
            break; 
          } 
          case "lims_b_sample_register": {
            targetPage='SampleRegisterPage'; //样品登记审核
            break; 
          }
          case "lims_b_sample_transfer": {
            targetPage='SampleTransferPage'; //样品交接流程
            break; 
          }
          case "lims_b_test_report": {
            targetPage='CheckReportPage'; //检测报告审批
            break;
          }
          case "lims_b_test_result_check": {
            targetPage='CheckResultCheckPage'; //检测结果复核
            break;
          }
          case "lims_b_test_result_task": {
            targetPage='CheckTaskDetailPage'; //检测结果审核
            break;
          }
          case "lims_b_task_extension_apply": {
            targetPage='DelayApplyPage'; //任务延期申请
            break;
          }
          case "lims_b_curve_manual_summary": {
            targetPage='ManualCurvePage'; //手工曲线审核
            break;
          }        
          
        }
        
        this.navCtrl.push(targetPage, {
          item: data,
          taskName:item.taskName,
          taskDefKey:item.taskDefKey
        });
      });
    }
  }

  openDoneItem(item: Item){
      let flowFlag:string =item.histTask.processDefinitionId.slice(0,item.histTask.processDefinitionId.indexOf(":"));
      if('lims_b_test_result_task'==flowFlag){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请在电脑端查看检测结果审核明细！',
          buttons: ['确定']
        });
        alert.present();
  
      } else {
      var targetPage='';
      switch(flowFlag){
        case "lims_b_sampling_task":{
          targetPage='TaskDetailPage'; //采样任务单审批
          break; 
        } 
        case "lims_b_test_task":{
          targetPage='CheckTaskAuditPage'; //检测任务单审批流程
          break; 
        } 
        case "lims_b_sample_register": {
          targetPage='SampleRegisterPage'; //样品登记审核
          break; 
        }
        case "lims_b_sample_transfer": {
          targetPage='SampleTransferPage'; //样品交接流程
          break; 
        }
        case "lims_b_test_report": {
          targetPage='CheckReportPage'; //检测报告审批
          break;
        }
        case "lims_b_test_result_check": {
          targetPage='CheckResultCheckPage'; //检测结果复核
          break;
        }
        case "lims_b_test_result_task": {
          targetPage='CheckTaskDetailPage'; //检测结果审核
          break;
        }
        case "lims_b_task_extension_apply": {
          targetPage='DelayApplyPage'; //任务延期申请
          break;
        }
        case "lims_b_curve_manual_summary": {
          targetPage='ManualCurvePage'; //手工曲线审核
          break;
        }
      }

      this.approvalService.getDoneTaskDetail(item,flowFlag).subscribe((data:Item)=>{   
        this.navCtrl.push(targetPage, {
          item: data,
          taskName:item.taskName,
          taskDefKey:item.taskDefKey
        });
      });
    }
  }

  openProcessItem(item: Item){
    let flowFlag:string =item.hisProcInst.processDefinitionId.slice(0,item.hisProcInst.processDefinitionId.indexOf(":"));
    if('lims_b_test_result_task'==flowFlag){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请在电脑端查看检测结果审核明细！',
        buttons: ['确定']
      });
      alert.present();

    } else {
    var targetPage='';
    switch(flowFlag){
      case "lims_b_sampling_task":{
        targetPage='TaskDetailPage'; //采样任务单审批
        break; 
      } 
      case "lims_b_test_task":{
        targetPage='CheckTaskAuditPage'; //检测任务单审批流程
        break; 
      } 
      case "lims_b_sample_register": {
        targetPage='SampleRegisterPage'; //样品登记审核
        break; 
      }
      case "lims_b_sample_transfer": {
        targetPage='SampleTransferPage'; //样品交接流程
        break; 
      }
      case "lims_b_test_report": {
        targetPage='CheckReportPage'; //检测报告审批
        break;
      }
      case "lims_b_test_result_check": {
        targetPage='CheckResultCheckPage'; //检测结果复核
        break;
      }
      case "lims_b_test_result_task": {
        targetPage='CheckTaskDetailPage'; //检测结果审核
        break;
      }
      case "lims_b_task_extension_apply": {
        targetPage='DelayApplyPage'; //任务延期申请
        break;
      }
      case "lims_b_curve_manual_summary": {
        targetPage='ManualCurvePage'; //手工曲线审核
        break;
      }
    }

    this.approvalService.getiStartedProcessDetail(item,flowFlag).subscribe((data:Item)=>{
      this.navCtrl.push(targetPage, {
        item: data,
        taskName:item.taskName,
        taskDefKey:item.taskDefKey
      });
    });
  }

  }

  doRefresh(refresher) {
    console.log('Async operation has ended');
    if(this.segment=='todo'){
      this.approvalService.getTaskList(this.queryText, this.excludeTracks).subscribe((data: any) => {
        this.shownTasks=[];
        this.shownTasks = data;
        this.size=this.shownTasks.length;
        refresher.complete(); 
    
        const toast = this.toastCtrl.create({
          message: '数据更新完成.',
          duration: 2000,
          position: 'middle'

        });
        toast.present();
      });
    } else if(this.segment=='doneTask'){
      let loader = this.loadingCtrl.create({
        content: "数据加载中...",
      });
      loader.present();
     
      this.istartedProcesses=[];// 清空
      this.approvalService.getIStartedProcessList(this.queryText, this.excludeTracks).subscribe((data: any) => {
        loader.dismiss();
        this.istartedProcesses = data; 
        
        refresher.complete(); 
    
        const toast = this.toastCtrl.create({
          message: '数据更新完成.',
          duration: 2000,
          position: 'middle'

        });
        toast.present();        
      }); 
    } else if(this.segment=='istarted'){
      let loader = this.loadingCtrl.create({
        content: "数据加载中...",
      });
      loader.present();
     
      this.istartedProcesses=[];// 清空
      this.approvalService.getIStartedProcessList(this.queryText, this.excludeTracks).subscribe((data: any) => {
        loader.dismiss();
        console.log("data===========",data);
        this.istartedProcesses = data;
        
        refresher.complete(); 
    
        const toast = this.toastCtrl.create({
          message: '数据更新完成.',
          duration: 2000,
          position: 'middle'

        });
        toast.present();            
      }); 
    }      
  }

  showHidden(){
    document.getElementById("searchDiv").style.display="none";
    document.getElementById("filterDiv").style.display="none";
    document.getElementById("searchBarDiv").style.display="inline";
  }

  showFilter(){
    document.getElementById("searchDiv").style.display="inline";
    document.getElementById("filterDiv").style.display="inline";
    document.getElementById("searchBarDiv").style.display="none";
  }

  updateSchedule(event){
    const val = event.target.value;
    if (!val || !val.trim()) {
      this.queryText = '';
    } else {
      this.queryText = val.trim();
    }
    if(this.segment=='todo'){
      this.updateTask();
    } else if(this.segment=='doneTask'){
      this.selectDoneTask();
      this.segment = 'doneTask';
    } else if(this.segment=='istarted'){
      this.selectMyStarted();
    }
  }

  presentFilter() {
    let modal = this.modalCtrl.create(TaskFilterPage, this.excludeTracks);
    modal.present();
    modal.onWillDismiss((data: any[]) => {
      if (data) {
        //this.excludeTracks = data;
       this.queryCond = data;
        if(this.segment=='todo'){
          this.updateTask();
        } else if(this.segment=='doneTask'){
          this.selectDoneTask();
          this.segment = 'doneTask';
        } else if(this.segment=='istarted'){
          this.selectMyStarted();
        }
      }
    });
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "数据加载中...",
    });
    loader.present();
  }

  goMsgCenter(){
    this.navCtrl.push('MsgCenterPage');
  }

  doScanner(){
    this.navCtrl.push('QrScannerPage');
  }

}
