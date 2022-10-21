import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
// import { FormComponent } from './form/form.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { FooterComponent } from './footer/footer.component';
import { DetailsComponent } from './details/details.component';
// import { ResultService } from './shared/results.service';
import { HighchartsChartModule } from 'highcharts-angular';
import { SummaryComponent } from './search-result/summary/summary.component';
import { TopNewsComponent } from './search-result/top-news/top-news.component';
import { ChartsComponent } from './search-result/charts/charts.component';
import { InsightsComponent } from './search-result/insights/insights.component';
import { GeneralInfoComponent } from './search-result/general-info/general-info.component';
import { CommonModule } from '@angular/common';
import { ResultService } from './shared/results.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './search-result/general-info/modal/modal.component';
import { SellModalComponent } from './search-result/general-info/sell-modal/sell-modal.component';
import { NewsModalComponent } from './search-result/top-news/news-modal/news-modal.component';
import { HourlyChartComponent } from './search-result/summary/hourly-chart/hourly-chart.component';
import { TrendChartComponent } from './search-result/insights/trend-chart/trend-chart.component';
import { EpsChartComponent } from './search-result/insights/eps-chart/eps-chart.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { BuyModalPortfolioComponent } from './portfolio/buy-modal-portfolio/buy-modal-portfolio.component';
import { SellModalPortfolioComponent } from './portfolio/sell-modal-portfolio/sell-modal-portfolio.component';
// import { RouteReuseStrategy } from '@angular/router';
// import { CacheRouteReuseStrategy } from './cash-route-reuse.strategy';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    // FormComponent,
    SearchResultComponent,
    WatchlistComponent,
    PortfolioComponent,
    FooterComponent,
    DetailsComponent,
    SummaryComponent,
    TopNewsComponent,
    ChartsComponent,
    InsightsComponent,
    GeneralInfoComponent,
    ModalComponent,
    SellModalComponent,
    NewsModalComponent,
    HourlyChartComponent,
    TrendChartComponent,
    EpsChartComponent,
    BuyModalPortfolioComponent,
    SellModalPortfolioComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    HighchartsChartModule,
    CommonModule,
    FormsModule,
    // NoopAnimationsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  // imports: [BrowserModule, AppRoutingModule, NgbModule, HttpClientModule,HighchartsChartModule,CommonModule,FormsModule,MatAutocompleteModule],
  providers: [ResultService],
  // providers: [ResultService, {
  //   provide: RouteReuseStrategy,
  //   useClass: CacheRouteReuseStrategy
  // }],
  bootstrap: [AppComponent],
  // bootstrap: [AppComponent, SearchResultComponent],
})
export class AppModule {}
