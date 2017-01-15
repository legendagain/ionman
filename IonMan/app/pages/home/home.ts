import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Alert, NavController } from 'ionic-angular';
import { DifficultyMenuPage } from '../difficulty-menu/difficulty-menu';
import { FavoritesPage } from '../favorites/favorites';
import { ProgressPage } from '../progress/progress';
import { Database } from '../../models/database';

@Component({
    templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
    constructor(private nav: NavController, private http: Http) { }

    onLink(url: string) {
        window.open(url);
    }

    goToMenu() {
        this.nav.push(DifficultyMenuPage);
    }

    goToFavorites() {
        this.nav.push(FavoritesPage);
    }

    goToProgress() {
        this.nav.push(ProgressPage);
    }

    goToHelp() {
        let alert = Alert.create({
            title: 'Help',
            subTitle: 'Tap on "Let\'s play!", select your difficulty, level, time per question, and you\'re ready to play!<br /><br />\
If you have any questions feel free to e-mail <a href="mailto:mathieu.awm@gmail.com">Matthew</a> or <a href="mailto:ogawa@eedu.jp">Satoshi</a>.',
            buttons: ['OK']
        });
        this.nav.present(alert);
    }
}