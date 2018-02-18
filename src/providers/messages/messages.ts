import { Injectable } from '@angular/core';
import Parse from 'parse';

@Injectable()
export class Notification extends Parse.Object {

  constructor() {
    super('Notification');
  }

  static load(): Promise<Notification[]> {

    return new Promise((resolve, reject) => {
      let query = new Parse.Query(this);
      query.descending('createdAt')
      query.find().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get title(): string {
    return this.get('title');
  }

  get message() {
    return this.get('message');
  }

}

Parse.Object.registerSubclass('Notification', Notification);
