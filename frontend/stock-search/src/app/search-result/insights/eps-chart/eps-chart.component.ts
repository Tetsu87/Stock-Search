import { Component, Input, OnInit } from '@angular/core';
import { ResultService } from 'src/app/shared/results.service';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-eps-chart',
  templateUrl: './eps-chart.component.html',
  styleUrls: ['./eps-chart.component.css']
})
export class EpsChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  // @Input() epsChartOptions: Highcharts.Options;
  @Input() epsChartOptions: Highcharts.Options = {
    series: [
      {
        type: 'line',
        pointInterval: 24 * 3600 * 1000,
        data: [1, 2, 3, 4, 5]
      },
    ],
  };

  constructor(private resultService: ResultService) { }

  ngOnInit(): void {
  }


}
