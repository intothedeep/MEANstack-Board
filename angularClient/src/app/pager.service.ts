import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';

import { PagingDto } from './pagingDto';
import * as _ from 'underscore';

declare var $:any;

@Injectable()
export class PagerService {

  constructor() { }

  //  pager first try
  // getPager( totalArticle:number, pageNo:number = 1, articles_per_page:number = 10, navSize:number = 5 ) : void {
  //   console.log("board.component totalArticle = " + totalArticle);
  //   console.log("board.component pageNo = " + pageNo);
  //   //this.boardService.getPagination(this.totalArticle, this.pageNo, this.articles_per_page, this.navSize);
  //   let startPage : number;
  //   let endPage : number;
  //
  //   let totalPage : number = Math.trunc( (totalArticle - 1) / articles_per_page + 1);
  //   let currentNavNum : number = Math.trunc( (pageNo - 1) / navSize );
  //
  //   startPage = navSize * currentNavNum + 1;
  //   endPage = navSize * ( currentNavNum + 1 );
  //
  //   let next : number = ((navSize * (currentNavNum + 1)) + 1);
  //   let previous : number = navSize * currentNavNum;
  //
  //   endPage = (endPage < totalPage) ? endPage:totalPage;
  //
  //   console.log("======================================= ");
  //   console.log("boardService getPagination");
  //   console.log("navSize = " + navSize);
  //   console.log("current pageNo = " + pageNo);
  //   console.log("startPage = " + startPage);
  //   console.log("endPage = " + endPage);
  //   console.log("currentNavNum = " + currentNavNum);
  //   console.log("previous = " + previous);
  //   console.log("next = " + next);
  //   console.log("endPage 삼항 = " + endPage);
  //   console.log("======================================= ");
  //
  //   var template = "";
  //   if (currentNavNum == 0)
  //     template = '<li class="page-item"><a class="page-link" href="javascript: void(0);">이전</a></li>';
  //   else
  //     template = '<li class="page-item"><a class="page-link" onclick = "getArticleList(' + previous + ', ' + articles_per_page + ')" href="javascript: void(0);">이전</a></li>';
  //   for(var i=startPage; i<=endPage; i++) {
  //     template += '<li class="page-item"><a class="page-link" onclick = "getArticleList(' + i + ', ' + articles_per_page + ')" href="javascript: void(0);">' + i + '</a></li>';
  //   }
  //   if (endPage != totalPage)
  //     template += '<li class="page-item"><a class="page-link" (click) = "reloadList(' + next + ', ' + articles_per_page + ')" href="javascript: void(0);">다음</a></li>';
  //
  //   var pagerDiv = $('.pagination');
  //   //pagerDiv.empty();
  //   pagerDiv.html(template);
  // }

// pager 2nd try
  // getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
  getPager( totalArticle:number, pageNo:number = 1, articles_per_page:number = 10, navSize:number = 10 ) {
      // calculate total pages
      let totalPages = Math.ceil(totalArticle / articles_per_page);

      // mid value depending on navSize
      let mid = Math.trunc(navSize/2 + 1); // 5:3, 10:6

      let pagesBeforeMid = navSize - mid; // 5:3:2 10:6:4
      let pagesAfterMid = navSize - mid;
      if (mid%2 == 0) pagesBeforeMid += 1;

      let startPage: number, endPage: number;
      if (totalPages <= navSize) { //5, 10
          // less than 10 total pages so show all
          startPage = 1;
          endPage = totalPages;
      } else {
          // more than 10 total pages so calculate start and end pages
          if ( pageNo < mid ) { // 3, 6
              startPage = 1;
              endPage = navSize;
          } else if (pageNo + (navSize-mid) >= totalPages) { // 5:3:2, 10:6:4
              startPage = totalPages - (navSize - 1); // 4, 9
              endPage = totalPages;
          } else {
              startPage = pageNo - pagesBeforeMid; //
              endPage = pageNo + pagesAfterMid;
          }
      }

      // calculate start and end item indexes
      let startIndex = (pageNo - 1) * articles_per_page;
      let endIndex = Math.min(startIndex + articles_per_page - 1, totalArticle - 1);

      // create an array of pages to ng-repeat in the pager control
      let pages = _.range(startPage, endPage + 1);

      // return object with all pager properties required by the view
      return {
          totalArticle: totalArticle,
          pageNo: pageNo,
          articles_per_page: articles_per_page,
          totalPages: totalPages,
          startPage: startPage,
          endPage: endPage,
          startIndex: startIndex,
          endIndex: endIndex,
          pages: pages
      };
  }

}
