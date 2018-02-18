import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinessPage } from './business';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    BusinessPage,
  ],
  imports: [
    IonicPageModule.forChild(BusinessPage),
    SharedModule
  ],
  exports: [
    BusinessPage
  ]
})
export class BusinessPageModule {}
