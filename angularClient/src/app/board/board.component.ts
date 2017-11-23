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
  articles: Article[] = [];
  selectedArticle: Article;
  modifyArticle: Article;

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
      article => this.article = article,
      article => console.log(article)
    );
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

  whichToShow( which:number ) : void {
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
    // let modifyNote = document.getElementById('modifyNote').summernote();
    // console.log(modifyNote);
  }

  modify ( article:Article ) : void {
    // this.boardService.modify(article);
  }

  delete( article:Article ) : void {
    // this.articles = this.articles.filter(a => a !== article);
    this.boardService.deleteArticle(article).subscribe(
      this.getTotalArticle(),
      this.getArticleList(this.pageNo, this.articles_per_page),
      this.selectedArticle = null;
    );//location.reload());
  }

}
