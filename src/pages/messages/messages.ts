import { IonicPage } from 'ionic-angular';
import { Component, Injector } from '@angular/core';
import { Events } from 'ionic-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Notification } from '../../providers/messages/messages';
import { BasePage } from '../base-page/base-page';
import { User } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage extends BasePage {

  private messages: Array<Notification>;

  constructor(injector: Injector,
    private events: Events,
    private diagnostic: Diagnostic) {
    super(injector);


  }

  enableMenuSwipe() {
    return true;
  }

  ionViewDidLoad() {
    this.showLoadingView();
    this.loadData();
  }

  goToMessage(Notification) {
    this.navigateTo('MessagePage', Notification);
  }

  loadData() {
    Notification.load().then(data => {
      this.messages = data;

      if (this.messages.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete();

    }, error => {

      if (error.code === 209) {
        User.logOut().then(
          res => this.events.publish('user:logout')),
          err => console.log(err);
      }

      this.showErrorView();
      this.onRefreshComplete();
    });
  }

  onReload(refresher) {
    this.refresher = refresher;
    this.loadData();
  }

}
