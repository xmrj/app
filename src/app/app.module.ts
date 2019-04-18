import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Dialogs } from '@ionic-native/dialogs';
import { AppVersion } from '@ionic-native/app-version';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer,  FileTransferObject } from '@ionic-native/file-transfer';
import { InAppBrowser} from "@ionic-native/in-app-browser";

import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler,IonicModule } from 'ionic-angular';
import { JPush } from '@jiguang-ionic/jpush';

import { Items } from '../mocks/providers/items';
import { Settings, User, Api } from '../providers';
import { MyApp } from './app.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignaturePadPage } from '../pages/signature-pad/signature-pad';
import { SignForPcPage } from '../pages/sign-for-pc/sign-for-pc';
import {ScreenOrientation} from "@ionic-native/screen-orientation";

import {ComponentsModule} from '../components/components.module';
import { HttpModule,JsonpModule } from '@angular/http';
import { WorkmapProvider } from '../providers/workmap/workmap';  /*数据请求模块*/

import { ApprovalServiceProvider } from '../providers/approval-service/approval-service';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';

import { ConferenceData } from '../providers/conference-data';
import { OnlinemapapiProvider } from '../providers/onlinemapapi/onlinemapapi';
import { OnlinemapProvider } from '../providers/onlinemap/onlinemap';
import { NativeServiceProvider } from '../providers/native-service/native-service';
import { AppUpdateServiceProvider } from '../providers/app-update-service/app-update-service';
import { WorksProvider } from '../providers/works/works';
import { PushMsgProvider } from '../providers/push-msg/push-msg';
import { ImageServiceProvider } from '../providers/image-service/image-service';
import * as ionicGalleryModal from 'ionic-gallery-modal';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { TaskFilterPageModule} from '../pages/task-filter/task-filter.module';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    SignaturePadPage,
    SignForPcPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    TaskFilterPageModule,
    HttpModule,
    JsonpModule,SignaturePadModule,
    ionicGalleryModal.GalleryModalModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages:'true'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignaturePadPage,
    SignForPcPage,
  ],
  providers: [
    Api,
    Items,
    User,
    Camera,
    SplashScreen,
    StatusBar,JPush,Dialogs,QRScanner,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    WorkmapProvider,ApprovalServiceProvider,LocalStorageProvider,ConferenceData,
    OnlinemapapiProvider,
    OnlinemapProvider,InAppBrowser,
    NativeServiceProvider,AppVersion,FileTransfer,FileTransferObject,FileOpener,File,
    AppUpdateServiceProvider,
    WorksProvider,
    PushMsgProvider,
    ImageServiceProvider,ScreenOrientation,
    {provide: HAMMER_GESTURE_CONFIG ,
     useClass: ionicGalleryModal.GalleryModalHammerConfig},
  ]
})
export class AppModule { }
