import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { BoardService } from '../board.service';
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
      private boardService:BoardService
  ) {}

  ngOnInit() {
    this.getTotalArticle();
    this.getArticleList(this.pageNo, this.articles_per_page);
  }

  getArticleList( pageNo:number, articles_per_page:number ): void {
    console.log("articleList totalArticle = " + totalArticle);
    this.boardService.getArticleList(pageNo, articles_per_page)
      .subscribe(
        articles => {
          this.articles = articles;
          //console.log(this.totalArticle);
          //console.log(this.getTotalArticle());
          this.getPagination(this.totalArticle, pageNo, articles_per_page, this.navSize);
        },
      );
  }

  getTotalArticle() : number {
    return this.boardService.getTotalArticle()
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

  getPagination( totalArticle:number, pageNo:number, articles_per_page:number, navSize:number ) : void {
    console.log("board.component totalArticle = " + totalArticle);
    console.log("board.component pageNo = " + pageNo);
    //this.boardService.getPagination(this.totalArticle, this.pageNo, this.articles_per_page, this.navSize);
    let startPage : number;
    let endPage : number;

    let totalPage : number = Math.trunc( (totalArticle - 1) / articles_per_page + 1);
    let currentNavNum : number = Math.trunc( (pageNo - 1) / navSize );

    startPage = navSize * currentNavNum + 1;
    endPage = navSize * ( currentNavNum + 1 );

    let next : number = ((navSize * (currentNavNum + 1)) + 1);
    let previous : number = navSize * currentNavNum;

    endPage = (endPage < totalPage) ? endPage:totalPage;

    console.log("======================================= ");
    console.log("boardService getPagination");
    console.log("navSize = " + navSize);
    console.log("current pageNo = " + pageNo);
    console.log("startPage = " + startPage);
    console.log("endPage = " + endPage);
    console.log("currentNavNum = " + currentNavNum);
    console.log("previous = " + previous);
    console.log("next = " + next);
    console.log("endPage 삼항 = " + endPage);
    console.log("======================================= ");

    var template = "";
    if (currentNavNum == 0)
      template = '<li class="page-item"><a class="page-link" href="javascript: void(0);">이전</a></li>';
    else
      template = '<li class="page-item"><a class="page-link" (click) = "reloadList(' + previous + ', ' + articles_per_page + ')" href="javascript: void(0);">이전</a></li>';
    for(var i=startPage; i<=endPage; i++) {
      template += '<li class="page-item"><a class="page-link" (click) = "reloadList(' + i + ', ' + articles_per_page + ')" href="javascript: void(0);">' + i + '</a></li>';
    }
    if (endPage != totalPage)
      template += '<li class="page-item"><a class="page-link" (click) = "reloadList(' + next + ', ' + articles_per_page + ')" href="javascript: void(0);">다음</a></li>';

    var pagination = $('.pagination');
    pagination.empty();
    pagination.html(template);
  }

  reloadList( pageNo:number, articles_per_page:number ) : void {
    console.log("11111111111111111111");
    this.getTotalArticle();
    console.log(this.totalArticle);
    this.getArticleList(pageNo, articles_per_page);
  }

}
