import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  constructor(public api: Api,
    public events: Events,
    public storage: Storage
  ) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any,registrationId :string) {
    let seq = this.api.post('login', {
      "username":accountInfo.username,
      "password":accountInfo.password,
      "registrationId":registrationId}).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in  
      if (res.status == '1') {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(accountInfo.username);
        this.setPassword(accountInfo.password);
        this.events.publish('user:login');

        this._loggedIn(res);
        return res;
      } else if(res.status == '0') {
        return res;
      }

    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }


  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    //this.storage.remove('username');
    this.storage.remove('password');
    this.events.publish('user:logout');
  };

  setUsername(username: string): void {
    this.storage.set('username', username);
  };

  setPassword(password: string): void {
    this.storage.set('password', password);
  };

  getPassword(): Promise<string> {
    return this.storage.get('password').then((value) => {
      return value;
    });
  };

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };


  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }


  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
