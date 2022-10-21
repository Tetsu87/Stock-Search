import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-buy-modal-portfolio',
  templateUrl: './buy-modal-portfolio.component.html',
  styleUrls: ['./buy-modal-portfolio.component.css']
})
export class BuyModalPortfolioComponent implements OnInit {
  @Input() ticker = '';
  @Input() name = '';
  @Input() currentPrice: number;
  @Output() displayStockBoughtOnInPortfolio = new EventEmitter<string>();
  @Output() updateCollections = new EventEmitter<string>();
  @Output() getMoneyInWallet = new EventEmitter<string>();
  @Output() getLatestPricesAndChanges = new EventEmitter<string>();
  closeResult = '';
  moneyInWallet: number = 2000;
  moneyInWalletStr: string;
  quantity: number = 0;
  stock:string='';

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.feedCurrentWallet();
    // console.log(this.ticker)
    this.stock = this.ticker
    // console.log(this.stock);
  }

  open(content) {
    this.feedCurrentWallet(); // refresh the wallet everytime modal is open
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  feedCurrentWallet() {
    this.moneyInWallet = JSON.parse(localStorage.getItem('moneyInWallet'));
    this.moneyInWalletStr = JSON.parse(localStorage.getItem('moneyInWallet'));
    let index = this.moneyInWalletStr.toString().indexOf(".");
    this.moneyInWalletStr = this.moneyInWalletStr.toString().slice(0,index+3);
  }

  buyStock() {
    let currPortfolio = JSON.parse(localStorage.getItem('portfolio'));
    let newPortfolio: any[] = [];
    let len: number = 0;
    let isExist: boolean = false;
    let isExistIndex: number;

    if (currPortfolio) {
      len = currPortfolio.length;
    }
    for (let i = 0; i < len; i++) {
      if (currPortfolio[i].ticker === this.ticker) {
        isExist = true;
        isExistIndex = i;
      } else {
        newPortfolio.push(currPortfolio[i]);
      }
    }

    console.log('buy 1');
    let spentMoney = JSON.parse(localStorage.getItem('spentMoney'));
    let newSpentMoney: number;

    if (!isExist) {
      let obj = {
        ticker: this.ticker,
        name: this.name,
        quantity: this.quantity,
        totalCost: this.quantity * this.currentPrice,
      };
      newSpentMoney = spentMoney + this.quantity * this.currentPrice;
      newPortfolio.push(obj);
      console.log('buy 2');
    } else {
      let obj = {
        ticker: this.ticker,
        name: this.name,
        quantity: this.quantity + currPortfolio[isExistIndex].quantity,
        totalCost:
        this.quantity * this.currentPrice +
        currPortfolio[isExistIndex].totalCost,
      };
      newSpentMoney = spentMoney + this.quantity * this.currentPrice;
      newPortfolio.push(obj);
      console.log('buy 3');
    }
    console.log("this.ticker")
    console.log(this.ticker)

    this.stock = this.ticker;

    localStorage.setItem('spentMoney', JSON.stringify(newSpentMoney));
    console.log('new spent money is: ' + newSpentMoney);
    let newMoneyInWallet =
      JSON.parse(localStorage.getItem('initialMoney')) -
      newSpentMoney +
      JSON.parse(localStorage.getItem('earnedMoney'));
    this.moneyInWallet = newMoneyInWallet;
    console.log('newMoneyInWallet is: ' + newMoneyInWallet);
    localStorage.setItem('moneyInWallet', JSON.stringify(newMoneyInWallet));
    localStorage.setItem('portfolio', JSON.stringify(newPortfolio));
    console.log('buy 4');
    console.log(localStorage.getItem('portfolio'));
    console.log('buy 5');
    this.displayStockBoughtOnInPortfolio.emit();
    this.updateCollections.emit();
    this.getMoneyInWallet.emit();
    this.getLatestPricesAndChanges.emit();
  }

  getTicker(){
    // return this.ticker;
    console.log("getTicker")
    console.log(this.stock);
    return this.stock;
  }

  setTicker(ticker:string){
    this.stock = ticker;
  }

}
