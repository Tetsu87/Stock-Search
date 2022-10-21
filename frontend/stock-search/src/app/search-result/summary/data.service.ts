import { Injectable, Input } from '@angular/core';
import { ResultService } from 'src/app/shared/results.service';

@Injectable({
  providedIn: 'root',
})

export class DataService {
  hourlyPriceData: any[] = [];
  @Input() userInput = '';

  constructor(private resultService: ResultService) {}

  getData(ticker:string) {
    this.resultService.getHistoricalData(ticker).subscribe((data) => {
      let dataLength = data?.t.length;
      for (let i = 0; i < dataLength; i++) {
        this.hourlyPriceData.push([data.t[i] * 1000, data.c[i]]);
      }
      console.log('hourlyPriceData is: ');
      console.log(this.hourlyPriceData);
      console.log('from getHistoricalData ends');
    }, error => {
       console.log("error dazeeeeee!!!");
    }
    );
    return this.hourlyPriceData;
  }
//   getData(ticker:string) {
//     this.resultService.getHistoricalData(ticker).subscribe((data) => {
//       let dataLength = data?.t.length;
//       for (let i = 0; i < dataLength; i++) {
//         this.hourlyPriceData.push([data.t[i] * 1000, data.c[i]]);
//       }
//       console.log('hourlyPriceData is: ');
//       console.log(this.hourlyPriceData);
//       console.log('from getHistoricalData ends');
//     }, error => {
//        console.log("error dazeeeeee!!!");
//     }
//     );
//     return this.hourlyPriceData;
//   }
}
