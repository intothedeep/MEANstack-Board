import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { BoardService } from '../board.service';

import { Article } from '../article';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit {
  // @Input() article : Article;
  article: Article = new Article();

  constructor(
    private boardService:BoardService
  ) { }

  ngOnInit() {
  }

  write( subject:string ): void {

    this.boardService
      .nextSeq()
        .subscribe(
          (seq) => {
            console.log(`write.component next from nextSeq = ${seq}`),

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
              article => console.log("write.component article.subject = " + article)
            )
          }
        );



  }

}
