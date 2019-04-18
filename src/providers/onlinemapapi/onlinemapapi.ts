import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Platform} from 'ionic-angular';
/*
  Generated class for the OnlinemapapiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OnlinemapapiProvider {

  static API_URL:string ;
  constructor(public http: HttpClient,
    public platform :Platform,
  ) {
    console.log('Hello OnlinemapapiProvider Provider');
    if(platform.is('core')||platform.is('browser')){
      OnlinemapapiProvider.API_URL = 'http://47.94.236.108/qichezaixian';
    }else {
      OnlinemapapiProvider.API_URL ="http://api.gpsoo.net/1";
    }
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

    return this.http.get(OnlinemapapiProvider.API_URL + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(OnlinemapapiProvider.API_URL + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(OnlinemapapiProvider.API_URL + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(OnlinemapapiProvider.API_URL + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(OnlinemapapiProvider.API_URL + '/' + endpoint, body, reqOpts);
  }
 
}
