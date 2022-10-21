import { Component, OnInit, Input, EventEmitter, Output,  OnChanges,
  SimpleChanges } from '@angular/core';
import { ResultService } from 'src/app/shared/results.service';
import { ActivatedRoute } from '@angular/router';
import { Description } from 'src/app/model/description';
import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';

// import HC_exporting from 'highcharts/modules/exporting';
// HC_exporting(Highcharts); // this makes exporting function available automatically
// declare var require: any;
// require('highcharts/indicators/indicators')(Highcharts);
// require('highcharts/indicators/volume-by-price')(Highcharts);

IndicatorsCore(Highcharts);
vbp(Highcharts);

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit,OnChanges {
  // @Input() userInput = '';
  @Input() userInputFixed = '';
  @Output() getHistoricalDailyDataCompletedOn = new EventEmitter<string>();
  @Output() getHistoricalDailyDataReset = new EventEmitter<string>();
  descriptions: Description;
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  chartOptions: Highcharts.Options;


  title: string = '';
  ohlc: any[] = [];
  // ohlc: [number,number,number,number,number] = [];
  volume: any[] = [];
  groupingUnits = [
    ['week', [1]],
    ['month', [1, 2, 3, 4, 6]],
  ];

 

  constructor(
    private resultService: ResultService,
    private route: ActivatedRoute,
  ) {}

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnInit(): void {
    console.log('ngOnInit chart called');
    // this.getDescription();
    this.getHistoricalDailyData();
  }

  updateCharts() {
    this.getHistoricalDailyData();
    // this.getDescription();
  }

  // maybe we dont need this
  // getDescription() {
  //   this.route.paramMap.subscribe((params) => {
  //     const descriptionObservable = this.resultService
  //       .getDescription(params.get('userInput'))
  //       .subscribe(
  //         (data) => {
  //           this.descriptions = data;
  //           this.title = this.descriptions.ticker;
  //         },
  //         (error) => {
  //           console.log('getDescription from chart error');
  //         },
  //         () => {
  //           console.log('getDescription from chart completed');
  //         }
  //       );
  //   });
  // }

  getHistoricalDailyData() {
    this.ohlc = []; // clear existing data
    this.volume = []; // clear existing data
    console.log("chart initialize before params");
    this.chartOptions = null; // initialize chartOptions
    console.log(this.chartOptions);
    this.route.paramMap.subscribe((params) => {
      console.log("chart initialize after params");
      this.chartOptions = null; // initialize chartOptions
      console.log(this.chartOptions);
      console.log("chart param subscribe reacting");
      console.log(this.chartOptions);
      // this.chartOptions = null;
      
      const ticker = params.get("userInput").toUpperCase();
      console.log("ticker is....: " + ticker);
      this.getHistoricalDailyDataReset.emit();
      const historicalDailyDataObservable = this.resultService
        .getHistoricalDailyData(ticker)
        .subscribe(
          (data) => {
            console.log('point 2');
            console.log(this.ohlc);
            console.log(this.volume);
            let dataLength = data?.t.length;
            for (let i = 0; i < dataLength; i++) {
              this.ohlc.push([
                data?.t[i] * 1000,
                data?.o[i],
                data?.h[i],
                data?.l[i],
                data?.c[i],
              ]);
              // console.log('point 3');
              this.volume.push([data?.t[i] * 1000, data?.v[i]]);
            }
            console.log(this.ohlc);
            console.log(this.volume);
            this.chartOptions = {
              // rangeSelector: {
              //   selected: 2,
              // },
              rangeSelector: {
                buttons: [
                  {
                    type: 'month',
                    count: 1,
                    text: '1m',
                  },
                  {
                    type: 'month',
                    count: 3,
                    text: '3m',
                  },
                  {
                    type: 'month',
                    count: 6,
                    text: '6m',
                  },
                  {
                    type: 'ytd',
                    text: 'YTD',
                  },
                  {
                    type: 'year',
                    count: 1,
                    text: '1y',
                  },
                  {
                    type: 'all',
                    text: 'All',
                  },
                ],
                selected: 2,
              },

              title: {
                text: ticker + ' Historical',
              },

              subtitle: {
                text: 'With SMA and Volume by Price technical indicators',
              },

              yAxis: [
                {
                  startOnTick: false,
                  endOnTick: false,
                  labels: {
                    align: 'right',
                    x: -3,
                  },
                  title: {
                    text: 'OHLC',
                  },
                  height: '60%',
                  lineWidth: 2,
                  resize: {
                    enabled: true,
                  },
                },
                {
                  labels: {
                    align: 'right',
                    x: -3,
                  },
                  title: {
                    text: 'Volume',
                  },
                  top: '65%',
                  height: '35%',
                  offset: 0,
                  lineWidth: 2,
                },
              ],

              tooltip: {
                split: true,
              },

              plotOptions: {
                series: {
                  dataGrouping: {
                    // units?: this.groupingUnits
                  },
                },
              },

              series: [
                {
                  type: 'candlestick',
                  // name: this.title,
                  name: ticker,
                  // id: ticker,
                  id: 'ohlc',
                  zIndex: 2,
                  data: this.ohlc,
                  // yAxis:1,
                },
                {
                  type: 'column',
                  name: 'Volume',
                  id: 'volume',
                  data: this.volume,
                  yAxis: 1,
                },
                {
                  type: 'vbp',
                  linkedTo: 'ohlc',
                  // linkedTo: ticker,
                  params: {
                    volumeSeriesID: 'volume',
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  zoneLines: {
                    enabled: false,
                  },
                },
                {
                  type: 'sma',
                  // linkedTo: ticker,
                  linkedTo: 'ohlc',
                  zIndex: 1,
                  marker: {
                    enabled: false,
                  },
                },
              ],
            };
          },
          (error) => {
            console.log('getCharts from charts error');
          },
          () => {
            console.log('getCharts from charts completed');
            this.getHistoricalDailyDataCompletedOn.emit();
            console.log('getCharts emit done');
            console.log(this.chartOptions);
          }
        );

      console.log('point 4 from chart dayon');
    });
  }

  // only update data ....for ngchanges
  // getHistoricalDailyData() {
  //     console.log('chart param subscribe reacting');
  //     console.log(this.chartOptions);
  //     console.log(this.userInputFixed);
  //     this.ohlc = []; // clear existing data
  //     this.volume = []; // clear existing data
  //     this.getHistoricalDailyDataReset.emit();
  //     this.resultService
  //       .getHistoricalDailyData(this.userInputFixed)
  //       .subscribe(
  //         (data) => {
  //           console.log('point 2');
  //           console.log(this.ohlc);
  //           console.log(this.volume);
  //           let dataLength = data?.t.length;
  //           for (let i = 0; i < dataLength; i++) {
  //             this.ohlc.push([
  //               data?.t[i] * 1000,
  //               data?.o[i],
  //               data?.h[i],
  //               data?.l[i],
  //               data?.c[i],
  //             ]);
  //             this.volume.push([data?.t[i] * 1000, data?.v[i]]);
  //           }
  //           console.log('point 3');
  //           console.log(this.ohlc);
  //           console.log(this.volume);
  //         },
  //         (error) => {
  //           console.log('getCharts from charts error');
  //         },
  //         () => {
  //           console.log('getCharts from charts completed');
  //           this.setChartOptions();
  //           this.getHistoricalDailyDataCompletedOn.emit();
  //           console.log('getCharts emit done');
  //           console.log(this.chartOptions);
  //         }
  //       );

     
  // }
  // getHistoricalDailyData() {
  //   console.log("start of getHistoricalDailyData");
  //   console.log(this.chartOptions);
  //   this.route.paramMap.subscribe((params) => {
  //     console.log('chart param subscribe reacting');
  //     console.log(this.chartOptions);
  //     // this.chartOptions = null;

  //     const ticker = params.get('userInput');
  //     this.title = params.get('userInput');
  //     this.ohlc = []; // clear existing data
  //     this.volume = []; // clear existing data
  //     this.getHistoricalDailyDataReset.emit();
  //     const historicalDailyDataObservable = this.resultService
  //       .getHistoricalDailyData(ticker)
  //       .subscribe(
  //         (data) => {
  //           console.log('point 2');
  //           console.log(this.ohlc);
  //           console.log(this.volume);
  //           let dataLength = data?.t.length;
  //           for (let i = 0; i < dataLength; i++) {
  //             this.ohlc.push([
  //               data?.t[i] * 1000,
  //               data?.o[i],
  //               data?.h[i],
  //               data?.l[i],
  //               data?.c[i],
  //             ]);
  //             this.volume.push([data?.t[i] * 1000, data?.v[i]]);
  //           }
  //           console.log('point 3');
  //           console.log(this.ohlc);
  //           console.log(this.volume);
  //         },
  //         (error) => {
  //           console.log('getCharts from charts error');
  //         },
  //         () => {
  //           console.log('getCharts from charts completed');
  //           this.setChartOptions();
  //           this.getHistoricalDailyDataCompletedOn.emit();
  //           console.log('getCharts emit done');
  //           console.log(this.chartOptions);
  //         }
  //       );

  //     console.log('point 4 from chart dayon');
  //   });
  // }

  // setChartOptions() {
  //   console.log("setChartOption starts");
  //   console.log(this.chartOptions);
  //   this.chartOptions.title = {
  //     text: 'TK GOGO!!',
  //   };
  //   this.chartOptions.series[0] = {
  //     type: 'candlestick',
  //     id: 'ohlc',
  //     zIndex: 2,
  //     name: this.userInputFixed,
  //     data: this.ohlc,
  //   };
  //   this.chartOptions.series[1] = {
  //     type: 'column',
  //     name: 'Volume',
  //     id: 'volume',
  //     data: this.volume,
  //     yAxis: 1,
  //   };
  //   console.log("from setChartOptions");
  //   console.log(this.chartOptions.series[0].data)
  //   console.log(this.chartOptions.series[1].data)
  // }
  // setChartOptions() {
  //   this.chartOptions = {
  //     // rangeSelector: {
  //     //   selected: 2,
  //     // },
  //     rangeSelector: {
  //       buttons: [
  //         {
  //           type: 'month',
  //           count: 1,
  //           text: '1m',
  //         },
  //         {
  //           type: 'month',
  //           count: 3,
  //           text: '3m',
  //         },
  //         {
  //           type: 'month',
  //           count: 6,
  //           text: '6m',
  //         },
  //         {
  //           type: 'ytd',
  //           text: 'YTD',
  //         },
  //         {
  //           type: 'year',
  //           count: 1,
  //           text: '1y',
  //         },
  //         {
  //           type: 'all',
  //           text: 'All',
  //         },
  //       ],
  //       selected: 2,
  //     },

  //     title: {
  //       text: this.title + ' Historical',
  //     },

  //     subtitle: {
  //       text: 'With SMA and Volume by Price technical indicators',
  //     },

  //     yAxis: [
  //       {
  //         startOnTick: false,
  //         endOnTick: false,
  //         labels: {
  //           align: 'right',
  //           x: -3,
  //         },
  //         title: {
  //           text: 'OHLC',
  //         },
  //         height: '60%',
  //         lineWidth: 2,
  //         resize: {
  //           enabled: true,
  //         },
  //       },
  //       {
  //         labels: {
  //           align: 'right',
  //           x: -3,
  //         },
  //         title: {
  //           text: 'Volume',
  //         },
  //         top: '65%',
  //         height: '35%',
  //         offset: 0,
  //         lineWidth: 2,
  //       },
  //     ],

  //     tooltip: {
  //       split: true,
  //     },

  //     plotOptions: {
  //       series: {
  //         dataGrouping: {
  //           // units?: this.groupingUnits
  //         },
  //       },
  //     },

  //     series: [
  //       {
  //         type: 'candlestick',
  //         // name: this.title,
  //         name: this.title,
  //         id: this.title,
  //         // id: 'ohlc',
  //         zIndex: 2,
  //         data: this.ohlc,
  //         // yAxis:1,
  //       },
  //       {
  //         type: 'column',
  //         name: 'Volume',
  //         id: 'volume',
  //         data: this.volume,
  //         yAxis: 1,
  //       },
  //       {
  //         type: 'vbp',
  //         // linkedTo: 'ohlc',
  //         linkedTo: this.title,
  //         params: {
  //           volumeSeriesID: 'volume',
  //         },
  //         dataLabels: {
  //           enabled: false,
  //         },
  //         zoneLines: {
  //           enabled: false,
  //         },
  //       },
  //       {
  //         type: 'sma',
  //         linkedTo: this.title,
  //         // linkedTo: 'ohlc',
  //         zIndex: 1,
  //         marker: {
  //           enabled: false,
  //         },
  //       },
  //     ],
  //   };
  // }

  // getHistoricalDailyData() {
  //   this.route.paramMap.subscribe((params) => {
  //     console.log("chart param subscribe reacting");
  //     console.log(this.chartOptions);
  //     // this.chartOptions = null;

  //     const ticker = params.get("userInput");
  //     this.getHistoricalDailyDataReset.emit();
  //     const historicalDailyDataObservable = this.resultService
  //     .getHistoricalDailyData(ticker)
  //     .subscribe(
  //       (data) => {
  //         let ohlc = []; // clear existing data
  //        let volume = []; // clear existing data
  //         console.log('point 2');
  //           console.log(this.ohlc);
  //           console.log(this.volume);
  //           let dataLength = data?.t.length;
  //           for (let i = 0; i < dataLength; i++) {
  //             ohlc.push([
  //               data?.t[i] * 1000,
  //               data?.o[i],
  //               data?.h[i],
  //               data?.l[i],
  //               data?.c[i],
  //             ]);
  //             // console.log('point 3');
  //             volume.push([data?.t[i] * 1000, data?.v[i]]);
  //           }
  //           console.log(ohlc);
  //           console.log(volume);
  //           this.chartOptions = {
  //             // rangeSelector: {
  //             //   selected: 2,
  //             // },
  //             rangeSelector: {
  //               buttons: [
  //                 {
  //                   type: 'month',
  //                   count: 1,
  //                   text: '1m',
  //                 },
  //                 {
  //                   type: 'month',
  //                   count: 3,
  //                   text: '3m',
  //                 },
  //                 {
  //                   type: 'month',
  //                   count: 6,
  //                   text: '6m',
  //                 },
  //                 {
  //                   type: 'ytd',
  //                   text: 'YTD',
  //                 },
  //                 {
  //                   type: 'year',
  //                   count: 1,
  //                   text: '1y',
  //                 },
  //                 {
  //                   type: 'all',
  //                   text: 'All',
  //                 },
  //               ],
  //               selected: 2,
  //             },

  //             title: {
  //               text: ticker + ' Historical',
  //             },

  //             subtitle: {
  //               text: 'With SMA and Volume by Price technical indicators',
  //             },

  //             yAxis: [
  //               {
  //                 startOnTick: false,
  //                 endOnTick: false,
  //                 labels: {
  //                   align: 'right',
  //                   x: -3,
  //                 },
  //                 title: {
  //                   text: 'OHLC',
  //                 },
  //                 height: '60%',
  //                 lineWidth: 2,
  //                 resize: {
  //                   enabled: true,
  //                 },
  //               },
  //               {
  //                 labels: {
  //                   align: 'right',
  //                   x: -3,
  //                 },
  //                 title: {
  //                   text: 'Volume',
  //                 },
  //                 top: '65%',
  //                 height: '35%',
  //                 offset: 0,
  //                 lineWidth: 2,
  //               },
  //             ],

  //             tooltip: {
  //               split: true,
  //             },

  //             plotOptions: {
  //               series: {
  //                 dataGrouping: {
  //                   // units?: this.groupingUnits
  //                 },
  //               },
  //             },

  //             series: [
  //               {
  //                 type: 'candlestick',
  //                 // name: this.title,
  //                 name: ticker,
  //                 id: ticker,
  //                 // id: 'ohlc',
  //                 zIndex: 2,
  //                 data: ohlc,
  //                 // yAxis:1,
  //               },
  //               {
  //                 type: 'column',
  //                 name: 'Volume',
  //                 id: 'volume',
  //                 data: volume,
  //                 yAxis: 1,
  //               },
  //               {
  //                 type: 'vbp',
  //                 // linkedTo: 'ohlc',
  //                 linkedTo: ticker,
  //                 params: {
  //                   volumeSeriesID: 'volume',
  //                 },
  //                 dataLabels: {
  //                   enabled: false,
  //                 },
  //                 zoneLines: {
  //                   enabled: false,
  //                 },
  //               },
  //               {
  //                 type: 'sma',
  //                 linkedTo: ticker,
  //                 // linkedTo: 'ohlc',
  //                 zIndex: 1,
  //                 marker: {
  //                   enabled: false,
  //                 },
  //               },
  //             ],
  //           };
  //         },
  //         (error) => {
  //           console.log('getCharts from charts error');
  //         },
  //         () => {
  //           console.log('getCharts from charts completed');
  //           this.getHistoricalDailyDataCompletedOn.emit();
  //           console.log('getCharts emit done');
  //           console.log(this.chartOptions);
  //         }
  //       );

  //     console.log('point 4 from chart dayon');
  //   });
  // }

  // original ver witout params
  // getDescription() {
  //   this.resultService.getDescription(this.userInput).subscribe((data) => {
  //     this.title = data.ticker;
  //   });
  // }

  // getHistoricalDailyData() {
  //   this.resultService
  //     .getHistoricalDailyData(this.userInput)
  //     .subscribe((data) => {
  //       console.log('point 2');
  //       this.ohlc = []; // clear existing data
  //       this.volume = []; // clear existing data
  //       console.log(this.ohlc);
  //       console.log(this.volume);
  //       let dataLength = data?.t.length;
  //       for (let i = 0; i < dataLength; i++) {
  //         this.ohlc.push([
  //           data?.t[i] * 1000,
  //           data?.o[i],
  //           data?.h[i],
  //           data?.l[i],
  //           data?.c[i],
  //         ]);
  //         console.log('point 3');
  //         this.volume.push([data?.t[i] * 1000, data?.v[i]]);
  //       }
  //       console.log(this.ohlc);
  //       console.log(this.volume);
  //       this.chartOptions = {
  //         // rangeSelector: {
  //         //   selected: 2,
  //         // },
  //         rangeSelector: {
  //           buttons: [
  //             {
  //               type: 'month',
  //               count: 1,
  //               text: '1m',
  //             },
  //             {
  //               type: 'month',
  //               count: 3,
  //               text: '3m',
  //             },
  //             {
  //               type: 'month',
  //               count: 6,
  //               text: '6m',
  //             },
  //             {
  //               type: 'ytd',
  //               text: 'YTD',
  //             },
  //             {
  //               type: 'year',
  //               count: 1,
  //               text: '1y',
  //             },
  //             {
  //               type: 'all',
  //               text: 'All',
  //             },
  //           ],
  //           selected: 2,
  //         },

  //         title: {
  //           text: this.title + ' Historical',
  //         },

  //         subtitle: {
  //           text: 'With SMA and Volume by Price technical indicators',
  //         },

  //         yAxis: [
  //           {
  //             startOnTick: false,
  //             endOnTick: false,
  //             labels: {
  //               align: 'right',
  //               x: -3,
  //             },
  //             title: {
  //               text: 'OHLC',
  //             },
  //             height: '60%',
  //             lineWidth: 2,
  //             resize: {
  //               enabled: true,
  //             },
  //           },
  //           {
  //             labels: {
  //               align: 'right',
  //               x: -3,
  //             },
  //             title: {
  //               text: 'Volume',
  //             },
  //             top: '65%',
  //             height: '35%',
  //             offset: 0,
  //             lineWidth: 2,
  //           },
  //         ],

  //         tooltip: {
  //           split: true,
  //         },

  //         plotOptions: {
  //           series: {
  //             dataGrouping: {
  //               // units?: this.groupingUnits
  //             },
  //           },
  //         },

  //         series: [
  //           {
  //             type: 'candlestick',
  //             name: this.title,
  //             id: 'ohlc',
  //             zIndex: 2,
  //             data: this.ohlc,
  //             // yAxis:1,
  //           },
  //           {
  //             type: 'column',
  //             name: 'Volume',
  //             id: 'volume',
  //             data: this.volume,
  //             yAxis: 1,
  //           },
  //           {
  //             type: 'vbp',
  //             linkedTo: 'ohlc',
  //             params: {
  //               volumeSeriesID: 'volume',
  //             },
  //             dataLabels: {
  //               enabled: false,
  //             },
  //             zoneLines: {
  //               enabled: false,
  //             },
  //           },
  //           {
  //             type: 'sma',
  //             linkedTo: 'ohlc',
  //             zIndex: 1,
  //             marker: {
  //               enabled: false,
  //             },
  //           },
  //         ],
  //       };
  //       console.log('point 4 from chart dayon');
  //     });
  // }
}
