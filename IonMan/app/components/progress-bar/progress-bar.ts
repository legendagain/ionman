// https://www.joshmorony.com/build-a-simple-progress-bar-component-in-ionic-2/
import { Component, Input } from '@angular/core';

@Component({
    selector: 'progress-bar',
    templateUrl: 'build/components/progress-bar/progress-bar.html'
})
export class ProgressBarComponent {

    @Input('timeGiven') timeGiven;
    @Input('timeLeft') timeLeft;
    constructor() {

    }

}