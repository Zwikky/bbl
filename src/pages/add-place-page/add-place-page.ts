import { IonicPage } from 'ionic-angular';
import { Component, Injector } from '@angular/core';
import { ActionSheetController, Platform, Events, NavController } from 'ionic-angular';
import { BasePage } from '../base-page/base-page';
import { Place } from '../../providers/place-service';
import { MapStyle } from '../../providers/map-style';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ParseFile } from '../../providers/parse-file-service';
import { BrowserTab } from '@ionic-native/browser-tab';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Category } from '../../providers/categories';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameraPosition, GoogleMap, GoogleMaps, GoogleMapsEvent, Marker,
  MarkerOptions, LatLng, Geocoder, GeocoderRequest, GeocoderResult } from '@ionic-native/google-maps';
import { DashboardPage } from '../dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-add-place-page',
  templateUrl: 'add-place-page.html'
})
export class AddPlacePage extends BasePage {

  form: FormGroup;
  categories: any;
  private map: GoogleMap;
  private marker: Marker;
  trans: any;
  isViewLoaded: boolean;

  isUpload1: boolean = true;
  isUpload2: boolean = true;
  isUpload3: boolean = true;
  isUpload4: boolean = true;

  didAgree: boolean = false;

  constructor(injector: Injector,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private nav: NavController,
    private place: Place,
    private inAppBrowser: InAppBrowser,
    private browserTab: BrowserTab,
    private geolocation: Geolocation,
    private googleMaps: GoogleMaps,
    private camera: Camera,
    private events: Events,
    private actionSheetCtrl: ActionSheetController) {

    super(injector);

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      person: new FormControl('', Validators.required),
      phone2: new FormControl(''),
      email: new FormControl('', Validators.email),
      hours: new FormControl('', Validators.required),
      office: new FormControl(''),
      weekend: new FormControl(''),
      sunday: new FormControl(''),
      website: new FormControl('http://')
    });

    let trans = ['PROFILE_UPDATED', 'PROFILE_UPDATE_ERROR', 'CAMERA', 'CANCEL',
      'CHOOSE_AN_OPTION', 'PHOTO_LIBRARY', 'FILE_UPLOADED', 'ERROR_FILE_UPLOAD'];

    this.translate.get(trans).subscribe(values => {
      this.trans = values;
    });

    this.events.subscribe('onMenuOpened', (e) => {
      if (this.map) {
        this.map.setClickable(false);
      }
    });

    this.events.subscribe('onMenuClosed', (e) => {
      if (this.map) {
        this.map.setClickable(true);
      }
    });
  }

  enableMenuSwipe() {
    return true;
  }

  ionViewWillUnload() {

    this.isViewLoaded = false;

    if (this.map) {
      this.map.clear();
      this.map.setZoom(1);
      this.map.setCenter(new LatLng(0, 0));
    }
  }

  onAgree(){
    if(this.didAgree == true){
      this.didAgree = false;
    }else{
      this.didAgree = true;
    } 
    
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

  ionViewDidLoad() {

    this.isViewLoaded = true;

    Category.load().then(categories => {
      this.categories = categories;
    });

    if (this.platform.is('cordova')) {

      this.map = new GoogleMap('map_add', {
        //styles: MapStyle.light(),
        //backgroundColor: '#333333'
      });

      let markerOptions: MarkerOptions = {
        position: new LatLng(0, 0),
        icon: 'yellow'
      };

      this.map.addMarker(markerOptions).then((marker: Marker) => {
        this.marker = marker;
      });

      this.map.one(GoogleMapsEvent.MAP_READY);
      this.map.setMyLocationEnabled(true);

      this.map.on(GoogleMapsEvent.MY_LOCATION_BUTTON_CLICK).subscribe((map: GoogleMap) => {

        if (this.isViewLoaded) {

          this.map.getCameraPosition().then((camera: CameraPosition) => {

            let target: LatLng = <LatLng> camera.target;
            this.marker.setPosition(target);
          });
        }

      });

      this.map.on(GoogleMapsEvent.CAMERA_CHANGE).subscribe(camera => {
        this.marker.setPosition(camera.target);
      });
    }
  }

  onSearchAddress(event: any) {

    let query = event.target.value;

    let request: GeocoderRequest = {
      address: query
    };

    let geocoder = new Geocoder;
    geocoder.geocode(request).then((results: GeocoderResult) => {

      // create LatLng object
      let target: LatLng = new LatLng(
        results[0].position.lat,
        results[0].position.lng
      );

      // create CameraPosition
      let position: CameraPosition = {
        target: target,
        zoom: 10
      };

      // move the map camera to position
      this.map.moveCamera(position);

      // update marker position
      this.marker.setPosition(target);
    });
  }

  chooseImage(sourceType: number) {

    let options: CameraOptions = {
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 80,
    }
    this.camera.getPicture(options).then((imageData) => {

      this.showLoadingView();

      ParseFile.upload(imageData).then(file => {
        this.place.image = file;
        this.showContentView();
        this.showToast(this.trans.FILE_UPLOADED);
      }, error => {
        this.showContentView();
        this.showToast(this.trans.ERROR_FILE_UPLOAD);
      })
    });
  }

  onUpload() {

    let actionSheet = this.actionSheetCtrl.create({
      title: this.trans.CHOOSE_AN_OPTION,
      buttons: [{
        text: this.trans.PHOTO_LIBRARY,
        handler: () => {
          this.chooseImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          this.isUpload1 = false;
        }
      }, {
        text: this.trans.CAMERA,
        handler: () => {
          this.chooseImage(this.camera.PictureSourceType.CAMERA);
        }
      },{
        text: this.trans.CANCEL,
        role: 'cancel'
      }]
    });
    actionSheet.present();
  }


  //Image Two
  chooseImage2(sourceType: number) {
    
        let options: CameraOptions = {
          sourceType: sourceType,
          destinationType: this.camera.DestinationType.DATA_URL,
          targetWidth: 1000,
          targetHeight: 1000,
          quality: 80,
        }
        this.camera.getPicture(options).then((imageData) => {
    
          this.showLoadingView();
    
          ParseFile.upload(imageData).then(file => {
            this.place.imageTwo = file;
            this.showContentView();
            this.showToast(this.trans.FILE_UPLOADED);
            this.form.removeControl('pic2');
          }, error => {
            this.showContentView();
            this.showToast(this.trans.ERROR_FILE_UPLOAD);
          })
        });
      }
    
      onUpload2() {
        
    
        let actionSheet = this.actionSheetCtrl.create({
          title: this.trans.CHOOSE_AN_OPTION,
          buttons: [{
            text: this.trans.PHOTO_LIBRARY,
            handler: () => {
              this.chooseImage2(this.camera.PictureSourceType.PHOTOLIBRARY);        
              this.isUpload2 = false;
            }
          }, {
            text: this.trans.CAMERA,
            handler: () => {
              this.chooseImage2(this.camera.PictureSourceType.CAMERA);
            }
          },{
            text: this.trans.CANCEL,
            role: 'cancel'
          }]
        });
        actionSheet.present();
      }

  //Image Three
  chooseImage3(sourceType: number) {
    
        let options: CameraOptions = {
          sourceType: sourceType,
          destinationType: this.camera.DestinationType.DATA_URL,
          targetWidth: 1000,
          targetHeight: 1000,
          quality: 80,
        }
        this.camera.getPicture(options).then((imageData) => {
    
          this.showLoadingView();
    
          ParseFile.upload(imageData).then(file => {
            this.place.imageThree = file;
            this.showContentView();
            this.showToast(this.trans.FILE_UPLOADED);
          }, error => {
            this.showContentView();
            this.showToast(this.trans.ERROR_FILE_UPLOAD);
          })
        });
        }
  
  
  onUpload3() {
    
        let actionSheet = this.actionSheetCtrl.create({
          title: this.trans.CHOOSE_AN_OPTION,
          buttons: [{
            text: this.trans.PHOTO_LIBRARY,
            handler: () => {
              this.chooseImage3(this.camera.PictureSourceType.PHOTOLIBRARY);
              this.isUpload4 = false;
            }
          }, {
            text: this.trans.CAMERA,
            handler: () => {
              this.chooseImage3(this.camera.PictureSourceType.CAMERA);
              this.isUpload3 = false;
            }
          },{
            text: this.trans.CANCEL,
            role: 'cancel'
          }]
        });
        actionSheet.present();
      }

    //Image Four
    chooseImage4(sourceType: number) {
      
          let options: CameraOptions = {
            sourceType: sourceType,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000,
            quality: 80,
          }
          this.camera.getPicture(options).then((imageData) => {
      
            this.showLoadingView();
      
            ParseFile.upload(imageData).then(file => {
              this.place.imageFour = file;
              this.showContentView();
              this.showToast(this.trans.FILE_UPLOADED);
            }, error => {
              this.showContentView();
              this.showToast(this.trans.ERROR_FILE_UPLOAD);
            })
          });
          }
    
    
    onUpload4() {
      
          let actionSheet = this.actionSheetCtrl.create({
            title: this.trans.CHOOSE_AN_OPTION,
            buttons: [{
              text: this.trans.PHOTO_LIBRARY,
              handler: () => {
                this.chooseImage4(this.camera.PictureSourceType.PHOTOLIBRARY);
                this.isUpload4 = false;
              }
            }, {
              text: this.trans.CAMERA,
              handler: () => {
                this.chooseImage4(this.camera.PictureSourceType.CAMERA);
              }
            },{
              text: this.trans.CANCEL,
              role: 'cancel'
            }]
          });
          actionSheet.present();
        }
  



  onSubmit() {

    this.place.title = this.form.value.name;
    this.place.category = this.form.value.category;
    this.place.description = this.form.value.description;
    this.place.address = this.form.value.address;
    this.place.website = this.form.value.website;
    this.place.phone = this.form.value.phone;
    this.place.phone2 = this.form.value.phone2;
    this.place.hours = this.form.value.hours;
    this.place.email = this.form.value.email;
    this.place.office = this.form.value.office;
    this.place.weekend = this.form.value.weekend;
    this.place.sunday = this.form.value.sunday;

    //this.showToast('Patience...Loading')
    this.showLoadingView();
        
    const options: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000
    };

   this.geolocation.getCurrentPosition(options).then(pos => {
   
      
      this.place.location = [pos.coords.latitude,pos.coords.longitude];

      this.place.save().then(place => {
            this.showContentView();
            this.translate.get('PLACE_ADDED').subscribe(str => this.showToast(str));
            this.nav.push(DashboardPage);
          }, error => {
            this.showContentView();
            this.translate.get('Error Adding').subscribe(str => this.showToast(str));
          });
    });

  }

}
