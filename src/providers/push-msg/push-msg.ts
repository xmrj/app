import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';



/*
  Generated class for the PushMsgProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PushMsgProvider {
  data: any;
  userId: string;

  constructor(public http: HttpClient,
    public api: Api,
  ) {
    console.log('Hello PushMsgProvider Provider');
  }

  getMsgList() {
    return this.load().map((data: any) => {
      return data;
    });
  }

  load(): any {
    let userName = localStorage.getItem("username");
    this.data=null;

    if (this.data) {
      return Observable.of(this.data);
    } else {
      let url = 'msg/pushMsg/list?userName=' + userName ;
      return this.api.get(url).map(resp=>{
        return resp;
      });
    }
  }

  getUnReadedCnt():any{
    let userName = localStorage.getItem("username");
    
    let url = 'msg/pushMsg/unReadedCnt?userName=' + userName ;
    return this.api.get(url).map(resp=>{
      return resp;
    });
  }

  delete(msgId:string){
    let userName = localStorage.getItem("username");
    let url = 'msg/pushMsg/deleteMsg?msgId=' + msgId +'&userName=' + userName;
    return this.api.get(url,{}).subscribe(resp=>{
      return resp;
    });
  }

  markAsRead(msgId:string){
    let userName = localStorage.getItem("username");
    let url = 'msg/pushMsg/markAsRead?msgId=' + msgId +'&userName=' + userName;
    return this.api.get(url,{}).subscribe(resp=>{
      return resp;
    }); 
  }

  deleteAll(){
    
    let userName = localStorage.getItem("username");
    let url = 'msg/pushMsg/deleteMsg?userName=' + userName;
    return this.api.get(url,{}).subscribe(resp=>{
      return resp;
    }); 
  }

}
