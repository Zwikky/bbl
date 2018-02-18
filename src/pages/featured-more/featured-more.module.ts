import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeaturedMorePage } from './featured-more';

@NgModule({
  declarations: [
    FeaturedMorePage,
  ],
  imports: [
    IonicPageModule.forChild(FeaturedMorePage),
  ],
  exports: [
    FeaturedMorePage
  ]
})
export class FeaturedMorePageModule {}
