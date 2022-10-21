import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @Input() ticker = '';
  @Input() name = '';
  @Input() currentPrice: number;
  @Output() displayStockBoughtOn = new EventEmitter<string>();
  @Output() isInventoryExist = new EventEmitter<string>();
  closeResult = '';
  moneyInWallet: number = 2000;
  quantity: number = 0;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.feedCurrentWallet();
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
    this.displayStockBoughtOn.emit();
    this.isInventoryExist.emit();
  }
}
