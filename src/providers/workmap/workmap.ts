import { Injectable } from '@angular/core';
import { Api } from '../api/api';
/*
  Generated class for the WorkmapProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WorkmapProvider {

  constructor(public api: Api) {
    console.log('Hello WorkmapProvider Provider');
  }
showdata(data){
  let seq = this.api.post('EntrustedUnitList?data='+data, {}).share();
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
saveMark(data){

  let seq = this.api.post('map/limsTaskMapMark/save', data).share();
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
seemark(data){
  let seq = this.api.post('map/limsTaskMapMark/showmark', {'taskid':data.id,'testAgreementId':data.testAgreementId}).share();
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
fidpointbytaskid(data){
  let seq = this.api.post('map/limsTaskMapMark/findbeanbyTestId', {'taskid':data}).share();
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

access_token(){
  let seq = this.api.post('map/onlinemap/access_token', {}).share();
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
findcars(data){
  let seq = this.api.post('map/limsTaskMapMark/findcar', data).share();
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

findallcar(){
  let seq = this.api.post('map/limsTaskMapMark/findallcar', {}).share();
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

