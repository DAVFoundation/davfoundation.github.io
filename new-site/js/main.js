$(document).ready(function(){   
  // color switch for nav    
   var scroll_start = 0;
   var startchange = $('#startchange');
   var offset = startchange.offset();
    if (startchange.length){
     $(document).scroll(function() { 
  
        scroll_start = $(this).scrollTop();
        if(scroll_start > offset.top) {
            $(".navbar-fixed-top").addClass('user-scroll');
         } else {
            $(".navbar-fixed-top").removeClass('user-scroll');
         }
     });
    }

    // full height hero
    var windowHeight = $(window).height();
    $('.hero .hero-inner').height(windowHeight);
    // $('.hero .hero-inner').height(windowHeight + windowHeight*0.18);

    $(window).on('resize',function() { 
      var windowHeight = $(window).height();
      $('.hero .hero-inner').height(windowHeight);
    });

    // modal vertical align
    $('.team-modal').on('shown.bs.modal', function (e) {
      // alert("Modal for " + $(this).attr('id') + " is open.")
      var windowHeight = $(window).height();
      var modalHeight = $(this).find('.modal-content').height();
      var modalTopPadding = (windowHeight - modalHeight)/2 - 30;
      // var modalTopPadding = (windowHeight + windowHeight*0.18 - modalHeight)/2 - 30;
      $('.modal-dialog').css('padding-top', modalTopPadding +'px');
    })

    // scroll nav
    $(".nav-scroll").find("a").click(function(e) {
      e.preventDefault();
      var offset = $('.navbar').height();
      // offset = offset + offset*0.15;
      var section = $(this).attr("href");
      $("html, body").animate({
        scrollTop: $(section).offset().top - offset
      }, 700);
    });

    //countdown
  // $('#countdown').countdown({until: new Date(2018, 9-1, 13), format: 'dHM'}); 
  $('#countdown').countdown(
    {until: $.countdown.UTCDate(-8, new Date(2018, 2, 14)), format: 'dHM'}
  );

});