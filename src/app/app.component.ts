import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AppVersion } from '@ionic-native/app-version';
//import { Deeplinks } from '@ionic-native/deeplinks';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';
import { JPush } from '@jiguang-ionic/jpush';
import { NativeServiceProvider } from '../providers/native-service/native-service';
import { AppUpdateServiceProvider } from '../providers/app-update-service/app-update-service'; 


import { FirstRunPage } from '../pages';
import { Settings } from '../providers';

@Component({
  template: `<ion-menu [hidden]="true" [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Pages</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`,
  providers: [ AppVersion ]
})
export class MyApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Cards', component: 'CardsPage' },
    { title: 'Content', component: 'ContentPage' },
    { title: 'Login', component: 'LoginPage' },
    { title: 'Signup', component: 'SignupPage' },
    { title: 'Master Detail', component: 'ListMasterPage' },
    { title: 'Menu', component: 'MenuPage' },
    { title: 'Settings', component: 'SettingsPage' },
    { title: 'Search', component: 'SearchPage' },
    { title: 'map', component: 'MapPage' },
    { title: 'Approval', component: 'ApprovalPage' },
    { title: 'ApprovalFilter', component: 'ApprovalFilterPage' },
    { title: 'TaskDetail', component: 'TaskDetailPage' },	
    { title: 'TaskFilter', component: 'TaskFilterPage' },	
    
  ]

  constructor(
    private translate: TranslateService, 
    private platform: Platform, 
    
    private config: Config, 
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen,
    jpush:JPush,
    public appVersion:AppVersion,
    private nativeService :NativeServiceProvider,
    private appUpdateService :AppUpdateServiceProvider,
    //private deeplinks: Deeplinks
  ) {
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      document.addEventListener("jpush.openNotification",(event:any)=>{
        var content;
        if(platform.is('android')){
          content=event.alert;
        }
        this.nav.push('MsgCenterPage')
      },false);
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (platform.is('ios')||platform.is('android')) {
        jpush.init();
        jpush.setDebugMode(true);
        // 更新，但是好像没运行
        this.appVersion.getVersionCode().then((versionCode: string) => {  
          this.appUpdateService.getLastestVersion().subscribe(data => {
              if(data.appCode!=null&&parseInt(data.appCode)>parseInt(versionCode)){             
                this.nativeService.detectionUpgrade(data.data.androidDownload, true); //提示升级 
              } 
          });  
        }).catch(err => {  
            console.log('getVersionNumber:' + err);  
        }); 

      }

    });
    
    this.initTranslate();
  }


  // ngAfterViewInit() {
  //   this.platform.ready().then(() => {
  //     // Convenience to route with a given nav
  //     this.deeplinks.routeWithNavController(this.nav, {
  //      // '/about-us': AboutPage,
  //      // '/universal-links-test': AboutPage,
  //      // '/products/:productId': ProductPage
  //     }).subscribe((match) => {
  //       console.log('Successfully routed', match);
  //     }, (nomatch) => {
  //       console.warn('Unmatched Route', nomatch);
  //     });
  //   })
  // }


  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
