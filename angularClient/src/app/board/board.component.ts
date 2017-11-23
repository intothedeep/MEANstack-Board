import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { BoardService } from '../board.service';
import { PagerService } from '../pager.service';


import { Article } from '../article';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  articles: Article[] = [];

  private pageNo : number = 1;
  private articles_per_page : number = 10;
  private navSize : number = 5;
  private totalArticle : number;

  constructor(
      private boardService:BoardService,
      private pagerService:PagerService
  ) {}

  ngOnInit() {
    this.getTotalArticle();
    this.getArticleList(this.pageNo, this.articles_per_page);
  }

  getArticleList( pageNo:number, articles_per_page:number ): void {
    this.boardService.getArticleList(pageNo, articles_per_page)
      .subscribe(
        articles => {
          this.articles = articles;
          //console.log(this.totalArticle);
          //console.log(this.getTotalArticle());
          this.pagerService.getPager(this.totalArticle, pageNo, articles_per_page, this.navSize);
        },
      );
  }

  getTotalArticle() : void {
    this.boardService.getTotalArticle()
      .subscribe(
        totalArticleCount => {
          this.totalArticle = totalArticleCount;
        }
      );
  }

  getArticle(seq: number): void {
    this.boardService.getArticle(seq)
      .subscribe(article => console.log(article));
  }

  whichToShow( which:number ) : void {
    this.boardService.whichToShow(which);
  }

  reloadList( pageNo:number, articles_per_page:number ) : void {
    console.log("11111111111111111111");
    this.getTotalArticle();
    console.log(this.totalArticle);
    this.getArticleList(pageNo, articles_per_page);
  }

}
