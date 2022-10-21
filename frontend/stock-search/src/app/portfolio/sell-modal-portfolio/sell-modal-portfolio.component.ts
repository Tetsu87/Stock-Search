import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sell-modal-portfolio',
  templateUrl: './sell-modal-portfolio.component.html',
  styleUrls: ['./sell-modal-portfolio.component.css']
})
export class SellModalPortfolioComponent implements OnInit {
  @Input() ticker = '';
  @Input() name = '';
  @Input() currentPrice: number;
  @Output() displayStockSoldOnInPortfolio = new EventEmitter<string>();
  @Output() updateIsPortfolioExist = new EventEmitter<string>();
  @Output() updateCollections = new EventEmitter<string>();
  @Output() getMoneyInWallet = new EventEmitter<string>();
  @Output() getLatestPricesAndChanges = new EventEmitter<string>();
  closeResult = '';
  moneyInWallet: number = 25000;
  moneyInWalletStr:string;
  quantity: number = 0;
  currentQuantity: number = 0;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.feedCurrentWallet();
    this.feedCurrentQuantity();
  }

  open(content) {
    this.feedCurrentWallet(); // refresh the wallet everytime modal is open
    this.feedCurrentQuantity(); // refresh the current quantity everytime modal is open
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

  feedCurrentQuantity(){
    let currPortfolio = JSON.parse(localStorage.getItem('portfolio'));
    let len: number;
    let currentStockIndex: number;
    len = currPortfolio.length;

    for (let i = 0; i < len; i++) {
      if (currPortfolio[i].ticker === this.ticker){
        currentStockIndex = i;
      }
    }
    this.currentQuantity = currPortfolio[currentStockIndex].quantity;
  }

  sellStock() {
    // localStorage.removeItem('portfolio');
    let currPortfolio = JSON.parse(localStorage.getItem('portfolio'));
    let newPortfolio: any[] = [];
    let len: number;
    let sellStockIndex: number;
    len = currPortfolio.length;

    for (let i = 0; i < len; i++) {
      if (currPortfolio[i].ticker === this.ticker){
        sellStockIndex = i;
      } else {
        newPortfolio.push(currPortfolio[i]);
      }
    }

    
    console.log('sell 1');
    let earnedMoney = JSON.parse(localStorage.getItem('earnedMoney'));
    let newEarnedMoney: number;


    let obj = {
      ticker: this.ticker,
      name: this.name,
      quantity: currPortfolio[sellStockIndex].quantity - this.quantity,
      totalCost: currPortfolio[sellStockIndex].totalCost - this.quantity * (currPortfolio[sellStockIndex].totalCost/currPortfolio[sellStockIndex].quantity),
    };
    if (obj.quantity > 0){
      newPortfolio.push(obj);
    }
    newEarnedMoney = earnedMoney + this.quantity * this.currentPrice;
    localStorage.setItem('earnedMoney', JSON.stringify(newEarnedMoney));
    let newMoneyInWallet =
    JSON.parse(localStorage.getItem('initialMoney')) -
    JSON.parse(localStorage.getItem('spentMoney')) +
    newEarnedMoney;
    this.moneyInWallet = newMoneyInWallet;

    console.log('sell 2');
    localStorage.setItem('moneyInWallet', JSON.stringify(newMoneyInWallet));
    localStorage.setItem('portfolio', JSON.stringify(newPortfolio));
    console.log('sell 3');
    console.log(localStorage.getItem('portfolio'));
    console.log('sell 4');
    this.displayStockSoldOnInPortfolio.emit();
    this.updateIsPortfolioExist.emit();
    this.updateCollections.emit();
    this.getMoneyInWallet.emit();
    this.getLatestPricesAndChanges.emit();
  }

}
