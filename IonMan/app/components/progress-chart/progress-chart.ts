import { Component, Input } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@Component({
    selector: 'progress-chart',
    templateUrl: 'build/components/progress-chart/progress-chart.html'
})

export class ProgressChartComponent {
    @ViewChild('canvas') private canvas: ElementRef;
    @Input('correctPercentage') correctPercentage: number;

    public doughnutChartData: number[] = [];
    public doughnutChartType: string = 'doughnut';

    constructor() {
        this.doughnutChartData = [this.correctPercentage, this.correctPercentage - 100];
    }

    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }
}