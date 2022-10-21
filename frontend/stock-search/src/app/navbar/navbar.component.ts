import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public isNavbarCollapsed = true;
  isSearchTicker:boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // this.isSearch();
  }

  // isSearch(){
  //   console.log("issearch yobaretayo")
  //   let tickerFromURL = this.router.url;
  //   if (tickerFromURL != "/search/home" && tickerFromURL != "/watchlist" &&tickerFromURL != "/portfolio" ){
  //     this.isSearchTicker = true;
  //   } else {
  //     this.isSearchTicker = false;
  //   }
  // }
  isSearch(){
    // console.log("issearch yobaretayo")
    let tickerFromURL = this.router.url;
    if (tickerFromURL != "/search/home" && tickerFromURL != "/watchlist" &&tickerFromURL != "/portfolio" ){
      return true;
    } else {
      return false;
    }
  }

  isWatchlist(){
    let tickerFromURL = this.router.url;
    if (tickerFromURL === "/watchlist" ){
      return true;
    } else {
      return false;
    }
  }

  isPortfolio(){
    let tickerFromURL = this.router.url;
    if (tickerFromURL === "/portfolio" ){
      return true;
    } else {
      return false;
    }
  }

 

}
