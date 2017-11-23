import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppRoutingModule }     from './app-routing.module';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { MessageComponent } from './message/message.component';

import { BoardService } from './board.service';
import { MessageService } from './message.service';
import { PagerService } from './pager.service';

//import { PagingDto } from './pagingDto';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    BoardService,
    MessageService,
    PagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
