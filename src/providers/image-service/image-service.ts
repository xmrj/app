import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
/*
  Generated class for the ImageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageServiceProvider {

  constructor(public http: HttpClient,
    private api:Api) {
    console.log('Hello ImageServiceProvider Provider');
  }

  upload(data:any,url:string): any {
    // Cannot read property 'username' of null
    //console.log("this.settings.getValue('username')",this.settings.getValue('username'));

    let userName = localStorage.getItem("username");
    data.username = userName;

    let seq = this.api.post(url,data).share();

    return seq;

  }

}
