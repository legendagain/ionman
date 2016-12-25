import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Platform, ionicBootstrap } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { HomePage } from './pages/home/home';
import { Database } from './models/database';

@Component({
    template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
    rootPage: any = HomePage;

    constructor(platform: Platform, http: Http) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Database.init(http);
        });
    }
}

ionicBootstrap(MyApp);
