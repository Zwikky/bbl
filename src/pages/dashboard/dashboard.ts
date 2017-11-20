import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

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

  goToProfile(){
    this.navCtrl.push('SignInPage');
  }

  goToSearch(){
    this.navCtrl.push('MapPage');
  }

  goToAdd(){
    this.navCtrl.push('AddPlacePage');
  }

}
