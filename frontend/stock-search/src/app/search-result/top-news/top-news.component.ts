import { Component, OnInit,Input ,EventEmitter, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { News } from 'src/app/model/news';
import { ResultService } from 'src/app/shared/results.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NewsModalComponent } from './news-modal/news-modal.component';

@Component({
  selector: 'app-top-news',
  templateUrl: './top-news.component.html',
  styleUrls: ['./top-news.component.css'],
})
export class TopNewsComponent implements OnInit {
  @Input() userInput ='';
  @Output() getNewsCompletedOn = new EventEmitter<string>();
  @Output() getNewsReset = new EventEmitter<string>();
  news: News[]=[];
  closeResult = '';

  constructor(
    private resultService: ResultService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getNews();
  }

  openModal(article:News){
    this.modalService.open(NewsModalComponent).componentInstance.article = article;
    // this.modalService
    //   .open(NewsModalComponent, { ariaLabelledBy: 'modal-basic-title' })
    //   .result.then(
    //     (result) => {
    //       this.closeResult = `Closed with: ${result}`;
    //     },
    //     (reason) => {
    //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //     }
    //   );
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


  getNews(){
    this.route.paramMap.subscribe((params)=> {
      this.getNewsReset.emit();
      const newsObservable = this.resultService.getNews(params.get("userInput").toUpperCase()).subscribe(
        (data) => {
        this.news = [];
        let numOfArticles = 0;
        let length = Object.keys(data).length;
  
        let i = 0;
        while (numOfArticles <20 && i < length){
          if (data[i].image.length !=0 && data[i].headline.length !=0){
            this.news.push(data[i]);
            numOfArticles++;
          }
          i++
        }
      },
      (error) => {
        // console.log("getNews from summary error");
      },
      () => {
        // console.log("getNews from summary completed");
        this.getNewsCompletedOn.emit();
        // console.log("getNews emit done");
      }
      );
    })
  }

  updateNews(){
    this.getNews();
  }

}
