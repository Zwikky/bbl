import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeaturedPage } from './featured';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    FeaturedPage,
  ],
  imports: [
    IonicPageModule.forChild(FeaturedPage),
    SharedModule
  ],
  exports: [
    FeaturedPage
  ]
})
export class FeaturedPageModule {}
