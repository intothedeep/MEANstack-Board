import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Article } from './article';
import { MessageService } from './message.service';

declare var $:any;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable()
export class BoardService {

  private restUrl = 'http://localhost:80/api/board/';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  // get articles from server
  getArticleList ( pageNo:number, articles_per_page:number ): Observable<Article[]> {
    const url = `${this.restUrl}list/${articles_per_page}/${pageNo}`;
    return this.http.get<Article[]>(url)
      .pipe(
        tap(articles => this.log(`Get articleList from REST GET : ${url}`)),
        catchError(this.handleError('getArticleList', []))
      );
  }

  getTotalArticle () : Observable<number> {
    let url : string = this.restUrl + "totalArticle";
    return this.http.get<number>(url)
      .pipe(
        tap(
          totalArticleCount => this.log(`Get # of articles : ${totalArticleCount} from REST GET : ${url}`)
        )
      );
  }

  getArticle ( seq:number ): Observable<Article> {
    let url = this.restUrl + seq;
    return this.http.get<Article>(url)
      .pipe(
        tap(
          _ => this.log(`Get article with seq=${seq} REST GET : ${url}`)
        ),
        catchError(
          this.handleError<Article>(`getArticle seq=${seq}`)
        ),
        tap(
          article => this.showArticle(article)
        )
      );
  }

  showArticle ( article:Article ): void {
    let viewSubject = $('.view_subject');
    let viewContent = $('.view_content');

    let writeDiv, viewDiv;
    writeDiv = $('.note_div');
    viewDiv = $('.article_div');
    //console.log(viewDiv);
    writeDiv.css({'display':'none'});
    viewDiv.css('display', 'block');

    viewSubject.html(article.subject);
    viewContent.html(article.content);
  }

  getPagination( totalArticle:number, pageNo:number, articles_per_page:number, navSize:number ) : void {
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
    console.log("startPage = " + startPage);
    console.log("endPage = " + endPage);
    console.log("currentNavNum = " + currentNavNum);
    console.log("previous = " + previous);
    console.log("next = " + next);
    console.log("endPage 삼항 = " + endPage);
    console.log("======================================= ");

    var template = "";
    if (currentNavNum == 0)
      template = '<li class="page-item"><a class="page-link" href="#">이전</a></li>';
    else
      template = '<li class="page-item"><a class="page-link" href="javascript:reloadList(' + previous + ', articles_per_page);">이전</a></li>';
    for(var i=startPage; i<=endPage; i++) {
      template += '<li class="page-item"><a class="page-link" href="javascript:reloadList(' + i + ', articles_per_page);">' + i + '</a></li>';
    }
    if (endPage != totalPage)
      template += '<li class="page-item"><a class="page-link" href="javascript:reloadList(' + next + ', articles_per_page);">다음</a></li>';

    var pagination = $('.pagination');
    pagination.empty();
    pagination.html(template);    

  }











  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('BoardService => ' + message);
  }
}
