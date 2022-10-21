import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { FormComponent } from './form/form.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { SearchResultComponent } from './search-result/search-result.component';
// import { SearchResultModule } from './search-result/search-result.module';

const routes: Routes = [
  { path: '', redirectTo: '/search/home', pathMatch: 'full' },
  { path: 'search/home', component: SearchResultComponent },
  { path: 'search/:userInput', component: SearchResultComponent },
  // { path: 'search/:userInput', component: FormComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'watchlist', component: WatchlistComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
