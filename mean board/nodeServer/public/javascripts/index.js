var board = angular.module("board", []);
  board.controller("boardCtl", ($scope) => {

});

$(function () {

  // 글보기, 글쓰기 뷰 전환
  $('#showArticle').click(function () {
    showArticle();
  });

  $('#showNote').click(function () {
    var noteDiv = $('.note-div');
    noteDiv.css('display', 'block');

    var articleDiv = $('.article-div');
    articleDiv.css('display', 'none');
  });

  //popover
  $(document).on('click', '.list-name', function () {
    var id = "victor";
    var info = "작성글<br>회원정보<br>쪽지보내기<br>";
    $('[data-toggle="popover"]').attr('display', 'none');

    $('[data-toggle="popover"]').popover({
      title: id,
      content: info,
      html: true,
      placement: "right",
    });
  });

});

var pageNo = 1;
var articles_per_page = 10;
var totalArticle = 0;
var navSize = 5;
// 페이지 로드시 리스트
$(document).ready(function() {
  getTotalArticle();
  reloadList(pageNo, articles_per_page);
});

// 글보기 화면에 데이터 호출 후 글보기 화면 호출
$(document).ready(function() {
  $(document).on('click', '.list-subject', function() {
    var seq = $(this).attr('data-seq');
    $.ajax({
      url: '/api/board/' + seq,
      type: 'GET',
      dataType: 'json'
    })
    .done(function(result) {
      // console.log(result);
      veiwArticle(result);
    })
    .fail(function() {
      console.log("error");
    })

  });
});

var veiwArticle = function (article) {
  var subject = $('.view-subject');
  var content = $('.view-content');

  subject.html(article.subject);
  content.html(article.content);
  showArticle();
};

// 리스트 불러오기
var reloadList = function (pageNo, articles_per_page) {
  //console.log(page);
  $.ajax({
    url: '/api/board/list/' + articles_per_page + '/' + pageNo,
    type: 'GET',
    dataType: 'json'
  })
  .done(function(data) {
    //console.log(data[0]._id);
    makeList(data);
    pagination(totalArticle, pageNo);
  })
  .fail(function() {
    console.log("error");
  })
};

// 리스트 뿌리기
var makeList = function (data) {
  var body = $('.tbody');
  body.empty();
  //console.log(data);
  var template = $('#list-template').html();

  $.each(data, function(i, article) {
    body.append(Mustache.render(template, article));
  });
};

// 페이징 처리
var getTotalArticle = function () {
  $.ajax({
    url: '/api/board/totalArticle',
    type: 'GET',
    dataType: 'json',
  })
  .done(function(result) {
    totalArticle = result;
    //console.log(totalArticle);
  })
  .fail(function() {
    console.log("error");
  });

}

var pagination = function (totalArticle, pageNo) {
    var startPage, endPage;
    var totalPage = parseInt( (totalArticle - 1) / articles_per_page + 1);
    var currentNavNum = parseInt( (pageNo - 1) / navSize );

    startPage = navSize * currentNavNum + 1;
    endPage = navSize * ( currentNavNum + 1 );

    var next = ((navSize * (currentNavNum + 1)) + 1);
    var previous = navSize * currentNavNum;

    endPage = (endPage < totalPage) ? endPage:totalPage;

    //console.log("totalArticle " + totalArticle);
    console.log("currentNavNum " + currentNavNum);
    console.log("totalPage " + totalPage);
    console.log("startPage " + startPage);
    console.log("endPage " + endPage);
    console.log("pageNo " + pageNo);
    console.log("---------------------------------");
    //var p = paging;


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

    // console.log(totalPage);
    // console.log(last);
}



// 글 제목 클릭 시 글보기 전환
var showArticle = function () {
  var noteDiv = $('.note-div');
  noteDiv.css('display', 'none');

  var articleDiv = $('.article-div');
  articleDiv.css('display', 'block');
};

// 글 쓰기!!!
$(document).ready(function() {

  $('.write-btn').click(function(event) {

    $.ajax({
      url: '/api/board/seq',
      type: 'PUT',
      dataType: 'json'
    })
    .done(function(result) {
      var next = result.next;
      console.log("seq = = = = =  " + next);
      write(next);
    })
    .fail(function() {
      console.log("error");
    })

  });


});

function write(next) {
  var subject = $('.write-subject').val();
  var content = $('#summernote').summernote('code');
  //console.log(subject + " " + content);

  var date = new Date();
  //console.log(date.getFullYear() + "/" + date.getMonth()  + "/" + date.getDate() + " " + date.getHours() );
  var time = date.getFullYear() + "/" + date.getMonth()  + "/" + date.getDate();// + " " + date.getHours();
  var article = {
    seq: next,
  	id: "victor",
    name: "intothedeep",
  	content : content,
  	subject : subject,
  	time: date
  };
  //console.log(article);

  $.ajax({
    url: '/api/board',
    type: 'POST',
    dataType: 'json',
    data: article
  })
  .done(function() {
    console.log("111111111111111111 " + pageNo);
    getTotalArticle();
    reloadList(pageNo, articles_per_page);
  })
  .fail(function() {
    console.log("error");
  })
};
