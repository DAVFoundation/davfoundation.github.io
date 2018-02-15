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
    });

    //thank you modal
    var url = window.location.href;
    if(url.indexOf('?thank=you') != -1) {
        $('#modalThankYou').modal('show');
    }
    $('#modalThankYou').on('hidden.bs.modal', function (e) {
      document.location.href="/";
    });

    // scroll nav
    $(".nav").find("a.scroll-link").click(function(e) {
      e.preventDefault();
      $('.navbar-collapse').removeClass('in');
      $('.navbar-toggle').addClass('collapsed');
      var offset = $('.navbar').height();
      // offset = offset + offset*0.15;
      var section = $(this).attr("href");
      $("html, body").animate({
        scrollTop: $(section).offset().top - offset
      }, 700);
    });

    $("a[href=#dav-team]").click(function(e) {
      e.preventDefault();
      var offset = $('.navbar').height();
      // offset = offset + offset*0.15;
      var section = "#team";
      $("html, body").animate({
        scrollTop: $(section).offset().top - offset
      }, 700);
    });

    //daily video
    var channelID = 'UCPuAOygDwCiLOdLosiQJJ1w';
    $.get(
      "https://www.googleapis.com/youtube/v3/channels",{
        part: 'contentDetails',
        id: channelID,
        key: 'AIzaSyDFsWKhs1WKWskhk6DErKtNCy-TR57EPbM'
      },function(data){
        $.each(data.items,function(i, item){
          // console.log(item);
          pid = item.contentDetails.relatedPlaylists.uploads;
          pid = "PLpqJF_iMOExdrA0eJjhIk1Ies4jqAXawD";
          // pid = "PLpqJF_iMOExd-la7-aIFbcOd1WN4RwzWU";
          getVids(pid);
        });
      }
    );

    function getVids(pid){
      $.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",{
        part: 'snippet',
        maxResults: 1,
        playlistId: pid,
        key: 'AIzaSyDFsWKhs1WKWskhk6DErKtNCy-TR57EPbM'
      },function(data){
        var output;
        $.each(data.items,function(i, item){
          // console.log(item);
          // videoTitle = item.snippet.title;
          videoId = item.snippet.resourceId.videoId;
          // thumbnail = item.snippet.thumbnails.medium.url;
          // channelTitle = item.snippet.channelTitle;
          // output = '<div><div><a href="#" class="thumb-link" id="' + videoId + '"><img src="' + thumbnail + '"><br> <h5>' + videoTitle + '</h5></a></div></div>';
          output = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId + '?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
          //Append videos to carousel
            $('#daily-video').append(output);
        })
      }
    );
    }


    $("#contactForm").validate({
          ignore: ":hidden",
          rules: {
              Name: {
                  required: true,
                  minlength: 3
              },
              Company: {
                  required: true,
                  minlength: 3
              },
              Title: {
                  required: true,
                  minlength: 3
              },
              Email: {
                  required: true
              }//,
              // message: {
              //     required: true,
              //     minlength: 10
              // }
          },
          submitHandler: function (form) {
              $.ajax({
                  type: "POST",
                  url: "https://formspree.io/alick@dav.network",
                  data: $(form).serialize(),
                  dataType: "json",
                  success: function () {
                      // $(form).html("<div id='message'></div>");
                      $('#messageBox')
                          .fadeIn(1500, function () {
                          $('#messageBox').append("<h4>Your message was sent!</h4>");
                      });
                      $(form)[0].reset();
                  }
              });
              return false; // required to block normal submit since you used ajax
          }
      });
    
  // media galley
  $('.slick-gallery').slick({
  nextArrow: '<img class="arrow-right" src="img/media/arrow-right.png" />',
  prevArrow: '<img class="arrow-left" src="img/media/arrow-left.png" />',
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 769,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});
    //countdown
  // $('#countdown').countdown(
  //   {until: $.countdown.UTCDate(-8, new Date(2018, 3, 30)), format: 'dHM'}
  // );

});

//dav cli clip
    var vidShowAndTell = document.querySelector('video');
    // Start playing the video as soon as the user scrolls
    var scrollAction = function() {
      window.removeEventListener('scroll', scrollAction);
      vidShowAndTell.play();
    };
    window.addEventListener('scroll', scrollAction);