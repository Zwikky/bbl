import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagePage } from './message';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    MessagePage,
  ],
  imports: [
    IonicPageModule.forChild(MessagePage),
    SharedModule
  ],
  exports: [
    MessagePage
  ]
})
export class MessagePageModule {}
