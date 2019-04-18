import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the PdfPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pdf',
  templateUrl: 'pdf.html',
})
export class PdfPage {
  pdfjsframe:any
  url="";
  fileUrl : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private sanitizer: DomSanitizer) {
    this.url=navParams.get("url");
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl("assets/generic/web/viewer.html?file="+this.url);
   // this.pdfjsframe.contentWindow.document.getElementById("hide1").value = this.fileUrl;
  }

  ionViewDidLoad() {
    //var currCond = this.pdfjsframe.contentWindow.document.location.search;
    //currCond = currCond + "?file=" + this.url;
    //this.pdfjsframe.contentWindow.document.location.search = currCond;
  }
  ionViewDidEnter(){
   //this.openPdf();
  }
  openPdf()  {
    
            var _self = this;

                this.pdfjsframe = document.getElementById('pdfViewer');
   
                if (this.pdfjsframe != null) {
                   
                        _self.loadPdfDocument();
                        this.pdfjsframe.src="assets/generic/web/viewer.html?file="+this.url;
                }
    
           
        }
    
        loadPdfDocument() {
            //var pdfData = this.base64ToUint8Array(this.fileBase64);
           
            this.pdfjsframe.contentWindow.PDFViewerApplication.open(this.url);
        }
    
       
}
