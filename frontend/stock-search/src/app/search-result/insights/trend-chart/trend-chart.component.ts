import { Component, Input, OnInit } from '@angular/core';
import { ResultService } from 'src/app/shared/results.service';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-trend-chart',
  templateUrl: './trend-chart.component.html',
  styleUrls: ['./trend-chart.component.css']
})
export class TrendChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  // @Input() trendChartOptions: Highcharts.Options;
  @Input() trendChartOptions: Highcharts.Options = {
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
