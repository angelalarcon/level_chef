$('#carousel_banner').carousel({
  interval: 2000
})

$('#carousel_courses').carousel({
  interval: 30000
})

$('.modal').click(function() {
  $('#video_from_modal').get(0).pause()
  if ($('body').hasClass('modal-open')) {
    $('body').addClass('modal-close');
  }
});

$('.play').click(function() {
  if ($('body').hasClass('modal-close')) {
    $('body').removeClass('modal-close');
  }
});

$(window).on('scroll', function () {
    var scrollTop = $(window).scrollTop();
    if (scrollTop > ($('section.red').height())/2) {
      $('header').addClass('navbar-default')
      $('header').removeClass('navbar-transparent')   
    }
    else {
      $('header').removeClass('navbar-default')
      $('header').addClass('navbar-transparent')   
    }
});
