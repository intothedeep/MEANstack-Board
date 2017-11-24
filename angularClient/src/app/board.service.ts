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
    'Content-Type' : 'application/json'
  })
};

@Injectable()
export class BoardService {

  private restUrl = 'http://localhost:80/api/board';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  // get articles from server
  getArticleList ( pageNo:number, articles_per_page:number ): Observable<Article[]> {
    const url = `${this.restUrl}/list/${articles_per_page}/${pageNo}`;
    return this.http.get<Article[]>(url)
      .pipe(
        tap(articles => this.log(`Get articleList from REST GET : ${url}`)),
        catchError(this.handleError('getArticleList', []))
      );
  }

  getTotalArticle () : Observable<number> {
    let url : string = this.restUrl + "/totalArticle";
    return this.http.get<number>(url)
      .pipe(
        tap(
          totalArticleCount => this.log(`Get # of articles : ${totalArticleCount} from REST GET : ${url}`)
        )
      );
  }

  getArticle ( seq:number ): Observable<Article> {
    let url = this.restUrl + "/" + seq;
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

    this.whichToShow(2);
    viewSubject.html(article.subject);
    viewContent.html(article.content);
    this.log('view an article with seq =  ' + article.seq);

  }

  whichToShow ( which : number ) : void {
    let writeDiv, viewDiv;
    writeDiv = $('.note_div');
    viewDiv = $('.article_div');

    var modifyDiv = $('.modify_div');

    // 1: writeDiv
    // 2: viewDiv
    // 3: modifyDiv
    if ( 1 == which ) {
      writeDiv.css({'display':'block'});
      viewDiv.css('display', 'none');
      modifyDiv.css('display', 'none');
    } else if ( 2 == which ) {
      writeDiv.css({'display':'none'});
      viewDiv.css('display', 'block');
      modifyDiv.css('display', 'none');
    } else if ( 3 == which ) {
      writeDiv.css({'display':'none'});
      viewDiv.css('display', 'none');
      modifyDiv.css('display', 'block');
    } else {
      writeDiv.css({'display':'none'});
      modifyDiv.css('display', 'none');
      viewDiv.css('display', 'none');
    }

    this.log("whichToShow 1.write 2.view 3.modify => " + which);

  }

  nextSeq () : Observable<number> {
    let url = `${this.restUrl}/seq/next`;
    let next:number;

    return this.http.get<number>(url)
      .pipe(
        tap(
          next => this.log(`next seq = ${next}`)
        ),
        catchError(
          this.handleError<any>('nextSeq')
        )
      );
  }

  writeArticle ( article:Article ) : Observable<Article>{
    let url = `${this.restUrl}`;
    let content : string = $('#summernote').summernote('code');
    var date = new Date();
    var time = date.getFullYear() + "/" + date.getMonth()  + "/" + date.getDate();// + " " + date.getHours();
    article.content = content;
    article.time = time;
    console.log(article);

    var obj = {
      seq : article.seq,
      subject : article.subject,
      content : article.content,
      id: article.user.id,
      name: article.user.name,
      time: article.time
    }
    this.whichToShow(2);
    return this.http.post<Article>(url, obj, httpOptions)
      .pipe(
        tap(
          (article: Article) => this.log(`Add Article with REST POST : ${url}`)
        ),
        catchError(
          this.handleError<Article>(`writeArticle REST POST url: ${url}`)
        )
      );
  }



  deleteArticle( article:Article | number ) : Observable<Article> {
    const seq = typeof article === 'number' ? article : article.seq;

    const url = `${this.restUrl}/${seq}`;

    return this.http.delete<Article>(url, httpOptions).pipe(
      tap(article => this.log(`deleted article with REST DELETE : url=${url}`)),
      catchError(this.handleError<Article>('DeletedArticle'))
    );
  }


  showModifySummernote ( article:Article ) : Observable<any> {
    var modifyNote = $('#modifyNote');
    this.whichToShow(3);
    modifyNote.summernote('code', article.content);
    return modifyNote;
  }

  modifyArticle ( article:Article ) : Observable<Article> {
    // const seq = typeof article === 'number' ? article : article.seq;
    const seq = article.seq;
    const url = `${this.restUrl}/${seq}`;
    let content = $('#modifyNote').summernote('code');
    article.content = content;
    this.whichToShow(0);
    return this.http.put<Article>(url, article, httpOptions)
      .pipe(
        tap(
          article => this.log(`updated article with REST PUT : url=${url}`)
        ),
        catchError(
            this.handleError<Article>('updated Article')
        )
      );
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
