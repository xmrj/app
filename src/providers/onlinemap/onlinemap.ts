import { Injectable } from '@angular/core';
import {OnlinemapapiProvider} from '../onlinemapapi/onlinemapapi'
import 'rxjs/add/operator/toPromise';
/*
  Generated class for the OnlinemapProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OnlinemapProvider {

  constructor(public api: OnlinemapapiProvider) {
    console.log('Hello OnlinemapProvider Provider');
  }
  monitor(url){
 
    let seq = this.api.post('account/monitor?'+url, {}).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
       
      } else {
      }

    }, err => {
      console.error('ERROR', err);
    });
  
    return seq;
  }
  address(url){
    let seq = this.api.post('tool/address?'+url, {}).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
       
      } else {
      }

    }, err => {
      console.error('ERROR', err);
    });
  
    return seq;
  }

  history(url){
    let seq = this.api.post('devices/history?'+url, {}).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
       
      } else {
      }

    }, err => {
      console.error('ERROR', err);
    });
  
    return seq;
  }

 
  //跟踪
  tracking(url){
    let seq = this.api.post('devices/tracking?'+url, {}).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
       
      } else {
      }

    }, err => {
      console.error('ERROR', err);
    });
  
    return seq;
  }
}
