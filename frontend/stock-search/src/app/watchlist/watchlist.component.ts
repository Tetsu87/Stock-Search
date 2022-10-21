import { Component, OnInit } from '@angular/core';
import { ResultService } from 'src/app/shared/results.service';
import { LatestPrice } from 'src/app/model/latestPrice';
import { Description } from 'src/app/model/description';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  collections: any[] = [];

  latestPricesInWatchList: number[] = [];
  latestPriceChangesInWatchList: number[] =[];
  latestPricePercentChangesInWatchList: number[] =[];
  id: any;
  isWatchlistExist:boolean = false;

  constructor(private resultService: ResultService, private router: Router) {}

  ngOnInit(): void {
    this.updateCollctions();
    this.getLatestPricesAndChanges();
    this.clearUserInputInForm();
    this.updateIsWatchlistExist();
  }

  updateIsWatchlistExist(){
    if (localStorage.hasOwnProperty('watchList')){
      let currWatchlist = JSON.parse(localStorage.getItem('watchList'));
      if (currWatchlist.length > 0) {
        this.isWatchlistExist = true;
      } else {
        this.isWatchlistExist = false;
      }
    } else {
      this.isWatchlistExist = false;
    }
  }

  getLatestPricesAndChanges() {
    let currWatchListItems = JSON.parse(localStorage.getItem('watchList'));
    let len: number = 0;
    if (currWatchListItems) {
      len = currWatchListItems.length;
    }
 
    for (let i=0; i < len; i++){
      this.resultService.getLatestPrice(this.collections[i].ticker).subscribe((data) => {
        this.latestPricesInWatchList[i] = data.c;
        this.latestPriceChangesInWatchList[i] = data.d;
        this.latestPricePercentChangesInWatchList[i] = data.dp;
      });
    }
    console.log("koreyobareteru?")
  }

  isPositive(i:number) {
    if (this.latestPricesInWatchList[i] >= 0) {
      return true;
    } else {
      return false;
    }
  }

  removeFromWatchlist(id: number) {
    let currWatchListItems = JSON.parse(localStorage.getItem('watchList'));
    let len: number = currWatchListItems.length;

    let arrAfterDelete: any[] = [];
    for (let i = 0; i < len; i++) {
      if (i == id) {
        continue;
      } else {
        arrAfterDelete.push(currWatchListItems[i]);
      }
    }

    this.latestPricesInWatchList.splice(id,1);
    this.latestPriceChangesInWatchList.splice(id,1);
    this.latestPricePercentChangesInWatchList.splice(id,1);

    localStorage.setItem('watchList', JSON.stringify(arrAfterDelete));
    console.log(localStorage.getItem('watchList'));
    this.updateCollctions();
    this.updateIsWatchlistExist();
  }

  updateCollctions() {
    this.collections = JSON.parse(localStorage.getItem('watchList'));
  }

  clearUserInputInForm(){
    localStorage.setItem('latestUserInput', '');
  }

  navigateToDetails(input: string) {
    this.router.navigate(['/search', input]);
  }

  moveToDetails(input: string) {
    this.navigateToDetails(input);       
   
  }



}
