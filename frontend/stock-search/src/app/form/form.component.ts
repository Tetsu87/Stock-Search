// import {
//   Component,
//   OnInit,
//   OnChanges,
//   SimpleChanges,
//   ViewChild,
//   Input,
//   Output,
//   EventEmitter,
// } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Location } from '@angular/common';
// import { Subject, Subscription } from 'rxjs';
// import {
//   switchMap,
//   debounceTime,
//   distinctUntilChanged,
//   tap,
// } from 'rxjs/operators';
// import { Description } from '../model/description';
// import { ResultService } from 'src/app/shared/results.service';
// import { GeneralInfoComponent } from '../search-result/general-info/general-info.component';
// import { SearchResultComponent } from '../search-result/search-result.component';
// import { ActivatedRoute } from '@angular/router';
// import { Router } from '@angular/router';
// import { FormControl } from '@angular/forms';
// import { AutoComplete } from '../model/autoComplete';

// @Component({
//   selector: 'app-form',
//   templateUrl: './form.component.html',
//   styleUrls: ['./form.component.css'],
// })
// export class FormComponent implements OnInit {
//   subscription: Subscription;
//   descriptions: Description;
//   isDisplayOn: boolean = false;
//   isLoading: boolean = false;
//   isComplete: boolean = false;
//   options: any[] = [];
//   myFormControl = new FormControl('');
//   @Output() myEvent = new EventEmitter<string>();

//   constructor(
//     private resultService: ResultService,
//     private route: ActivatedRoute,
//     private router: Router,
//     private location:Location
//   ) {}
//   @ViewChild(SearchResultComponent)
//   private searchResultComponent: SearchResultComponent;

//   ngOnInit(): void {
//     this.subscription = this.myFormControl.valueChanges
//       .pipe(debounceTime(500), distinctUntilChanged())
//       .subscribe((selectedValue) => {
//         this.isComplete = false;
//         // console.log(selectedValue);
//         this.autoComplete(selectedValue);
//       });
//   }

//   //original ver
//   onClick(input: string) {
//     this.resultService.getDescription(input).subscribe((data) => {
//       this.descriptions = data;
//       if (this.descriptions.name != null) {
//         this.searchResultComponent?.updateSearchResult();
//         // console.log(this.isDisplayOn);
//         this.isDisplayOn = true;
//         // console.log(this.isDisplayOn);
//         // console.log('from form on click');
//         this.navigateToDetails(input);
//         // this.changeURL();
//         // console.log('test test');
//       } else {
//         this.isDisplayOn = false;
//       }
//     });
//   }

//   changeURL(){
//     this.location.replaceState('/search/' + this.userInput);
//   }

//   sendUserInput(value:string){
//     this.myEvent.emit(value);
//   }

//   // autoComplete() {
//   autoComplete(typing: string) {
//     this.options = [];
//     // console.log('autocomplete starts: ');
//     // console.log(this.isLoading);
//     if (typing.length > 0) {
//       this.isLoading = true;
//       // console.log(this.isLoading);
//       this.resultService.autoComplete(typing).subscribe(
//         // this.resultService.autoComplete(this.userInput).subscribe(
//         (data) => {
//           // console.log('loading now');
//           for (let i = 0; i < Object.keys(data.result).length; i++) {
//             if (
//               data.result[i].type.includes('Common') &&
//               !data.result[i].symbol.includes('.')
//             ) {
//               let description: string = data.result[i].description;
//               let symbol: string = data.result[i].symbol;
//               this.options.push([description, symbol]);
//             }
//           }
//         },
//         (error) => {
//           // console.log('autocomplete error');
//         },
//         () => {
//           this.isLoading = false;
//           this.isComplete = true;
//           // console.log('autocomplete finised!!!');
//           // console.log(this.isLoading);
//         }
//       );
//     }
//   }

//   onClickClear() {
//     this.userInput = '';
//     this.isDisplayOn = false;
//     this.navigateToHome();
//   }

//   navigateToDetails(input: string) {
//     // console.log('navigating detail...');
//     this.router.navigate(['/search', input]);
//     // console.log('navigating detail ends...');
//   }

//   navigateToHome() {
//     this.router.navigate(['/search/home']);
//   }

//   // isGetLatestPriceCompleted:boolean = false;
//   // isGetDescriptionCompleted:boolean = false;
//   // isHistoricalDataCompleted:boolean = false;
//   // isPeersCompleted:boolean = false;
//   // isNewsCompleted:boolean = false;
//   // isGetHistoricalDailyDataCompleted:boolean = false;
//   // isGetRecommendationTrendCompleted:boolean = false;
//   // isGetSocialSentimentCompleted: boolean = false;
//   // isGetEarningCompleted:boolean = false;
// }
