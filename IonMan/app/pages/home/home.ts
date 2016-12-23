import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DifficultyMenuPage } from '../difficulty-menu/difficulty-menu';
import { FavoritesPage } from '../favorites/favorites';

@Component({
    templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
    constructor(private nav: NavController) {
    }
    onLink(url: string) {
        window.open(url);
    }

    goToMenu() {
        this.nav.push(DifficultyMenuPage);
    }

    goToFavorites() {
        this.nav.push(FavoritesPage);
    }
}