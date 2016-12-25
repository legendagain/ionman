import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController, NavController } from 'ionic-angular';
import { DifficultyMenuPage } from '../difficulty-menu/difficulty-menu';
import { FavoritesPage } from '../favorites/favorites';
import { Database } from '../../models/database';

@Component({
    templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
    constructor(
        private nav: NavController,
        private alertCtrl: AlertController,
        private http: Http) { }

    onLink(url: string) {
        window.open(url);
    }

    goToMenu() {
        this.nav.push(DifficultyMenuPage);
    }

    goToFavorites() {
        this.nav.push(FavoritesPage);
    }

    goToHelp() {
        let alert = this.alertCtrl.create({
            title: 'Help',
            subTitle: 'Tap on "Let\'s play!", select your difficulty, level, time per question, and you\'re ready to play!\n\n\
If you have any questions feel free to e-mail mathieu.awm@gmail.com or ogawa@eedu.jp',
            buttons: ['OK']
        });
        alert.present();
    }
}