import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { News } from 'src/app/model/news';

@Component({
  selector: 'app-news-modal',
  templateUrl: './news-modal.component.html',
  styleUrls: ['./news-modal.component.css'],
})
export class NewsModalComponent implements OnInit {
  closeResult = '';
  @Input() article:News;

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  closeModal() {
    this.activeModal.close();
  }

  encode(value: string): string {
    return encodeURIComponent(value);
  }

  getTwitterUrl(): string {
    return `https://twitter.com/intent/tweet?text=${this.encode(this.article.headline)}&url=${this.encode(this.article.url)}`;
  }

  getFacebookUrl(): string {
    return `https://www.facebook.com/sharer/sharer.php?u=${this.encode(this.article.url)}&src=sdkpreparse`;
  }

 
}
