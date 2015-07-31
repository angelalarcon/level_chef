+function ($) {
  $(function(){
    
    var intro = introJs();

    intro.setOptions({
      steps: [
      {
        element: '.foota',
          intro: '<p class="h4 text-uc titulo"><i><img src="images/zz0.png" alt="..."></i><br></p><p>here you can find the user information and general settings.</p>',
          position: 'left'
        },
        {
          element: '.leonswaya',
          intro: '<p class="h4 text-uc titulo"> <i><img src="images/zz3.png" alt="..."></i><br></p><p>This is the main courses library, you can find courses in different subjects and levels.</p>',
          position: 'right'
        },
        {
          element: '.leonswayb',
          intro: '<p class="h4 text-uc titulo2"><i><img src="images/zz4.png" alt="..."></i></p><p>Organized training to get the most out of your learning time, follow a path and watch training on your own schedule and preferences.</p>',
          position: 'right'
        },
		{
          element: '.leonswayc',
          intro: '<p class="h4 text-uc titulo3"><i><img src="images/zz5.png" alt="..."></i></p><p>You are not alone, here you will find the community and online tutors to help you when you need it, ask them anything.</p>',
          position: 'right'
        },
		{
          element: '.leonswaye',
          intro: '<p class="h4 text-uc"><i><img src="images/zz7.png" alt="..."></i></p><p>These are your alerts</p>',
          position: 'left'
        }
      ],
      showBullets: true,
    });

    intro.start();

  });
}(jQuery);