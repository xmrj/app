import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform} from 'ionic-angular';
/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  public static API_URL_1: string = 'http://localhost:8100/m';

  public static API_URL: string;
  constructor(public http: HttpClient,
    public platform :Platform,
  ) {
    if(platform.is('core')||platform.is('browser')){
      Api.API_URL = Api.API_URL_1;
    }else {
      // add by wangjunli 20180528
      this.updateAPI_URL();
    }  
  }

  // add by wangjunli 20180528
  public updateAPI_URL() {
    let ipStr = "";
    if(window.localStorage.getItem("serverIP")){
      ipStr= window.localStorage.getItem("serverIP")
    }else{
      ipStr="47.94.236.108:18080";
    }
    Api.API_URL = "http://"+ ipStr+"/LIMS/m";
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(Api.API_URL + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    // 退出后，再次登录设置服务器地址;
    if(this.platform.is('core')||this.platform.is('browser')){
      Api.API_URL = Api.API_URL_1;
    } else {
      // add by wangjunli 20180528
      this.updateAPI_URL();
    } 
    return this.http.post(Api.API_URL + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(Api.API_URL + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(Api.API_URL + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(Api.API_URL + '/' + endpoint, body, reqOpts);
  }
}
