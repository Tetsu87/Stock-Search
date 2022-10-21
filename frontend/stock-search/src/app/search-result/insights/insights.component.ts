import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Description } from 'src/app/model/description';
import { RecommendationTrends } from 'src/app/model/recommendationTrends';
import { SocialSentiment } from 'src/app/model/socialSentiment';
import { ResultService } from 'src/app/shared/results.service';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css'],
})
export class InsightsComponent implements OnInit {
  @Input() userInput = '';
  @Output() getRecommendationTrendCompletedOn = new EventEmitter<string>();
  @Output() getSocialSentimentCompletedOn = new EventEmitter<string>();
  @Output() getEarningCompletedOn = new EventEmitter<string>();
  @Output() getRecommendationTrendReset = new EventEmitter<string>();
  @Output() getSocialSentimentReset = new EventEmitter<string>();
  @Output() getEarningReset = new EventEmitter<string>();
  descriptions: Description;
  socialSentiment: SocialSentiment;
  recommendationTrends: RecommendationTrends[] = [];
  totalMentionReddit: number;
  positiveMentionReddit: number;
  negativeMentionReddit: number;
  totalMentionTwitter: number;
  positiveMentionTwitter: number;
  negativeMentionTwitter: number;
  categories: string[] = [];
  strongBuy: number[] = [];
  buy: number[] = [];
  hold: number[] = [];
  sell: number[] = [];
  strongSell: number[] = [];
  epsActual: any[] = [];
  epsEstimate: any[] = [];
  xAxisEpsEstimate: string[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  // trendChartOptions: Highcharts.Options;
  // epsChartOptions: Highcharts.Options;
  trendChartOptions: Highcharts.Options =   {
    rangeSelector: {
      enabled: false,
    },
    scrollbar: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    chart: {
      type: 'column',
    },
    title: {
      text: 'Recommendation Trends',
    },
    xAxis: {
      
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Analysis',
        align: 'high',
      },
      labels: {
        overflow: 'justify',
      },
      opposite:false,

      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color:
            // theme
            (Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color) ||
            'gray',
        },
      },
    },

    legend: {
      enabled: true,
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
        },
      },
    },

    series: [
      {
        name: 'Strong Buy',
        type: 'column',
        color: '#306e31'
      },
      {
        name: 'Buy',
        type: 'column',
        color: '#59c04d'
      },
      {
        name: 'Hold',
        type: 'column',
        color: '#997527'
      },
      {
        name: 'Sell',
        type: 'column',
        color: '#be3445'
      },
      {
        name: 'Strong Sell',
        type: 'column',
        color: '#581b23'
      },
    ],
  };


  epsChartOptions: Highcharts.Options ={
    rangeSelector: {
      enabled: false,
    },
    scrollbar: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    chart: {
      type: 'spline',
    },
    title: {
      text: 'Historical EPS Surprises',
    },
    xAxis: {
      categories: this.xAxisEpsEstimate,
    },
    yAxis: {
      title: {
        text: 'Quarterly EPS',
      },
      opposite:false
    },

    tooltip: {
      //  crosshairs: true,
      shared: true,
    },
    plotOptions: {
      spline: {
        marker: {
          radius: 4,
          lineColor: '#666666',
          lineWidth: 1,
          enabled:true,
        },
      },
    },

    legend: {
      enabled: true,
    },

    series: [
      {
        name: 'Actual',
        type: 'spline',
        data: this.epsActual,
        color:'#6eabe1'
      },
      {
        name: 'Estimate',
        type: 'spline',
        data: this.epsEstimate,
        marker: {
          symbol: 'diamond'
        },
        color:'black'
      },
    ],
  };

  constructor(
    private resultService: ResultService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getRecommendationTrend();
    this.getSocialSentiment();
    this.getDescription();
    this.getEarning();
  }

  getRecommendationTrend() {
    this.route.paramMap.subscribe((params) => {
      this.categories = [];
      this.recommendationTrends = [];
      this.strongBuy = [];
      this.buy = [];
      this.hold = [];
      this.sell = [];
      this.strongSell = [];
      this.getRecommendationTrendReset.emit();
      const recommendationTrendObservable = this.resultService
        .getRecommendationTrend(params.get('userInput').toUpperCase())
        .subscribe(
          (data) => {
            for (let i = 0; i < Object.keys(data).length; i++) {
              let date:string = data[i]?.period.slice(0,7);
              this.categories.push(date);
              this.recommendationTrends.push(data[i]);
              this.strongBuy.push(data[i]?.strongBuy);
              this.buy.push(data[i]?.buy);
              this.hold.push(data[i]?.hold);
              this.sell.push(data[i]?.sell);
              this.strongSell.push(data[i]?.strongSell);
            }
            console.log(this.categories);
          },
          (error) => {
            console.log('getRecommendationTrend from insights error');
          },
          () => {
            this.trendChartOptions = {
              rangeSelector: {
                enabled: false,
              },
              scrollbar: {
                enabled: false,
              },
              navigator: {
                enabled: false,
              },
              chart: {
                type: 'column',
              },
              title: {
                text: 'Recommendation Trends',
              },
              xAxis: {
                categories: this.categories,
              },
              yAxis: {
                min: 0,
                title: {
                  text: 'Analysis',
                  align: 'high',
                },
                labels: {
                  overflow: 'justify',
                },
                opposite:false,

                stackLabels: {
                  enabled: true,
                  style: {
                    fontWeight: 'bold',
                    color:
                      // theme
                      (Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color) ||
                      'gray',
                  },
                },
              },

              legend: {
                enabled: true,
              },

              plotOptions: {
                column: {
                  stacking: 'normal',
                  dataLabels: {
                    enabled: true,
                  },
                },
              },

              series: [
                {
                  name: 'Strong Buy',
                  type: 'column',
                  data: this.strongBuy,
                  color: '#306e31'
                },
                {
                  name: 'Buy',
                  type: 'column',
                  data: this.buy,
                  color: '#59c04d'
                },
                {
                  name: 'Hold',
                  type: 'column',
                  data: this.hold,
                  color: '#997527'
                },
                {
                  name: 'Sell',
                  type: 'column',
                  data: this.sell,
                  color: '#be3445'
                },
                {
                  name: 'Strong Sell',
                  type: 'column',
                  data: this.strongSell,
                  color: '#581b23'
                },
              ],
            };
            // console.log('getRecommendationTrend from insights completed');
            this.getRecommendationTrendCompletedOn.emit();
            // console.log('getRecommendationTrend emit done');
          }
        );
    });
  }

  getEarning(): void {
    this.route.paramMap.subscribe((params) => {
      this.getEarningReset.emit();
      this.epsActual = [];
      this.epsEstimate = [];
      this.xAxisEpsEstimate = [];
      const earningObservable = this.resultService
        .getEarning(params.get('userInput').toUpperCase())
        .subscribe(
          (data) => {
            for (let i = 0; i < Object.keys(data).length; i++) {
              this.epsActual.push(data[i]?.actual);
              this.epsEstimate.push(data[i]?.estimate);
              // this.epsActual.push([data[i].period, data[i].actual]);
              // this.epsEstimate.push([data[i].period, data[i].estimate]);
              this.xAxisEpsEstimate.push(
                data[i].period + '<br>' + 'Surprise: ' + data[i]?.surprise
              );
            }
            // console.log('epsActual');
            // console.log(this.epsActual);
            // console.log('epsEstimate');
            // console.log(this.epsEstimate);
   
          },
          (error) => {
            // console.log('getEarning from insights error');
          },
          () => {
            this.epsChartOptions = {
              rangeSelector: {
                enabled: false,
              },
              scrollbar: {
                enabled: false,
              },
              navigator: {
                enabled: false,
              },
              chart: {
                type: 'spline',
              },
              title: {
                text: 'Historical EPS Surprises',
              },
              xAxis: {
                categories: this.xAxisEpsEstimate,
              },
              yAxis: {
                title: {
                  text: 'Quarterly EPS',
                },
                opposite:false
              },

              tooltip: {
                //  crosshairs: true,
                shared: true,
              },
              plotOptions: {
                spline: {
                  marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1,
                    enabled:true,
                  },
                },
              },

              legend: {
                enabled: true,
              },

              series: [
                {
                  name: 'Actual',
                  type: 'spline',
                  data: this.epsActual,
                  color:'#6eabe1'
                  // marker: {
                  //   symbol: 'diamond'
                  // },
                },
                {
                  name: 'Estimate',
                  type: 'spline',
                  data: this.epsEstimate,
                  marker: {
                    symbol: 'diamond'
                  },
                  color:'black'
                },
              ],
            };
            console.log('getEarning from insights completed');
            this.getEarningCompletedOn.emit();
            console.log(this.xAxisEpsEstimate);
            // console.log('getEarning emit done');
          }
        );
    });
  }

  getDescription() {
    this.route.paramMap.subscribe((params) => {
      const descriptionObservable = this.resultService
        .getDescription(params.get('userInput').toUpperCase())
        .subscribe((data) => {
          this.descriptions = data;
        });
    });
  }

  getSocialSentiment() {
    this.totalMentionReddit =0;
    this.positiveMentionReddit=0;
    this.negativeMentionReddit=0;
    this.totalMentionTwitter=0;
    this.positiveMentionTwitter=0;
    this.negativeMentionTwitter=0;
    this.route.paramMap.subscribe((params) => {
      this.getSocialSentimentReset.emit();
      const socialSentimentObservable = this.resultService
        .getSocialSentiment(params.get('userInput').toUpperCase())
        .subscribe(
          (data) => {
            this.socialSentiment = data;
            let lengthOfRedditMention = Object.keys(data.reddit).length;
            if (lengthOfRedditMention != 0) {
              for (let i=0 ; i < lengthOfRedditMention; i++){
                this.totalMentionReddit += this.socialSentiment?.reddit[i].mention;
                this.positiveMentionReddit +=
                  this.socialSentiment?.reddit[i].positiveMention;
                this.negativeMentionReddit +=
                  this.socialSentiment?.reddit[i].negativeMention;
              }
            } else {
              this.totalMentionReddit = 0;
              this.positiveMentionReddit = 0;
              this.negativeMentionReddit = 0;
            }

            let lengthOfTwitterMention = Object.keys(data.twitter).length;
            if (lengthOfTwitterMention != 0) {
              for (let i=0 ; i < lengthOfTwitterMention; i++){
                this.totalMentionTwitter += this.socialSentiment?.twitter[i].mention;
                this.positiveMentionTwitter +=
                  this.socialSentiment?.twitter[i].positiveMention;
                this.negativeMentionTwitter +=
                  this.socialSentiment?.twitter[i].negativeMention;
              }
            } else {
              this.totalMentionTwitter = 0;
              this.positiveMentionTwitter = 0;
              this.negativeMentionTwitter = 0;
            }
          },
          (error) => {
            // console.log('getSocialSentiment from insights error');
          },
          () => {
            // console.log('getSocialSentiment from insights completed');
            this.getSocialSentimentCompletedOn.emit();
            // console.log('getSocialSentiment emit done');
          }
        );
    });
  }

  // original ver without route
  // getRecommendationTrend() {
  //   this.resultService
  //     .getRecommendationTrend(this.userInput)
  //     .subscribe((data) => {
  //       this.categories = [];
  //       this.recommendationTrends = [];
  //       this.strongBuy = [];
  //       this.buy = [];
  //       this.hold = [];
  //       this.sell = [];
  //       this.strongSell = [];
  //       for (let i = 0; i < Object.keys(data).length; i++) {
  //         this.categories.push(data[i].period);
  //         this.recommendationTrends.push(data[i]);
  //         this.strongBuy.push(data[i].strongBuy);
  //         this.buy.push(data[i].buy);
  //         this.hold.push(data[i].hold);
  //         this.sell.push(data[i].sell);
  //         this.strongSell.push(data[i].strongSell);
  //       }
  //       console.log('from insights: ' + this.recommendationTrends);
  //       console.log(this.recommendationTrends);
  //       console.log(this.categories);
  //       console.log(this.strongBuy);
  //       console.log(this.buy);
  //       console.log(this.hold);
  //       console.log(this.sell);
  //       console.log(this.strongSell);
  //     });

  //   this.trendChartOptions = {
  //     rangeSelector: {
  //       enabled: false,
  //     },
  //     scrollbar: {
  //       enabled: false,
  //     },
  //     navigator: {
  //       enabled: false,
  //     },
  //     chart: {
  //       type: 'column',
  //     },
  //     title: {
  //       text: 'Recommendation Trends',
  //     },
  //     xAxis: {
  //       categories: this.categories,
  //     },
  //     yAxis: {
  //       min: 0,
  //       title: {
  //         text: 'Analysis',
  //         align: 'high',
  //       },
  //       labels: {
  //         overflow: 'justify',
  //       },

  //       stackLabels: {
  //         enabled: true,
  //         style: {
  //           fontWeight: 'bold',
  //           color:
  //             // theme
  //             (Highcharts.defaultOptions.title.style &&
  //               Highcharts.defaultOptions.title.style.color) ||
  //             'gray',
  //         },
  //       },
  //     },

  //     legend: {
  //       enabled: true,
  //     },

  //     plotOptions: {
  //       column: {
  //         stacking: 'normal',
  //         dataLabels: {
  //           enabled: true,
  //         },
  //       },
  //     },

  //     series: [
  //       {
  //         name: 'Strong Buy',
  //         type: 'column',
  //         data: this.strongBuy,
  //       },
  //       {
  //         name: 'Buy',
  //         type: 'column',
  //         data: this.buy,
  //       },
  //       {
  //         name: 'Hold',
  //         type: 'column',
  //         data: this.hold,
  //       },
  //       {
  //         name: 'Sell',
  //         type: 'column',
  //         data: this.sell,
  //       },
  //       {
  //         name: 'Strong Sell',
  //         type: 'column',
  //         data: this.strongSell,
  //       },
  //     ],
  //   };
  // }

  // getEarning() {
  //   this.resultService.getEarning(this.userInput).subscribe((data) => {
  //     this.epsActual=[];
  //     this.epsEstimate=[];
  //     for (let i = 0; i < Object.keys(data).length; i++) {
  //       this.epsActual.push(data[i]?.actual);
  //       this.epsEstimate.push(data[i]?.estimate);
  //       // this.epsActual.push([data[i].period, data[i].actual]);
  //       // this.epsEstimate.push([data[i].period, data[i].estimate]);
  //       this.xAxisEpsEstimate.push(data[i].period + "Surprise: " + data[i].surprise);
  //     }
  //     console.log("epsActual");
  //     console.log(this.epsActual);
  //     console.log("epsEstimate");
  //     console.log(this.epsEstimate);
  //     this.epsChartOptions = {
  //       rangeSelector: {
  //         enabled: false,
  //       },
  //       scrollbar: {
  //         enabled: false,
  //       },
  //       navigator: {
  //         enabled: false,
  //       },
  //       chart: {
  //         type: 'spline',
  //       },
  //       title: {
  //         text: 'Historical EPS Surprises',
  //       },
  //       xAxis: {
  //         categories: this.xAxisEpsEstimate,
  //       },
  //       yAxis: {
  //         title: {
  //           text: 'Quarterly EPS',
  //         },
  //       },

  //      tooltip: {
  //       //  crosshairs: true,
  //        shared: true
  //      },
  //      plotOptions : {
  //        spline: {
  //           marker: {
  //               radius: 4,
  //               lineColor: '#666666',
  //               lineWidth: 1
  //            }
  //         }
  //      },

  //       legend: {
  //         enabled: true,
  //       },

  //       series: [
  //         {
  //           name: 'Estimate',
  //           type: 'spline',
  //           data: this.epsEstimate,
  //         },
  //         {
  //           name: 'Actual',
  //           type: 'spline',
  //           data: this.epsActual,
  //         },
  //       ],
  //     };
  //   });
  // }

  // getSocialSentiment() {
  //   this.resultService.getSocialSentiment(this.userInput).subscribe((data) => {
  //     this.socialSentiment = data;
  //     let lengthOfRedditMention = Object.keys(data.reddit).length;
  //     if (lengthOfRedditMention != 0) {
  //       this.totalMentionReddit = this.socialSentiment?.reddit[0].mention;
  //       this.positiveMentionReddit =
  //         this.socialSentiment?.reddit[0].positiveMention;
  //       this.negativeMentionReddit =
  //         this.socialSentiment?.reddit[0].negativeMention;
  //     } else {
  //       this.totalMentionReddit = 0;
  //       this.positiveMentionReddit = 0;
  //       this.negativeMentionReddit = 0;
  //     }

  //     let lengthOfTwitterMention = Object.keys(data.twitter).length;
  //     if (lengthOfTwitterMention != 0) {
  //       this.totalMentionTwitter = this.socialSentiment?.twitter[0].mention;
  //       this.positiveMentionTwitter =
  //         this.socialSentiment?.twitter[0].positiveMention;
  //       this.negativeMentionTwitter =
  //         this.socialSentiment?.twitter[0].negativeMention;
  //     } else {
  //       this.totalMentionTwitter = 0;
  //       this.positiveMentionTwitter = 0;
  //       this.negativeMentionTwitter = 0;
  //     }
  //   });
  // }

  // getDescription() {
  //   this.resultService.getDescription(this.userInput).subscribe((data) => {
  //     this.descriptions = data;
  //   });
  // }

  updateInsights() {
    this.getRecommendationTrend();
    this.getSocialSentiment();
    this.getDescription();
    this.getEarning();
  }
}
