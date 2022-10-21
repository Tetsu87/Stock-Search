import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { Description } from '../model/description';
import { Subject, Subscription } from 'rxjs';
import {
  switchMap,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { ResultService } from 'src/app/shared/results.service';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { SummaryComponent } from './summary/summary.component';
import { TopNewsComponent } from './top-news/top-news.component';
import { ChartsComponent } from './charts/charts.component';
import { InsightsComponent } from './insights/insights.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent implements OnInit {
  @ViewChild(GeneralInfoComponent)
  private generalInfoComponent: GeneralInfoComponent;

  @ViewChild(SummaryComponent)
  private summaryComponent: SummaryComponent;

  @ViewChild(TopNewsComponent)
  private topNewsComponent: TopNewsComponent;

  @ViewChild(ChartsComponent)
  private chartsComponent: ChartsComponent;

  @ViewChild(InsightsComponent)
  private insightsComponent: InsightsComponent;

  userInput = '';
  userInputFixed = '';
  subscription: Subscription;
  descriptions: Description;
  isDisplayOn: boolean = false;
  isLoading: boolean = false;
  isComplete: boolean = false;
  options: any[] = [];
  myFormControl = new FormControl('');
  isHome: boolean = true;

  isGetLatestPriceCompleted: boolean = false;
  isGetDescriptionCompleted: boolean = false;
  isHistoricalDataCompleted: boolean = false;
  isPeersCompleted: boolean = false;
  isNewsCompleted: boolean = false;
  isGetHistoricalDailyDataCompleted: boolean = false;
  isGetRecommendationTrendCompleted: boolean = false;
  isGetSocialSentimentCompleted: boolean = false;
  isGetEarningCompleted: boolean = false;

  isGetLatestPriceLoading: boolean = true;
  isGetDescriptionLoading: boolean = true;
  isHistoricalDataLoading: boolean = true;
  isPeersLoading: boolean = true;
  isNewsLoading: boolean = true;
  isGetHistoricalDailyDataLoading: boolean = true;
  isGetRecommendationTrendLoading: boolean = true;
  isGetSocialSentimentLoading: boolean = true;
  isGetEarningLoading: boolean = true;

  apiLimitReached: boolean = false;
  noDataFound: boolean = false;
  invalidTicker: boolean = false;

  constructor(
    private resultService: ResultService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.subscription = this.myFormControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((selectedValue) => {
        this.isComplete = false;
        this.autoComplete(selectedValue);
      });
    this.retainInput();
    this.isHomeOrNot();
  }

  onClick(input: string) {
    this.copyInput();
    this.userInputFixed = input;
    this.resultService.getDescription(input.toUpperCase()).subscribe(
      (data) => {
        this.descriptions = data;
        if (this.descriptions.name != null) {
          this.navigateToDetails(input);
        } else {
          this.toHiddenStatus();
          this.displayInvalidTicker();
        }
      },
      (error) => {
        this.toHiddenStatus();
        this.displayInvalidTicker();
      },
      () => {
        // this.retainInput("test2");
      }
    );
  }

  copyInput() {
    localStorage.setItem('latestUserInput', this.userInput);
  }

  retainInput() {
    let temporal = localStorage.getItem('latestUserInput');
    if (temporal&&temporal != "null"){
      this.userInput = temporal;
    } else {
      this.userInput = '';
    }
  }

  autoComplete(typing: string) {
    this.options = [];
    if (typing.length > 0) {
      this.isLoading = true;
      console.log(this.isLoading);
      this.resultService.autoComplete(typing).subscribe(
        // this.resultService.autoComplete(this.userInput).subscribe(
        (data) => {
          console.log('autocomplete loading now');
          if (data.error) {
            // this.apiLimitReached = true;
            this.displayApiLimitReachedOn();
          }
          for (let i = 0; i < Object.keys(data.result).length; i++) {
            if (
              data.result[i].type.includes('Common') &&
              !data.result[i].symbol.includes('.')
            ) {
              let description: string = data.result[i].description;
              let symbol: string = data.result[i].symbol;
              this.options.push([description, symbol]);
            }
          }
          if (this.options.length ===0){
            this.displayNoDataFoundOn();
          }
        },
        (error) => {
          console.log('autocomplete error');
        },
        () => {
          this.isLoading = false;
          this.isComplete = true;
          console.log('autocomplete finised!!!');
        }
      );
    } 
  }

  isHomeOrNot() {
    if (this.router.url === '/search/home') {
      this.isHome = true;
    } else {
      this.isHome = false;
    }
  }

  onClickClear(): void {
    this.userInput = '';
    localStorage.setItem('latestUserInput', '');
    this.isDisplayOn = false;
    this.navigateToHome();
    this.toHiddenStatus();
  }

  navigateToDetails(input: string) {
    this.router.navigate(['/search', input]);
  }

  navigateToHome() {
    this.router.navigate(['/search/home']);
  }

  updateSearchResult() {
    this.generalInfoComponent?.updateGeneralInfo();
    this.summaryComponent?.updateSummary();
    this.insightsComponent?.updateInsights();
    this.chartsComponent?.updateCharts();
    this.topNewsComponent?.updateNews();
  }

  getLatestPriceCompletedOn() {
    this.isGetLatestPriceCompleted = true;
    this.isGetLatestPriceLoading = false;
    // console.log('called and finished getLatestPriceCompletedOn');
    this.showStatus();
  }
  getDescriptionCompletedOn() {
    this.isGetDescriptionCompleted = true;
    this.isGetDescriptionLoading = false;
    // console.log('called and finished getDescriptionCompletedOn');
    this.showStatus();
  }
  getHistoricalDataCompletedOn() {
    this.isHistoricalDataCompleted = true;
    this.isHistoricalDataLoading = false;
    // console.log('called and finished getHistoricalDataCompletedOn');
    this.showStatus();
  }
  getPeersCompletedOn() {
    this.isPeersCompleted = true;
    this.isPeersLoading = false;
    // console.log('called and finished getPeersCompletedOn');
    this.showStatus();
  }
  getNewsCompletedOn() {
    this.isNewsCompleted = true;
    this.isNewsLoading = false;
    // console.log('called and finished getNewsCompletedOn');
    this.showStatus();
  }
  getHistoricalDailyDataCompletedOn() {
    this.isGetHistoricalDailyDataCompleted = true;
    this.isGetHistoricalDailyDataLoading = false;
    // console.log('called and finished getHistoricalDailyDateCompletedOn');
    this.showStatus();
  }
  getRecommendationTrendCompletedOn() {
    this.isGetRecommendationTrendCompleted = true;
    this.isGetRecommendationTrendLoading = false;
    // console.log('called and finished getRecommendationTrendCompletedOn');
    this.showStatus();
  }
  getSocialSentimentCompletedOn() {
    this.isGetSocialSentimentCompleted = true;
    this.isGetSocialSentimentLoading = false;
    // console.log('called and finished getSocialSentimentCompletedOn');
    this.showStatus();
  }
  getEarningCompletedOn() {
    this.isGetEarningCompleted = true;
    this.isGetEarningLoading = false;
    // console.log('called and finished getEarningCompletedOn');
    this.showStatus();
  }

  getLatestPriceReset() {
    this.isGetLatestPriceCompleted = false;
    this.isGetLatestPriceLoading = true;
    // console.log('called and finished getLatestPriceReset');
  }
  getDescriptionReset() {
    this.isGetDescriptionCompleted = false;
    this.isGetDescriptionLoading = true;
    // console.log('called and finished getDescriptionReset');
  }
  getHistoricalDataReset() {
    this.isHistoricalDataCompleted = false;
    this.isHistoricalDataLoading = true;
    // console.log('called and finished getHistoricalDataReset');
  }
  getPeersReset() {
    this.isPeersCompleted = false;
    this.isPeersLoading = true;
    // console.log('called and finished getPeersReset');
  }
  getNewsReset() {
    this.isNewsCompleted = false;
    this.isNewsLoading = true;
    // console.log('called and finished getNewsReset');
  }
  getHistoricalDailyDataReset() {
    this.isGetHistoricalDailyDataCompleted = false;
    this.isGetHistoricalDailyDataLoading = true;
    // console.log('called and finished getHistoricalDailyDateReset');
  }
  getRecommendationTrendReset() {
    this.isGetRecommendationTrendCompleted = false;
    this.isGetRecommendationTrendLoading = true;
    // console.log('called and finished getRecommendationTrendReset');
  }
  getSocialSentimentReset() {
    this.isGetSocialSentimentCompleted = false;
    this.isGetSocialSentimentLoading = true;
    // console.log('called and finished getSocialSentimentReset');
  }
  getEarningReset() {
    this.isGetEarningCompleted = false;
    this.isGetEarningLoading = true;
    // console.log('called and finished getEarningReset');
  }

  toHiddenStatus(){
    this.isGetLatestPriceCompleted = false;
    this.isGetDescriptionCompleted = false;
    this.isHistoricalDataCompleted = false;
    this.isPeersCompleted = false;
    this.isNewsCompleted = false;
    this.isGetHistoricalDailyDataCompleted = false;
    this.isGetRecommendationTrendCompleted = false;
    this.isGetSocialSentimentCompleted = false;
    this.isGetEarningCompleted = false;
  }

  resetStatus() {
    this.isGetLatestPriceCompleted = false;
    this.isGetDescriptionCompleted = false;
    this.isHistoricalDataCompleted = false;
    this.isPeersCompleted = false;
    this.isNewsCompleted = false;
    this.isGetHistoricalDailyDataCompleted = false;
    this.isGetRecommendationTrendCompleted = false;
    this.isGetSocialSentimentCompleted = false;
    this.isGetEarningCompleted = false;
    this.isGetLatestPriceLoading = true;
    this.isGetDescriptionLoading = true;
    this.isHistoricalDataLoading = true;
    this.isPeersLoading = true;
    this.isNewsLoading = true;
    this.isGetHistoricalDailyDataLoading = true;
    this.isGetRecommendationTrendLoading = true;
    this.isGetSocialSentimentLoading = true;
    this.isGetEarningLoading = true;
    // console.log("status is refreshed");
  }

  showStatus() {
    // console.log('isGetLatestPriceCompleted:' + this.isGetLatestPriceCompleted);
    // console.log('isGetDescriptionCompleted:' + this.isGetDescriptionCompleted);
    // console.log('isHistoricalDataCompleted:' + this.isHistoricalDataCompleted);
    // console.log('isPeersCompleted:' + this.isPeersCompleted);
    // console.log('isNewsCompleted:' + this.isNewsCompleted);
    // console.log(
    //   'isGetHistoricalDailyDataCompleted:' +
    //     this.isGetHistoricalDailyDataCompleted
    // );
    // console.log(
    //   'isGetRecommendationTrendCompleted:' +
    //     this.isGetRecommendationTrendCompleted
    // );
    // console.log(
    //   'isGetSocialSentimentCompleted:' + this.isGetSocialSentimentCompleted
    // );
    // console.log('isGetEarningCompleted:' + this.isGetEarningCompleted);
    // console.log('isHome:' + this.isHome);
  }

  displayApiLimitReachedOn() {
    this.apiLimitReached = true;
    setTimeout(() => (this.apiLimitReached = false), 5000);
  }

  displayNoDataFoundOn() {
    console.log("nodatafound called")
    this.noDataFound = true;
    setTimeout(() => (this.noDataFound = false), 5000);
  }

  displayInvalidTicker() {
    console.log("invalidTicker called")
    this.invalidTicker = true;
    setTimeout(() => (this.invalidTicker = false), 5000);
  }

  displayOff() {
    this.invalidTicker = false;
  }

}
