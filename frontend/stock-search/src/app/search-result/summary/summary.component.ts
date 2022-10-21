import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResultService } from 'src/app/shared/results.service';
import { Description } from 'src/app/model/description';
import { LatestPrice } from 'src/app/model/latestPrice';
import { HistoricalData } from 'src/app/model/historicalData';
import { Observable, Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
// import * as Highcharts from 'highcharts';
import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import { DataService } from './data.service';
IndicatorsCore(Highcharts);

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  @Input() userInput = '';
  @Output() getHistoricalDataCompletedOn = new EventEmitter<string>();
  @Output() getPeersCompletedOn = new EventEmitter<string>();
  @Output() getHistoricalDataReset = new EventEmitter<string>();
  @Output() getPeersReset = new EventEmitter<string>();
  descriptions: Description;
  latestPrices: LatestPrice;
  historicalData: HistoricalData;
  updateSubscription: Subscription;
  peers: string[];
  // hourlyPriceData: [t: number, c: number] = [];
  hourlyPriceData: any[] = [];
  testData: any[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  // chartOptions: Highcharts.Options;
  chartOptions: Highcharts.Options;
  title: string;
  isMarketOpen: boolean = true;
  date: Date;
  current: Date;
  diffTime: any;

  constructor(
    private resultService: ResultService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getLatestPrice();
    this.getDescription();
    this.getPeers();
    this.getHistoricalData();

    this.updateSubscription = interval(15000).subscribe((val) => {
      if (this.isMarketOpen === true ) {
      this.reloadLatestPrice();
      // console.log('autoupdate running');
    } 
  });
  }

  getLatestPrice() {
    this.route.paramMap.subscribe((params) => {
      const latestPriceObservable = this.resultService
        .getLatestPrice(params.get('userInput').toUpperCase())
        .subscribe((data) => {
          this.latestPrices = data;
          this.date = new Date(this.latestPrices?.t * 1000);
          this.current = new Date();
          this.diffTime = this.current.getTime() - this.date.getTime();
          if (Math.abs(this.diffTime) < 300000){
            this.isMarketOpen = true;
          } else {
            this.isMarketOpen = false;
          }
        });
    });
  }

  reloadLatestPrice() {
    let tickerFromURL = this.router.url.substring(8).toUpperCase();
    if (
      this.router.url != '/search/home' &&
      this.router.url != '/portfolio' &&
      this.router.url != '/watchlist' &&
      this.descriptions?.ticker === tickerFromURL
    ) {
      this.resultService.getLatestPrice(tickerFromURL).subscribe(
        (data) => {
          this.latestPrices = data;
        },
        (error) => {
          console.log('reloadLatestPrice from summary error');
        },
        () => {
          console.log('reloadLatestPrice from summary completed');
        }
      );
    }
  }


  getDescription() {
    this.route.paramMap.subscribe((params) => {
      const descriptionObservable = this.resultService
        .getDescription(params.get('userInput').toUpperCase())
        .subscribe((data) => {
          this.descriptions = data;
          this.title = this.descriptions.ticker;
        });
    });
  }

  getPeers() {
    this.route.paramMap.subscribe((params) => {
      this.getPeersReset.emit();
      const peersObservable = this.resultService
        .getPeers(params.get('userInput').toUpperCase())
        .subscribe(
          (data) => {
            this.peers = data;
            // console.log('from insights: ' + this.peers);
            // console.log(this.peers);
          },
          (error) => {
            console.log('getPeers from summary error');
          },
          () => {
            console.log('getPeers from summary completed');
            this.getPeersCompletedOn.emit();
            console.log('getPeers emit done');
          }
        );
    });
  }
  
  getColor(){
    let color = 'black';
    if (this.latestPrices.d > 0){
      color = 'green';
    } else if (this.latestPrices.d < 0){
      color ='red';
    }
    return color;
  }

  getHistoricalData() {
    this.route.paramMap.subscribe((params) => {
      this.getHistoricalDataReset.emit();
      this.hourlyPriceData = []; // clear existing data
      const ticker = params.get('userInput').toUpperCase();
      const historicalDataObservable = this.resultService
        .getHistoricalData(ticker)
        .subscribe(
          (data) => {
            let dataLength = data?.t.length;
            for (let i = dataLength - 72; i < dataLength; i++) {
              this.hourlyPriceData.push([data?.t[i] * 1000, data?.c[i]]);
            }
            this.chartOptions = {
              xAxis: {
                type: 'datetime',
                tickInterval: 3600 * 1000,
              },

              navigator: {
                enabled: false,
              },
              series: [
                {
                  type: 'line',
                  pointPlacement: 0.5,
                  pointRange: 1000 * 60 * 60,
                  data: this.hourlyPriceData,
                  name: this.title, // change series 1 > ticker name
                  color: this.getColor()
                },
              ],
              title: {
                text: ticker + ' Hourly Price Variation',
                style: {
                  color: '#808080',
                },
              },
              rangeSelector: {
                enabled: false,
              },
            };
          },
          (error) => {
            console.log('getHistoricalData from summary error');
          },
          () => {
            console.log('getHistoricalData from summary completed');
            this.getHistoricalDataCompletedOn.emit();
            console.log('getHistoricalData emit done');
          }
        );
    });
  }

  reloadHistoricalData() {
    console.log('reload historical data from summay');
    this.route.paramMap.subscribe((params) => {
      this.hourlyPriceData = []; // clear existing data
      const ticker = params.get('userInput').toUpperCase();
      const historicalDataObservable = this.resultService
        .getHistoricalData(ticker)
        .subscribe(
          (data) => {
            let dataLength = data?.t.length;
            for (let i = dataLength - 72; i < dataLength; i++) {
              this.hourlyPriceData.push([data?.t[i] * 1000, data?.c[i]]);
            }
            this.chartOptions = {
              xAxis: {
                type: 'datetime',
                tickInterval: 3600 * 1000,
              },

              navigator: {
                enabled: false,
              },
              series: [
                {
                  type: 'line',
                  pointPlacement: 0.5,
                  pointRange: 1000 * 60 * 60,
                  data: this.hourlyPriceData,
                  name: this.title, // change series 1 > ticker name
                },
              ],
              title: {
                text: ticker + ' Hourly Price Variation',
                style: {
                  color: '#808080',
                },
              },
              rangeSelector: {
                enabled: false,
              },
            };
          },
          (error) => {
            console.log('reloadHistoricalData from summary error');
          },
          () => {
            console.log('reloadHistoricalData from summary completed');
            console.log('reloadHistoricalData emit done');
          }
        );
    });
  }

  updateSummary() {
    this.getLatestPrice();
    this.getDescription();
    this.getPeers();
    this.getHistoricalData();
    // this.setChartOptions();
  }

  navigateToDetails(input: string) {
    this.router.navigate(['/search', input]);
  }

  onClick(input: string) {
    this.resultService.getDescription(input).subscribe(
      (data) => {
        this.descriptions = data;
        this.navigateToDetails(input);       
      },
      (error) => {},
      () => {
        // this.retainInput("test2");
      }
    );
  }
  
}
