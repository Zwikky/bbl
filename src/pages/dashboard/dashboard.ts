import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage{


  protected translate: TranslateService;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

  goToCategories(){
    this.navCtrl.push('CategoriesPage');
  }

  goToFeatured(){
    this.navCtrl.push('FeaturedPage');
  }

  goToProfile(){
    if (User.getCurrentUser()) {
      this.navCtrl.push('ProfilePage');
    } else {
      this.openSignUpModal();
    }
  }

  goToSearch(){
    this.navCtrl.push('MapPage');
  }

  goToMessages(){
    this.navCtrl.push('MessagesPage');
  }

  openSignUpModal() {
    this.navCtrl.push('SignInPage');
  }

  goToAdd(){    
    if (User.getCurrentUser()) {
      this.navCtrl.push('AddPlacePage');
    } else {
      this.openSignUpModal();
    }
  }

}
