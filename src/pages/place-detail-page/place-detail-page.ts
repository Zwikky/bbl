import { IonicPage } from 'ionic-angular';
import { Component, Injector} from '@angular/core';
import { ModalController, Events } from 'ionic-angular';
import { Place } from '../../providers/place-service';
import { Preference } from '../../providers/preference';
import { LocalStorage } from '../../providers/local-storage';
import { CallNumber } from '@ionic-native/call-number';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BrowserTab } from '@ionic-native/browser-tab';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BasePage } from '../base-page/base-page';
import { User } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-place-detail-page',
  templateUrl: 'place-detail-page.html'
})
export class PlaceDetailPage extends BasePage {

  images: Array<any>;
  place: Place;
  location: any;
  unit: any;

  constructor(injector: Injector,
    private modalCtrl: ModalController,
    private storage: LocalStorage,
    private preference: Preference,
    private callNumber: CallNumber,
    private geolocation: Geolocation,
    private inAppBrowser: InAppBrowser,
    private browserTab: BrowserTab,
    private launchNavigator: LaunchNavigator,
    private socialSharing: SocialSharing,
    private events: Events) {

      super(injector);

      const options: GeolocationOptions = {
        enableHighAccuracy: true,
        timeout: 10000
      };

      this.geolocation.getCurrentPosition(options).then(pos => {
        this.location = pos.coords;
      });

      this.place = this.navParams.data;
      this.unit = preference.unit;
      this.images = [];

      if (this.place.image) {
        this.images.push(this.place.image);
      }

      if (this.place.imageTwo) {
        this.images.push(this.place.imageTwo);
      }

      if (this.place.imageThree) {
        this.images.push(this.place.imageThree);
      }

      if (this.place.imageFour) {
        this.images.push(this.place.imageFour);
      }
  }

  enableMenuSwipe() {
    return false;
  }

  ionViewDidLoad() {}

  openSignUpModal() {
    this.navigateTo('SignInPage');
  }

  openAddReviewModal() {
    let modal = this.modalCtrl.create('AddReviewPage', { place: this.place });
    modal.present();
  }

  onLike () {

    if (User.getCurrentUser()) {
      Place.like(this.place);
      this.showToast('Liked');
    } else {
      this.openSignUpModal();
    }
  }

  onRate () {
    if (User.getCurrentUser()) {
      this.openAddReviewModal();
    } else {
      this.openSignUpModal();
    }
  }

  onShare () {
    this.socialSharing.share("Get more info on Black Business Locator about: " + this.place.title, this.place.title + " on Black Business Locator", null, "https://play.google.com/store/apps/details?id=net.smartdev.bbl");
  }

  onCall () {
    this.callNumber.callNumber(this.place.phone, true)
  }

  onCallTwo () {
    this.callNumber.callNumber(this.place.phone2, true)
  }

  openUrl () {
    
    this.browserTab.isAvailable().then((isAvailable: boolean) => {

      if (isAvailable) {
        this.browserTab.openUrl(this.place.website);
      } else {
        this.inAppBrowser.create(this.place.website, '_system');
      }

    });

  }

  goToMap() {
    this.launchNavigator.navigate([ this.place.location.latitude, this.place.location.longitude ], {
      start: [this.location.latitude, this.location.longitude]
    });
  }

  goToReviews() {
    this.navigateTo('ReviewsPage', this.place);
  }

}
