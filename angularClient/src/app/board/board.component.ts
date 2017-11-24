import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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

  // clicked article
  selectedArticle: Article;
  // article being modified
  modifyArticle: Article;
  // paged articles
  articles: Article[] = [];
  // pager object
  pager: any = {};
  // paged articles
  // pagedArticles: any[];

  private pageNo : number = 1;
  private articles_per_page : number = 10;
  private navSize : number = 5;
  private totalArticle : number;

  constructor(
      private boardService:BoardService,
      private pagerService:PagerService,
      private route: ActivatedRoute,
      private location: Location
  ) {}

  ngOnInit() {
    this.getTotalArticle();
    this.getArticleList(this.pageNo, this.articles_per_page);
  }



  //  DB 안 거치고 리스트 뿌릴때 만든 속성값을 가지고 아티클 보여주기
  onSelect( article:Article ): void {
    // console.log(article);
    this.selectedArticle = article;
    this.boardService.showArticle(this.selectedArticle);
  }

  //  DB에서 seq 값으로 아티클 불러오기
  getArticle() : void {
    const seq = +this.route.snapshot.paramMap.get('seq');
    this.boardService.getArticle(seq).subscribe(
      article => this.selectedArticle = article,
      article => console.log(article)
    );
  }

  // get articles for pageNo
  getArticleList( pageNo:number, articles_per_page:number ): void {
    this.boardService.getArticleList(pageNo, articles_per_page)
      .subscribe(
        articles => {
          this.articles = articles;
          //console.log(this.totalArticle);
          //console.log(this.getTotalArticle());
        },
      );
  }

  // paging
  setPage( pageNo:number ) {
    if (pageNo < 1 || pageNo > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.totalArticle, pageNo, this.articles_per_page, this.navSize);
    // get current page of items
    // this.articles = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.getArticleList(pageNo, this.pager.articles_per_page);
  }

  getTotalArticle() : void {
    this.boardService.getTotalArticle()
      .subscribe(
        totalArticleCount => {
          this.totalArticle = totalArticleCount;
          this.setPage(1);
        }
      );
  }

  whichToShow( which:number ) : void {
    if(which ==1)
      this.modifyArticle = null;

    this.boardService.whichToShow(which);
  }

  write( subject:string ): void {
    this.boardService.nextSeq()
        .subscribe(
          (seq) => {
            console.log(`write.component next from nextSeq = ${seq}`),

            // call writeArticle service method
            this.boardService.writeArticle(
              {
                "user": {
                  "name":"victor",
                  "id":"wow"
                },
                subject,
                seq
              } as Article
            )
            .subscribe(
              (article) => {
                console.log("write.component article.seq = " + article.seq),
                this.articles.pop(),
                this.articles.splice(0, 0, article),
                console.log(this.articles)
                // location.reload() // array method를 이용해서 리로드 대신 사용
              },

            )

          }
        );
  }

  viewModify( article:Article ) : void {
    this.modifyArticle = article;
    this.boardService.showModifySummernote(article);
    // let modifyNote = document.getElementById('modifyNote').summernote();
    // console.log(modifyNote);
  }

  modify ( article:Article ) : void {
    this.boardService.modifyArticle(article).subscribe(
      article => this.selectedArticle = article,
      this.modifyArticle = null,
      // location.reload();

    );
  }

  delete( article:Article ) : void {
    console.log(article);
    // this.articles = this.articles.filter(a => a !== article);
    this.boardService.deleteArticle(article).subscribe(
      () => {
        this.selectedArticle = null;
        this.getTotalArticle();
        this.getArticleList(this.pageNo, this.articles_per_page);
        location.reload();
      }
    );
  }

}
