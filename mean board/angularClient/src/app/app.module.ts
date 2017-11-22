import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppRoutingModule }     from './app-routing.module';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { WriteComponent } from './write/write.component';
import { ViewComponent } from './view/view.component';

import { BoardService } from './board.service';
import { MessageComponent } from './message/message.component';
import { MessageService } from './message.service';
//import { PagingDto } from './pagingDto';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    WriteComponent,
    ViewComponent,
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
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
