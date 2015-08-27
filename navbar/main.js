$(window).on('scroll', function () {
  var scrollTop = $(window).scrollTop();
  if (scrollTop > ($('section.red').height())/2) {
    $('#about header').addClass('colored')
    $('#about header').removeClass('transparent')   
  }
  else {
    $('#about header').removeClass('colored')
    $('#about header').addClass('transparent')   
  }
});