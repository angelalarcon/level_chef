$('#carousel_banner').carousel({
  interval: 2000
})

$('#carousel_courses').carousel({
  interval: 30000
})

$('.modal').click(function() {
   vimeoWrap = $('#video_home');
   vimeoWrap.html( vimeoWrap.html() );
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



