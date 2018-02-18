import { IonicPage } from 'ionic-angular';
import { Component, Injector} from '@angular/core';
import { Notification } from '../../providers/messages/messages';
import { BasePage } from '../base-page/base-page';
import { User } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage extends BasePage {

  message: Notification;

  constructor(injector: Injector) {

      super(injector);

      this.message = this.navParams.data;
      

  }

  enableMenuSwipe() {
    return false;
  }

}
