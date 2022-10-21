import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AutoComplete } from '../model/autoComplete';
import { Description } from '../model/description';
import { HistoricalData } from '../model/historicalData';
import { LatestPrice } from '../model/latestPrice';
import { News } from '../model/news';
import { RecommendationTrends } from '../model/recommendationTrends';
import { SocialSentiment } from '../model/socialSentiment';

@Injectable()
export class ResultService {
  constructor(private http: HttpClient) {}

  getLatestPrice(ticker: string): Observable<LatestPrice> {
    return this.http.get<LatestPrice>(`https://stock-trading-express.wl.r.appspot.com/latestPrice/${ticker}`);
  }

  getDescription(ticker: string): Observable<Description> {
    return this.http.get<Description>(`https://stock-trading-express.wl.r.appspot.com/description/${ticker}`);
  }

  getEarning(ticker: string): Observable<any> {
    return this.http.get(`https://stock-trading-express.wl.r.appspot.com/earnings/${ticker}`);
  }

  getHistoricalData(ticker: string): Observable<HistoricalData> {
    return this.http.get<HistoricalData>(`https://stock-trading-express.wl.r.appspot.com/historicalData/${ticker}`);
  }

  getHistoricalDailyData(ticker: string): Observable<HistoricalData> {
    return this.http.get<HistoricalData>(`https://stock-trading-express.wl.r.appspot.com/historicalDailyData/${ticker}`);
  } //data type is common with getHistoricalData

  getNews(ticker: string): Observable<News> {
    return this.http.get<News>(`https://stock-trading-express.wl.r.appspot.com/news/${ticker}`);
  }

  getPeers(ticker: string): Observable<any> {
    return this.http.get(`https://stock-trading-express.wl.r.appspot.com/peers/${ticker}`);
  }


  getRecommendationTrend(ticker: string): Observable<RecommendationTrends> {
    return this.http.get<RecommendationTrends>(`https://stock-trading-express.wl.r.appspot.com/recommendationTrends/${ticker}`);
  }

  getSocialSentiment(ticker: string): Observable<SocialSentiment> {
    return this.http.get<SocialSentiment>(`https://stock-trading-express.wl.r.appspot.com/socialSentiment/${ticker}`);
  }

  autoComplete(ticker: string): Observable<AutoComplete> {
    return this.http.get<AutoComplete>(`https://stock-trading-express.wl.r.appspot.com/autoComplete/${ticker}`);
  }
  // getLatestPrice(ticker: string): Observable<LatestPrice> {
  //   return this.http.get<LatestPrice>(`http://localhost:3000/latestPrice/${ticker}`);
  // }

  // getDescription(ticker: string): Observable<Description> {
  //   return this.http.get<Description>(`http://localhost:3000/description/${ticker}`);
  // }

  // getEarning(ticker: string): Observable<any> {
  //   return this.http.get(`http://localhost:3000/earnings/${ticker}`);
  // }

  // getHistoricalData(ticker: string): Observable<HistoricalData> {
  //   return this.http.get<HistoricalData>(`http://localhost:3000/historicalData/${ticker}`);
  // }

  // getHistoricalDailyData(ticker: string): Observable<HistoricalData> {
  //   return this.http.get<HistoricalData>(`http://localhost:3000/historicalDailyData/${ticker}`);
  // } //data type is common with getHistoricalData

  // getNews(ticker: string): Observable<News> {
  //   return this.http.get<News>(`http://localhost:3000/news/${ticker}`);
  // }

  // getPeers(ticker: string): Observable<any> {
  //   return this.http.get(`http://localhost:3000/peers/${ticker}`);
  // }


  // getRecommendationTrend(ticker: string): Observable<RecommendationTrends> {
  //   return this.http.get<RecommendationTrends>(`http://localhost:3000/recommendationTrends/${ticker}`);
  // }

  // getSocialSentiment(ticker: string): Observable<SocialSentiment> {
  //   return this.http.get<SocialSentiment>(`http://localhost:3000/socialSentiment/${ticker}`);
  // }

  // autoComplete(ticker: string): Observable<AutoComplete> {
  //   return this.http.get<AutoComplete>(`http://localhost:3000/autoComplete/${ticker}`);
  // }
}
