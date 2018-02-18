import { Component, ViewChild } from '@angular/core';
import { Nav, App, Platform, AlertController, ModalController, ToastController, Events } from 'ionic-angular';

import { OneSignal } from '@ionic-native/onesignal';


import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HeaderColor } from '@ionic-native/header-color';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { DashboardPage } from '../pages/dashboard/dashboard';


import Parse from 'parse';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from './app.config';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BrowserTab } from '@ionic-native/browser-tab';

import { User } from '../providers/user-service';
import { LocalStorage } from '../providers/local-storage';
import { Preference } from '../providers/preference';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  user: User;
  trans: any;

  pages: Array<{ title: string, icon: string, component: any }>;

  constructor(public platform: Platform,
    private events: Events,
    private storage: LocalStorage,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private inAppBrowser: InAppBrowser,
    private browserTab: BrowserTab,
    private preference: Preference,
    private notification: OneSignal,
    private socialSharing: SocialSharing,
    private app: App,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private googleAnalytics: GoogleAnalytics,
    private headerColor: HeaderColor,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController, 
    private admobFree : AdMobFree) {

    this.initializeApp();
  }
  

  onMenuOpened() {
    this.events.publish('onMenuOpened');
  }

  onMenuClosed() {
    this.events.publish('onMenuClosed');
  }

  buildMenu() {

    let trans = ['CATEGORIES', 'MAP', 'ADD_PLACE','MY_BUSINESS' ,'MY_FAVORITES',
    'SETTINGS', 'LOGOUT', 'LOGGED_OUT', 'PROFILE', 'TEES'];

    this.translate.get(trans).subscribe(values => {

      this.trans = values;

      this.pages = [
        { title: values.MY_BUSINESS, icon: 'briefcase', component: 'BusinessPage' },
        { title: values.MY_FAVORITES, icon: 'heart', component: 'FavoritesPage' },
        { title: values.SETTINGS, icon: 'settings', component: 'SettingsPage' }
      ];

      if (User.getCurrentUser()) {
        this.pages.push({ title: values.PROFILE, icon: 'contact', component: 'ProfilePage' })
        this.pages.push({ title: values.LOGOUT, icon: 'exit', component: null })
      }

    });
  }

  viewTees(){
      
      this.browserTab.isAvailable().then((isAvailable: boolean) => {
  
        if (isAvailable) {
          this.browserTab.openUrl('https://drive.google.com/file/d/1yIKmG9S2xPQpPMA9iu5IWKW46fqIVkvp/view');
        } else {
          this.inAppBrowser.create('https://drive.google.com/file/d/1yIKmG9S2xPQpPMA9iu5IWKW46fqIVkvp/view', '_system');
        }
  
      });
  
    
  }

  doContact() {
    let alert = this.alertCtrl.create({
      title: 'Contact Options',
      message: 'Please choose method to use.',
      buttons: [
        {
          text: 'Whatsapp',
          role: 'cancel',
          handler: () => {
            this.socialSharing.shareViaWhatsApp('Black Business Locator:', null, null);
          }
        },
        {
          text: 'Email',
          handler: () => {
            var email = ['info@blackbusinesslocator.co.za'];
            this.socialSharing.shareViaEmail('Help from BBL', 'Help from BBL', email , null, null, null);
          }
        }
      ]
    });
    alert.present();
  }


  initializeApp() {


    this.events.subscribe('user:login', (userEventData) => {
      this.user = userEventData[0];
      this.buildMenu();
    });

    this.events.subscribe('user:logout', () => {
      this.user = null;
      this.buildMenu();
    });

    
    this.events.subscribe('lang:change', (e) => {
      this.buildMenu();
    });

    this.translate.setDefaultLang(AppConfig.DEFAULT_LANG);


    this.storage.lang.then(val => {

      let lang = val || AppConfig.DEFAULT_LANG;

      this.translate.use(lang);
      this.storage.lang = lang;
      this.preference.lang = lang;

      this.storage.skipIntroPage.then((skipIntroPage) => {
        this.rootPage = skipIntroPage ? 'DashboardPage' : 'WalkthroughPage';
      }).catch((e) => console.log(e));

      this.buildMenu();
    }).catch((e) => console.log(e));

    this.storage.unit.then(val => {
      let unit = val || AppConfig.DEFAULT_UNIT;

      this.storage.unit = unit;
      this.preference.unit = unit;
    }).catch((e) => console.log(e));

    this.storage.mapStyle.then(val => {

      let mapStyle = val || AppConfig.DEFAULT_MAP_STYLE;

      this.storage.mapStyle = mapStyle;
      this.preference.mapStyle = mapStyle;
    }).catch((e) => console.log(e));

    Parse.serverURL = AppConfig.SERVER_URL;
    Parse.initialize(AppConfig.APP_ID);

    User.getInstance();
    this.user = User.getCurrentUser();

    if (this.user) {
      this.user.fetch();
    }

    this.platform.ready().then(() => {
      if (AppConfig.TRACKING_ID) {
        this.googleAnalytics.startTrackerWithId(AppConfig.TRACKING_ID);
        this.googleAnalytics.trackEvent('', 'App opened');
        this.googleAnalytics.debugMode();
        this.googleAnalytics.enableUncaughtExceptionReporting(true);
      }

      if (AppConfig.HEADER_COLOR && this.platform.is('android')) {
        this.headerColor.tint(AppConfig.HEADER_COLOR);
      }

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.notification.startInit("e560c194-d23c-47e0-bfa2-d3e60e7631b1", "729759571889");
      this.notification.inFocusDisplaying(this.notification.OSInFocusDisplayOption.Notification);
      this.notification.setSubscription(true);
      this.notification.handleNotificationReceived().subscribe(() => {
          // your code after Notification received.
      });
      this.notification.handleNotificationOpened().subscribe(() => {
          // your code to handle after Notification opened
      });
      this.notification.endInit();
       
      var lastTimeBackPress=0;
      var timePeriodToExit=2000;

       this.platform.registerBackButtonAction(() => {
     // get current active page
          let view = this.nav.getActive();
          if(view.component.name=="DashboardPage"){
                if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                  this.platform.exitApp(); //Exit from app
                    } else {
                                  let toast = this.toastCtrl.create({
                                      message: 'Press back again to exit App?',
                                      duration: 3000,
                                      position: 'bottom'
                                    });
                                  toast.present();     
                            lastTimeBackPress=new Date().getTime();
                        }
                
        }else{
          this.nav.setPages([
            { page: DashboardPage }
          ]);
            
    }
  });

  this.showAdmobBannerAds();


           
    });
  }

  showAdmobBannerAds(){
    const bannerConfig: AdMobFreeBannerConfig = {
      id: 'ca-app-pub-1381209293479508~5759002142', 
      isTesting: false,
      autoShow: true
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare()
    .then(() => {
      //
    })
    .catch(e => console.log(e));    
    }      


  openPage(page) {

    if ((page.component === 'FavoritesPage' || page.component === 'BusinessPage' ||page.component === 'AddPlacePage') && !User.getCurrentUser()) {

      this.nav.push('SignInPage');

    } else if (page.component === null && User.getCurrentUser()) {

      User.logout().then(success => {

        let toast = this.toastCtrl.create({
          message: this.trans.LOGGED_OUT,
          duration: 3000
        });

        toast.present();

        this.user = null;
        this.buildMenu();
      }, error => console.log(error));

    } else {
      this.nav.setRoot(page.component);
    }
  }
}
