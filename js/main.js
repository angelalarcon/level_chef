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

$('#settings').click(function(){
  $('#bs-example-navbar-collapse-1').removeClass('in');
});

$('#menu_home').click(function(){
  $('#user_menu').removeClass('in');
});

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
