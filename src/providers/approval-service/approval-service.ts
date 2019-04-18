import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Api } from '../api/api';
import { Storage } from '@ionic/storage';
import {Settings} from '../settings/settings';
/*
  Generated class for the ApprovalServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApprovalServiceProvider {
  data: any;
  mobileSessionId:any;
  userId: string;
  constructor(public http: HttpClient,
    public api: Api,
    public storage:Storage,
    public settings:Settings
  ) {
    console.log('Hello ApprovalServiceProvider Provider');
    this.storage.get("mobileSessionId").then((val) => {
      this.mobileSessionId=val;
    });
  }

  load(a:String,b:any): any {
    // Cannot read property 'username' of null
    //console.log("this.settings.getValue('username')",this.settings.getValue('username'));

    let userName = localStorage.getItem("username");
    this.data=null;

    if (this.data) {
      return Observable.of(this.data);
    } else {
      let url = 'appr/limsBApproveManage?userName=' + userName ;
      if(a) 
       url+='&queryText='+ a ;
      //  if(b)
      //  url+='&types=' + b;
      return this.api.get(url,b)
        .map(this.processData, this);
    }
  }

  processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    //this.data = data.json();

    //this.data.tracks = [];
    this.data = data;

    return this.data;
  }

  getTaskList(queryText = '', queryCond:any) {
    //excludeTracks: any[] = []
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    //let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    // let types='' ;
    // excludeTracks.forEach( (typeValue: any)=>{
    //   types=types+types+","
    // });

    return this.load(queryText,queryCond).map((data: any) => {
      return data;
    });
  }

  /**
   * 查询我已审批的任务
   * @param queryText 保留的查询参数
   * @param excludeTracks 
   */
  getDoneTaskList(queryText = '', queryCond:any) {
    let userName = localStorage.getItem("username");
    this.data=null;

    if (this.data) {
      return Observable.of(this.data);
    } else {
      let url = 'appr/limsBApproveManage/done?userName=' + userName ;
      let act={'procDefKey':queryCond.flowType,'beginDate':queryCond.startDate,'endDate':queryCond.endDate};
      if(queryText) 
       url+='&queryText='+ queryText ;
       
      return  this.api.get(url,act).share();
    }
  }


  getIStartedProcessList(queryText = '', queryCond:any){
    // excludeTracks: any[] = []
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    //let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    // let types='' ;
    // excludeTracks.forEach( (typeValue: any)=>{
    //   types=types+types+","
    // });
    let act={'procDefKey':queryCond.flowType,'beginDate':queryCond.startDate,'endDate':queryCond.endDate};

    return this.loadiStartedProcess(queryText,act).map((data: any) => {
      return data;
    });
  }

  loadiStartedProcess(a:String,b:any): any {
    // Cannot read property 'username' of null
    //console.log("this.settings.getValue('username')",this.settings.getValue('username'));

    let userName = localStorage.getItem("username");
    this.data=null;

    if (this.data) {
      return Observable.of(this.data);
    } else {
      let url = 'appr/limsBApproveManage/istartedProcInst?userName=' + userName ;
      if(a) 
       url+='&queryText='+ a ;
      //  if(b)
      //  url+='&types=' + b;
      return this.api.get(url,b).share();
    }
  }

  getiStartedProcessDetail(task: any,flowFlag:string) {
    let temptask = {
        "taskId":task.businessId, // 但此时应该不是taskId了
        "taskName":task.procDefName,
        "taskDefKey":'',// 流程没有任务key，  task.hisProcInst.processDefinitionKey
        "procInsId":task.hisProcInst.processInstanceId,
        "procDefId":task.hisProcInst.processDefinitionId,
        "status":task.status 
    };
    let params = {
      "username": localStorage.getItem("username"),
      "act":temptask
    }
    var uriTemp:string;
    switch(flowFlag){
      case "lims_b_sampling_task":{
        uriTemp= 'appr/limsBApproveManage/istartedProcessDetail'; //采样任务单审批
        break; 
      } 
      case "lims_b_test_task":{
        uriTemp='task/limsBTestTaskHead/doneTaskDetail'; //检测任务单审批流程
        break; 
      } 
      case "lims_b_sample_register": {
        uriTemp='samp/limsBSamplingResultExamine/doneTaskDetail'; //样品登记审核
        break; 
      }
      case "lims_b_sample_transfer": {
        uriTemp='/samp/limsBSampleTransferHead/doneTaskDetail'; //样品交接流程
        break; 
      }
      case "lims_b_test_report": {
        uriTemp='/repo/limsBTestReport/doneTaskDetail'; //检测报告审批
        break;
      }
      case "lims_b_test_result_check": {
        uriTemp='/testt/limsBTestResultSummary/doneTaskDetail'; //检测结果复核
        break;
      }
      case "lims_b_test_result_task": {
        uriTemp=''; //检测结果审核
        break;
      }
      case "lims_b_task_extension_apply": {
        uriTemp='task/limsBTaskExtensionApply/doneTaskDetail'; // 任务延期申请
        break;
      }
      case "lims_b_curve_manual_summary": {
        uriTemp='/base/limsBCurveManualSummary/doneTaskDetail'; // 手工曲线审核
        break;
      }
    }

    let seq = this.api.post(uriTemp,params).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in.
      console.log('approval-service-taskDetail', res);
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }    

  getDoneTaskDetail(task: any,flowFlag:string) {
    let temptask = {
        "taskId":task.histTask.id,
        "taskName":task.hisTaskName,
        "taskDefKey":task.histTask.taskDefinitionKey,
        "procInsId":task.histTask.processInstanceId,
        "procDefId":task.histTask.processDefinitionId,
        "status":task.status 
    };
    let params = {
      "username": localStorage.getItem("username"),
      "act":temptask
    }
    var uriTemp:string;
    switch(flowFlag){
      case "lims_b_sampling_task":{
        uriTemp= 'appr/limsBApproveManage/doneTaskDetail'; //采样任务单审批
        break; 
      } 
      case "lims_b_test_task":{
        uriTemp='task/limsBTestTaskHead/doneTaskDetail'; //检测任务单审批流程
        break; 
      } 
      case "lims_b_sample_register": {
        uriTemp='samp/limsBSamplingResultExamine/doneTaskDetail'; //样品登记审核
        break; 
      }
      case "lims_b_sample_transfer": {
        uriTemp='/samp/limsBSampleTransferHead/doneTaskDetail'; //样品交接流程
        break; 
      }
      case "lims_b_test_report": {
        uriTemp='/repo/limsBTestReport/doneTaskDetail'; //检测报告审批
        break;
      }
      case "lims_b_test_result_check": {
        uriTemp='/testt/limsBTestResultSummary/doneTaskDetail'; //检测结果复核
        break;
      }
      case "lims_b_test_result_task": {
        uriTemp=''; //检测结果审核
        break;
      }
      case "lims_b_task_extension_apply": {
        uriTemp='task/limsBTaskExtensionApply/doneTaskDetail'; // 任务延期申请
        break;
      }
      case "lims_b_curve_manual_summary": {
        uriTemp='/base/limsBCurveManualSummary/doneTaskDetail'; // 手工曲线审核
        break;
      }
    }

    let seq = this.api.post(uriTemp,params).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in.
      console.log('approval-service-taskDetail', res);
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }  

  getTaskDetail(task: any) {
    let temptask = {
        "taskId":task.taskId,
        "taskName":task.taskName,
        "taskDefKey":task.taskDefKey,
        "procInsId":task.procInsId,
        "procDefId":task.procDefId,
        "status":task.status 
    };
    let params = {
      "username": localStorage.getItem("username"),
      "act":temptask
    }
    let flowFlag:string =task.procDefId.slice(0,task.procDefId.indexOf(":"));
    var uriTemp:string;
    switch(flowFlag){
      case "lims_b_sampling_task":{
        uriTemp= 'appr/limsBApproveManage/taskDetail'; //采样任务单审批
        break; 
      } 
      case "lims_b_test_task":{
        uriTemp='task/limsBTestTaskHead/taskDetail'; //检测任务单审批流程
        break; 
      } 
      case "lims_b_sample_register": {
        uriTemp='samp/limsBSamplingResultExamine/taskDetail'; //样品登记审核
        break; 
      }
      case "lims_b_sample_transfer": {
        uriTemp='/samp/limsBSampleTransferHead/taskDetail'; //样品交接流程
        break; 
      }
      case "lims_b_test_report": {
        uriTemp='/repo/limsBTestReport/taskDetail'; //检测报告审批
        break;
      }
      case "lims_b_test_result_check": {
        uriTemp='/testt/limsBTestResultSummary/taskDetail'; //检测结果复核
        break;
      }
      case "lims_b_test_result_task": {
        uriTemp=''; //检测结果审核
        break;
      }
      case "lims_b_task_extension_apply": {
        uriTemp='task/limsBTaskExtensionApply/taskDetail'; // 任务延期申请
        break;
      }
      case "lims_b_curve_manual_summary": {
        uriTemp='/base/limsBCurveManualSummary/taskDetail'; // 手工曲线审核
        break;
      }
    }

    let seq = this.api.post(uriTemp,params).share();
    seq.subscribe((res: any) => {
     
      // If the API returned a successful response, mark the user as logged in.
      console.log('approval-service-taskDetail', res);
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  doApprove(flag:string,task:any,opinion:string,flowFlag:string){
     let params={
      "taskId":task.id,
      "username":localStorage.getItem("username"),
      "flag":flag,
      "procInsId":task.procInsId,
      "opinion":opinion
     };
     var uriTemp:string;
     switch(flowFlag){
       case "lims_b_sampling_task":{
         uriTemp= 'appr/limsBApproveManage/saveAudit'; //采样任务单审批
         break; 
       } 
       case "lims_b_test_task":{
         uriTemp='task/limsBTestTaskHead/saveAudit'; //检测任务单审批流程
         break; 
       } 
       case "lims_b_sample_register": {
         uriTemp='samp/limsBSamplingResultExamine/saveAudit'; //样品登记审核
         break; 
       }
       case "lims_b_sample_transfer": {
         uriTemp='samp/limsBSampleTransferHead/saveAudit'; //样品交接流程
         break; 
       }
       case "lims_b_test_report": {
         uriTemp='repo/limsBTestReport/saveAudit'; //检测报告审批
         break;
       }
       case "lims_b_test_result_check": {
         uriTemp='testt/limsBTestResultSummary/saveAudit'; //检测结果复核
         break;
       }
       case "lims_b_test_result_task": {
         uriTemp=''; //检测结果审核
         break;
       }
       case "lims_b_task_extension_apply": {
        uriTemp='task/limsBTaskExtensionApply/saveAudit'; //检测结果审核
        break;
      }
      case "lims_b_curve_manual_summary": {
        uriTemp='base/limsBCurveManualSummary/saveAudit'; //手工曲线审核
        break;
      }
      
       
     }     

     let seq = this.api.post(uriTemp,params).share();
     seq.subscribe((res: any) => {
      console.log('doApprove succcess of approval-service', res);
     }, err => {
       console.error('ERROR doApprove of approval-service', err);
     });
 
     return seq;
  }

  getHistoricFlow(procInsId:string){
    let seq = this.api.get('appr/limsBApproveManage/historicFlow',{"procInsId":procInsId}).map((res: any) => {
     console.log('getHistoricFlow succcess of approval-service', res);
     return res;
    }, err => {
      console.error('getHistoricFlow of approval-service', err);
    });

    return seq;
  }


  getFlowTypes() :any {
    return this.api.get('appr/limsBApproveManage/flowtypes').map((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      return res;
    }, err => {
      console.error('ERROR', err);
    });
  
  }

}
