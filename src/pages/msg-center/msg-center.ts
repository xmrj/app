import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ItemSliding } from 'ionic-angular';
import { PushMsgProvider } from '../../providers/push-msg/push-msg';

/**
 * Generated class for the MsgCenterPage page.
 *s
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-msg-center',
  templateUrl: 'msg-center.html',
})
export class MsgCenterPage {

  list:Array<Object>;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public pushMsgService:PushMsgProvider
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MsgCenterPage');
    this.getMsgs();
  }

  getMsgs(){
    this.pushMsgService.getMsgList().subscribe((data: any) => {
      this.list = data;
     
      });
  }

  removeItem(slidingItem:ItemSliding, item:any){

    let index = this.list.indexOf(item);
    if(index > -1){
      this.list.splice(index,1);
    }
    slidingItem.close();
    this.pushMsgService.delete(item.id);
    //重新查询
    //this.getMsgs();
  }

  markAsRead(slidingItem:ItemSliding,item:any){
    //item.status = "done";
    item.readedOrNot = '1';
    this.pushMsgService.markAsRead(item.id);
    //this.tasks.update(task.$key,{status:'done'});
    slidingItem.close();
    //重新查询，刷新页面
    //this.getMsgs();
  }
  markAsReads(slidingItem:ItemSliding,item:any){
    //item.status = "done";
    item.readedOrNot = '1';
    this.pushMsgService.markAsRead(item.id);
    //this.tasks.update(task.$key,{status:'done'});
    slidingItem.close();
    this.navCtrl.pop();
    //重新查询，刷新页面
    //this.getMsgs();
  }

  deleteAllMsg(){
    this.pushMsgService.deleteAll();
    this.list = null;
  }

}
