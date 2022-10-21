export interface AutoComplete {
   count: number;  
   result: [{
     description: string;
     displaySymbol: string;
     symbol: string;
     type: string;
   }];
   error: string;
 }
 