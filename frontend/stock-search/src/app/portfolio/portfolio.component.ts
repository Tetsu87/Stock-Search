import { Component, OnInit, ViewChild} from '@angular/core';
import { ResultService } from 'src/app/shared/results.service';
import { BuyModalPortfolioComponent } from './buy-modal-portfolio/buy-modal-portfolio.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  portfolio: any[] = [];
  latestPricesInPortfolio: number[] = [];
  latestPriceChangesInPortfolio: number[] = [];
  moneyInWallet: string;
  displayStockBoughtInPortfolio: boolean = false;
  displayStockSoldInPortfolio: boolean = false;
  isPortfolioExist:boolean = false;
  ticker:string ='';

  @ViewChild(BuyModalPortfolioComponent)
  private buyModalPortfolioComponent: BuyModalPortfolioComponent;

  constructor(private resultService: ResultService) {}

  ngOnInit(): void {
    console.log('ngOnInit called from portfolio');
    this.updateCollections();
    this.getLatestPricesAndChanges();
    this.clearUserInputInForm();
    this.getMoneyInWallet();
    this.updateIsPortfolioExist();
  }

  updateIsPortfolioExist(){
    if (localStorage.hasOwnProperty('portfolio')){
      let currPortfolio = JSON.parse(localStorage.getItem('portfolio'));
      if (currPortfolio.length > 0) {
        this.isPortfolioExist = true;
      } else {
        this.isPortfolioExist = false;
      }
    } else {
      this.isPortfolioExist = false;
    }
  }

  getMoneyInWallet() {
    this.moneyInWallet = JSON.parse(localStorage.getItem('moneyInWallet'));
  }

  getLatestPricesAndChanges() {
    let currPortfolio = JSON.parse(localStorage.getItem('portfolio'));
    console.log(currPortfolio);
    let len: number = 0;
    if (currPortfolio) {
      len = currPortfolio.length;
    }

    let dataOfStocks = new Array<any>(len);

    for (let i = 0; i < len; i++) {
      this.resultService
        .getLatestPrice(this.portfolio[i].ticker)
        .subscribe((data) => {
          this.latestPricesInPortfolio[i] = data.c;
          this.latestPriceChangesInPortfolio[i]=data.dp;
        });
    }
    console.log(dataOfStocks);
  }

  isPositive(i: number) {
    if (this.latestPricesInPortfolio[i] >= 0) {
      return true;
    } else {
      return false;
    }
  }

  buyStock() {}

  sellStock() {}

  updateCollections() {
    this.portfolio = JSON.parse(localStorage.getItem('portfolio'));
  }

  clearUserInputInForm() {
    localStorage.setItem('latestUserInput', '');
  }

  displayStockBoughtOnInPortfolio() {
    this.ticker = this.buyModalPortfolioComponent.getTicker();
    this.displayStockBoughtInPortfolio = true;
    this.displayStockSoldInPortfolio = false;
    setTimeout(() => (this.displayStockBoughtInPortfolio = false), 5000);
  }

  displayStockSoldOnInPortfolio() {
    this.displayStockBoughtInPortfolio = false;
    this.displayStockSoldInPortfolio = true;
    setTimeout(() => (this.displayStockSoldInPortfolio = false), 5000);
  }

  displayOff() {
    this.displayStockBoughtInPortfolio = false;
    this.displayStockSoldInPortfolio = false;
  }
  
}
