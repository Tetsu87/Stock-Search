import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResultService } from 'src/app/shared/results.service';
import { Observable, Subscription, interval } from 'rxjs';
import { LatestPrice } from 'src/app/model/latestPrice';
import { Description } from 'src/app/model/description';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css'],
})
export class GeneralInfoComponent implements OnInit, OnChanges {
  @Input() userInputFixed = '';
  @Output() getLatestPriceCompletedOn = new EventEmitter<string>();
  @Output() getDescriptionCompletedOn = new EventEmitter<string>();
  @Output() getLatestPriceReset = new EventEmitter<string>();
  @Output() getDescriptionReset = new EventEmitter<string>();
  updateSubscription: Subscription;
  descriptions: Description;
  latestPrices: LatestPrice;
  date: Date;
  // num: any;
  // percentChange: any;
  current: Date;
  // displayDate: any;
  diffTime: any;
  displayWatchlistAdded: boolean = false;
  displayWatchlistRemoved: boolean = false;
  displayStockBought: boolean = false;
  displayStockSold: boolean = false;
  ticker: string;
  name: string;
  currentPrice: number;
  total: number;
  initialMoney: number = 25000;
  spentMoney: number = 0;
  earnedMoney: number = 0;
  inventoryFlag: boolean;
  currentTimeToDisplay: any;
  isMarketOpen: boolean = true;

  constructor(
    private resultService: ResultService,
    private route: ActivatedRoute, // public activeModal: NgbActiveModal
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // console.log("yeaahhh changedddddd");
    // this.getLatestPrice();
    // this.getDescription();
  }

  ngOnInit(): void {
    console.log('ngOnInit is called from general');
    this.getLatestPrice();
    this.getDescription();
    this.setInitialDeposit();
    this.isInventoryExist();
    console.log(this.isMarketOpen);

    this.updateSubscription = interval(15000).subscribe((val) => {
        if (this.isMarketOpen === true ) {
        this.reloadLatestPrice();
        // console.log('autoupdate running');
      } 
    });
    // if (this.isMarketOpen === true ) {
    //   this.updateSubscription = interval(15000).subscribe((val) => {
    //     this.reloadLatestPrice();
    //     // console.log('autoupdate running');
    //   });
    // }
  }

  isInventoryExist() {
    this.inventoryFlag = false;
    let currPortfolio = JSON.parse(localStorage.getItem('portfolio'));
    console.log('currPortfolio is:');
    console.log(currPortfolio);
    let len: number = 0;
    if (currPortfolio) {
      len = currPortfolio.length;
    }
    let tickerFromURL = this.router.url.substring(8);
    for (let i = 0; i < len; i++) {
      if (currPortfolio[i].ticker === tickerFromURL) {
        if (currPortfolio[i].quantity > 0) {
          this.inventoryFlag = true;
        }
      }
    }
    console.log('isInventoryFlag is:' + this.inventoryFlag);
  }


  setInitialDeposit() {
    if (!localStorage.hasOwnProperty('initialMoney')) {
      localStorage.setItem('initialMoney', JSON.stringify(this.initialMoney));
      localStorage.setItem('spentMoney', JSON.stringify(this.spentMoney));
      localStorage.setItem('earnedMoney', JSON.stringify(this.earnedMoney));
      localStorage.setItem(
        'moneyInWallet',
        JSON.stringify(this.initialMoney - this.spentMoney + this.earnedMoney)
      );

      console.log('initialMoeny registration completed');
    } else {
      console.log('initialMoeny already registered');
    }
  }


  getLatestPrice() {
    this.route.paramMap.subscribe((params) => {
      this.getLatestPriceReset.emit();
      this.isInventoryExist();
      const latestPriceObservable = this.resultService
        .getLatestPrice(params.get('userInput').toUpperCase())
        .subscribe(
          (data) => {
            this.latestPrices = data;
            this.currentPrice = this.latestPrices?.c;
            // this.currentTime = new Date();
            // console.log('jikandayo---');
            // console.log(this.currentTime);
            // console.log('from general-info: ' + this.latestPrices);
            // console.log(this.latestPrices);

            this.date = new Date(this.latestPrices?.t * 1000);
            this.current = new Date();
            this.currentTimeToDisplay = new Date();
            this.diffTime = this.current.getTime() - this.date.getTime();
            console.log('open check!!!');
            console.log(this.date);
            console.log(this.current);
            console.log(this.diffTime);
            if (Math.abs(this.diffTime) < 300000){
              this.isMarketOpen = true;
            } else {
              this.isMarketOpen = false;
            }
          },
          (error) => {
            // console.log('getLatestPrice from general-info error');
          },
          () => {
            // console.log('getLatestPrice from general-info completed');
            this.getLatestPriceCompletedOn.emit();
            // console.log('getLatestPrice emit done');
          }
        );
    });
  }

  reloadLatestPrice() {
    let tickerFromURL = this.router.url.substring(8).toUpperCase();
    console.log('url is...:' + tickerFromURL);
    if (
      this.router.url != '/search/home' &&
      this.router.url != '/portfolio' &&
      this.router.url != '/watchlist' &&
      this.descriptions?.ticker === tickerFromURL
    ) {
      console.log('reload userInputFixed: ' + this.userInputFixed);
      this.resultService.getLatestPrice(tickerFromURL).subscribe(
        (data) => {
          this.latestPrices = data;
          this.currentPrice = this.latestPrices?.c;
          this.currentTimeToDisplay = new Date();
          console.log('from reloadLatest');
          console.log(this.latestPrices);

          // this.date = new Date(this.latestPrices?.t * 1000);
          // this.current = new Date();
          // this.diffTime = this.current.getTime() - this.date.getTime();
          // console.log("open check!!!")
          // console.log(this.date)
          // console.log(this.current)
          // console.log(this.diffTime)
        },
        (error) => {
          console.log('reloadLatestPrice from general-info error');
        },
        () => {
          console.log('reloadLatestPrice from general-info completed');
          // console.log('getLatestPrice emit done');
        }
      );
    }
  }

  // new version with route
  getDescription() {
    this.route.paramMap.subscribe((params) => {
      this.getDescriptionReset.emit();
      const descriptionObservable = this.resultService
        .getDescription(params.get('userInput').toUpperCase())
        .subscribe(
          (data) => {
            this.descriptions = data;
            // this.ticker = this.descriptions?.ticker;
            this.ticker = this.router.url.substring(8).toUpperCase();
            this.name = this.descriptions?.name;
            // console.log(data);

            // this.date = new Date(this.latestPrices?.t * 1000);
            // this.current = new Date();
            // this.diffTime = this.current.getTime() - this.date.getTime();
          },
          (error) => {
            // console.log('getDescription from general-info error');
          },
          () => {
            // console.log('getDescription from general-info completed');
            this.getDescriptionCompletedOn.emit();
            // console.log('getDescription emit done');
          }
        );
    });
  }

  isPositive() {
    if (this.latestPrices?.d >= 0) {
      return true;
    } else {
      return false;
    }
  }

  toggleWatchlist() {
    let currWatchListItems = JSON.parse(localStorage.getItem('watchList'));

    let isContain: boolean = false;
    let deleteNum: number;

    let len: number = 0;
    if (currWatchListItems) {
      len = currWatchListItems.length;
      for (let i = 0; i < len; i++) {
        if (currWatchListItems[i].ticker === this.router.url.substring(8)) {
          isContain = true;
          deleteNum = i;
        }
      }
    }

    if (isContain) {
      this.displayWatchlistRemovedOn();
      let arrAfterDelete: any[] = [];
      for (let i = 0; i < len; i++) {
        if (i == deleteNum) {
          continue;
        } else {
          arrAfterDelete.push(currWatchListItems[i]);
        }
      }

      localStorage.setItem('watchList', JSON.stringify(arrAfterDelete));
    } else {
      let obj = {
        ticker: this.router.url.substring(8),
        name: this.descriptions.name,
      };

      let watchListItemAdd = obj;
      let watchListItemsArr: any[] = [];
      for (let i = 0; i < len; i++) {
        watchListItemsArr.push(currWatchListItems[i]);
      }
      watchListItemsArr.push(watchListItemAdd);
      localStorage.setItem('watchList', JSON.stringify(watchListItemsArr));
      this.displayWatchlistAddedOn();
    }
  }

  isRegistered() {
    let currWatchListItems = JSON.parse(localStorage.getItem('watchList'));
    if (currWatchListItems) {
      for (let i = 0; i < currWatchListItems.length; i++) {
        if (currWatchListItems[i].ticker === this.router.url.substring(8)) {
          return 'registered';
        }
      }
    }
    return 'not-registered';
  }

  updateGeneralInfo() {
    console.log('updateGeneralInfo starts');
    this.getLatestPrice();
    this.getDescription();
    console.log('updateGeneralInfo ends');
  }

  displayWatchlistAddedOn() {
    this.displayWatchlistAdded = true;
    this.displayWatchlistRemoved = false;
    setTimeout(() => (this.displayWatchlistAdded = false), 5000);
  }

  displayWatchlistRemovedOn() {
    this.displayWatchlistAdded = false;
    this.displayWatchlistRemoved = true;
    setTimeout(() => (this.displayWatchlistRemoved = false), 5000);
  }

  displayStockBoughtOn() {
    this.displayStockBought = true;
    this.displayStockSold = false;
    setTimeout(() => (this.displayStockBought = false), 5000);
  }

  displayStockSoldOn() {
    this.displayStockBought = false;
    this.displayStockSold = true;
    setTimeout(() => (this.displayStockSold = false), 5000);
  }

  displayOff() {
    this.displayWatchlistAdded = false;
    this.displayWatchlistRemoved = false;
    this.displayStockBought = false;
    this.displayStockSold = false;
  }
}
