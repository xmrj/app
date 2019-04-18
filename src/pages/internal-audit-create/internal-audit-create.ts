import { Component } from '@angular/core';
import { IonicPage,ModalController,AlertController , NavController, NavParams,ToastController } from 'ionic-angular';
import {WorksProvider} from '../../providers/works/works';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import { DomSanitizer } from '@angular/platform-browser'
import { GalleryModal } from 'ionic-gallery-modal';
import { stringify } from '@angular/compiler/src/util';
/**
 * Generated class for the InternalAuditCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-internal-audit-create',
  templateUrl: 'internal-audit-create.html',
})
export class InternalAuditCreatePage {
   situation_explain=""; //情况说明
   person_liable="";//责任人
   title="";//标题
   datetime="";
   id=null;
   path :any;
   data = []; 
   savedata=[];
   private photos: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public worksProvider: WorksProvider, 
    public toastCtrl: ToastController, private camera: Camera,
    private transfer: FileTransfer, private file: File,private sanitizer: DomSanitizer,
     private modalCtrl: ModalController,private alertCtrl:AlertController) {
      
   let item = navParams.get("item");
  
   if(item==undefined){
    this.datetime=new Date(new Date().getTime()+8*60*60*1000).toISOString();//开始时间;
   }else{
     this.id=item.id;
     this.title=item.title;
     this.datetime= new Date(new Date(item.time).getTime()+8*60*60*1000).toISOString();
     this.situation_explain=item.situationExplain;
     this.person_liable=item.personLiable;
     let photo:string=item.photo;
     if(photo!=null){
     this.savedata= photo.split(",");
     let url="http://47.94.236.108:18080/LIMS/f/samp/limsBSamplingPicInfo/showImg?filePath=";
     if(localStorage.getItem("serverIP")){
       url="http://"+localStorage.getItem("serverIP")+"/LIMS/f/samp/limsBSamplingPicInfo/showImg?filePath=";
     }
  for(var i=0;i<this.savedata.length;i++){
    this.data.push(url+this.savedata[i]); 
    this.photos.push({
      url: url+this.savedata[i]
    });
  }
     
} 
   }
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InternalAuditCreatePage');
  }

  gobalck(){
    this.navCtrl.pop(); /*返回上一个页面*/
   
  }
  
  save(){
  
   let userId= localStorage.getItem('userId');
  
    let data={'id':this.id,'title':this.title,'personLiable':this.person_liable,
    'situationExplain':this.situation_explain,'date':this.datetime.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''),
  'userid':userId,'photo': this.savedata.join(",")  }
    this.worksProvider.save(data).subscribe((res)=>{
      let result : any=res;
     if(result.data=="success") {
      let toast = this.toastCtrl.create({
        message: ' 保存成功',
        duration: 100,
        position: 'middle'
      });
      toast.present();
      this.navCtrl.pop();
     }else{
      let toast = this.toastCtrl.create({
        message: ' 保存失败',
        duration: 100,
        position: 'middle'
      });
      toast.present();
     }
    }, (err) => {
    let toast = this.toastCtrl.create({
        message: ' 保存失败',
        duration: 100,
        position: 'middle'
      });
      toast.present();
  })
 
 
  }

   /**
   * 打开摄像头
   */
  openCamera(){
    const options: CameraOptions = {
      quality: 10,                                                   //相片质量 0 -100
      destinationType: this.camera.DestinationType.FILE_URI,        //DATA_URL 是 base64   FILE_URL 是文件路径
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,                                       //是否保存到相册
      // sourceType: this.camera.PictureSourceType.CAMERA ,         //是打开相机拍照还是打开相册选择  PHOTOLIBRARY : 相册选择, CAMERA : 拍照,
    }

    this.camera.getPicture(options).then((imageData) => {
      console.log("got file: " + imageData);
       
      
       
      this.path=imageData;
      this.photos.push({
        url: imageData
      });
      
      //If it's file URI
       

     this.upload();

    }, (err) => {
      // Handle error
    });
  }
/**
   * 文件上传
   */
  upload() {
    
    let url="http://47.94.236.108:18080/LIMS/m/works/internalaudit/upload";
    if(localStorage.getItem("serverIP")){
      url="http://"+localStorage.getItem("serverIP")+"/LIMS/m/works/internalaudit/upload";
    }else{

    }
   
  const fileTransfer: FileTransferObject = this.transfer.create();
 
 // 文件名  
 let fileName=this.getFileName(this.path);  
 

     let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileName,   //文件名称
      headers: {},
      // 如果要传参数，写这里
      params: {
        maxSize: 5000000,
        modularName: 'CNL',
        allowType: 'jpg;png;pdf;doc;xls;xlsx;docx',
      }
    };

      fileTransfer.upload(this.path, url, options)
      .then((data) => {
        let result: any = data;
        let url="http://47.94.236.108:18080/LIMS/f/samp/limsBSamplingPicInfo/showImg?filePath=";
        if(localStorage.getItem("serverIP")){
          url="http://"+localStorage.getItem("serverIP")+"/LIMS/f/samp/limsBSamplingPicInfo/showImg?filePath=";
        }
     
        this.data.push(url+result.response); 
        this.savedata.push(result.response);
        console.log(result.data);

      }, (err) => {
        console.log(err);
      });
    
  }

  // 根据url获取文件类型  
  getFileType(fileUrl: string): string {  
    return fileUrl.substring(fileUrl.lastIndexOf('.') + 1, fileUrl.length).toLowerCase();  
  }  
  // 根据url获取文件名(包含文件类型)  
  getFileName(fileUrl: string): string {  
    return fileUrl.substring(fileUrl.lastIndexOf('/') + 1, fileUrl.length).toLowerCase();  
  }  
   openModal() {
    
   let array=this.photos;
   for(var i=0;i<array.length;i++){
        var obje= array[i];
        obje.title=i+1+"/"+array.length;
        array[i]=obje;
   }
    let modal = this.modalCtrl.create(GalleryModal, {
      photos:  array,
      initialSlide: 0, // The second image
    });
    modal.present();
  }
  deletimg(imagename,index){
   
   
    let name=imagename.split("=");
    let alerts = this.alertCtrl.create({
      title:'提示信息',
      subTitle:'你真的忍心把我从生命中抹去吗？',
      buttons:['取消',
        {
          text:'确定',
          handler:()=>{
            this.data.splice(index,1);
            this.savedata.splice(index,1);
            this.worksProvider.deleteimg(name[1]).subscribe((res)=>{
              
                
            }, (err) => {
          
            });
            console.log('确定按钮被点击')
          }
        }]
    })
    alerts.present();
  }
}
