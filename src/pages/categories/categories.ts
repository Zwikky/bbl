import { IonicPage } from 'ionic-angular';
import { Component, Injector } from '@angular/core';
import { Events } from 'ionic-angular';
import { HttpModule, Http } from '@angular/http';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Category } from '../../providers/categories';
import { BasePage } from '../base-page/base-page';
import { User } from '../../providers/user-service';
import {FormControl} from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage extends BasePage {

  private categories: Array<Category>;
  searchTerm: string = '';
  public searchControl: FormControl;

  constructor(injector: Injector,
    private events: Events,
    public http: HttpModule,
    private locationAccuracy: LocationAccuracy,
    private diagnostic: Diagnostic) {
    super(injector);
    
    this.searchControl = new FormControl();

    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if (canRequest) {

        let priority = this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY;

        this.locationAccuracy.request(priority)
          .then(() => console.log('Request successful'))
          .catch((error) => {

            if (error && error.code !== this.locationAccuracy.ERROR_USER_DISAGREED) {
              this.translate.get('ERROR_LOCATION_MODE').subscribe((res: string) => {
                this.showConfirm(res).then(() => this.diagnostic.switchToLocationSettings());
              });
            }

          });
      }
    }).catch((err) => console.log(err));
  }

  enableMenuSwipe() {
    return true;
  }

  ionViewDidLoad() {
    this.showLoadingView();
    //this.loadData();
    this.setFilteredItems();

  }

  goToPlaces(category) {
    this.navigateTo('PlacesPage', category);
  }

  loadData() {
    Category.load().then(data => {
      this.categories = data;

      var searchTerm = '';

      if (this.categories.length) {
         
        this.categories = this.searchCatags(searchTerm)
       

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


searchCatags(searchTerm: any) {

  return this.categories.filter((item) => {
    return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

}

public setFilteredItems() {
  this.categories = this.searchCatags(this.searchTerm);
}

  onReload(refresher, searchTerm) {
    this.refresher = refresher;
  }

}
