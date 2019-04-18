import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';

/*
  Generated class for the AppUpdateServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppUpdateServiceProvider {

  constructor(public http: HttpClient,
    private api:Api
  ) {
    console.log('Hello AppUpdateServiceProvider Provider');
  }

  getLastestVersion():any{
    let url = 'versionInfo' ;
    return this.api.get(url).map(res=>{
      return res;
    });
  }

}
