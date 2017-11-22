$(document).ready(function() {
  $('#summernote').summernote({
    lang: 'ko-KR', // default: 'en-US'
    focus: true,
    height: 250,
    airMode: false,
    placeholder: '여기에 작성해 주세요!',
    dialogsInBody: true
  });
});
