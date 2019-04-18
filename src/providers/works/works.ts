import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';

/*
  Generated class for the WorksProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WorksProvider {

  constructor(public http: HttpClient,public api: Api) {
    console.log('Hello WorksProvider Provider');
  }
 save(data){
   
  let seq = this.api.post('works/internalaudit/save',  data ).share();
  seq.subscribe((res: any) => {
    // If the API returned a successful response, mark the user as logged in

  }, err => {
    console.error('ERROR', err);
  });

  return seq;

 }

 findList(){
  
 let seq = this.api.post('works/internalaudit/findList',  {} ).share();
 seq.subscribe((res: any) => {
   // If the API returned a successful response, mark the user as logged in

 }, err => {
   console.error('ERROR', err);
 });

 return seq;

}
delete(data){
  
 let seq = this.api.post('works/internalaudit/delete',  data ).share();
 seq.subscribe((res: any) => {
   // If the API returned a successful response, mark the user as logged in

 }, err => {
   console.error('ERROR', err);
 });

 return seq;

}

deleteimg(imgname){
  let seq = this.api.post('works/internalaudit/deletimg',  imgname ).share();
  seq.subscribe((res: any) => {
    // If the API returned a successful response, mark the user as logged in
 
  }, err => {
    console.error('ERROR', err);
  });
 
  return seq;
}
}
