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

    // iOS cursor fix
    // Detect ios 11_x_x affected  
    // NEED TO BE UPDATED if new versions are affected
    var ua = navigator.userAgent,
    iOS = /iPad|iPhone|iPod/.test(ua),
    iOS11 = /OS 11_0|OS 11_1|OS 11_2/.test(ua);

    // ios 11 bug caret position
    if ( iOS && iOS11 ) {

        // Add CSS class to body
        $("body").addClass("iosBugFixCaret");

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
          // ignore: ":hidden",
          rules: {
              Name: {
                  required: true,
                  minlength: 3
              },
              Company: {
                  required: true,
                  minlength: 3
              },
              Email: {
                required: true,
                email: true
              }//,
              // message: {
              //     required: true,
              //     minlength: 10
              // }
          },
          messages: {
              Name: "Please specify your name",
              Company: "Please specify your company",
              Email: {
                required: "Invalid email",
                email: "Invalid email"
              }
            },
          submitHandler: function (form) {
              $.ajax({
                  type: "POST",
                  url: "https://formspree.io/alick@dav.network",
                  data: $(form).serialize(),
                  dataType: "json",
                  success: function () {
                      // $(form).html("<div id='message'></div>");
                      // $('#messageBox')
                      //     .fadeIn(1500, function () {
                      //     $('#messageBox').append("<h4>Your message was sent!</h4>");
                      // });
                      $("#modalMessage").modal('hide');
                      $(form)[0].reset();
                      $("#modalThankYouAlliance").modal('show');
                  }
              });
              return false; // required to block normal submit since you used ajax
          }
      });

  // show more media press
  $("a.show-more").click(function(e) {
      e.preventDefault();
      $(".hidden-press").fadeToggle();
      var word = $(this).find("span");
      if( word.text() == 'more'){
        word.text("less");
      }else{
        word.text("more");
      }
  });

  $("a.show-articles").click(function(e) {
      e.preventDefault();
      $(".hidden-articles").fadeToggle();
      var word = $(this).find("span");
      if( word.text() == 'more'){
        word.text("less");
      }else{
        word.text("more");
      }
  });

  // alert announcement

    $('#alert-announcement').on('closed.bs.alert', function () {
        setCookie('alert-dav', true, 365);
        return false;
    })
    
    function getCookie(c_name) {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start == -1) {
            c_value = null;
        } else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start, c_end));
        }
        return c_value;
    }

    function setCookie(c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    }

    if (getCookie('alert-dav') === "true") {
       $('#alert-announcement').hide();
    }
    
  
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


    var announcementTrigger = document.querySelector('.video-home');
    var scrollAnouncement = function() {
      window.removeEventListener('scroll', scrollAnouncement);
      $("#alert-announcement").removeClass('hide');
    };
    window.addEventListener('scroll', scrollAnouncement);

// contributors section
$(function() {
    $.getJSON( "github-contributors.json", function( data ) {
      var modalTrigger = [];
      var modalContributor = [];
      $.each( data, function( key, val ) {
        modalTrigger.push( "<li><a href='#contributor-" + key + "' data-toggle='modal' data-target='#contributor-" + key + "'><img src='" + val.avatar + "'></a></li>" );
      });
      $.each( data, function( key, val ) {
        var repo = "";
        for (var i = 0; i < val.repos.length; i++) {
          if (i != val.repos.length - 1) {
            repo += "<a href='" + val.repos[i].url + "' class='repo-contrib' target='_blank'>" + val.repos[i].name + "</a>,"
          }else{
            repo += "<a href='" + val.repos[i].url + "' class='repo-contrib' target='_blank'>" + val.repos[i].name + "</a>"
          }
            
        }
        modalContributor.push( "<div class='modal team-modal' id='contributor-" + key + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-body'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><div class='row'><div class='col-sm-4'><br><br><img src='" + val.avatar + "' width='100%'></div><div class='col-sm-8'><h2>" + val.name + "</h2><h5>Open Source Contributor</h5><p><i>&ldquo;" + val.bio + "&rdquo;</i></p><p>Contributed to the following DAV repositories: " + repo + "</p><p>Contributions in the last year: <b>" + val.contrib_count + "</b></p><a href='https://github.com/" + val.user + "' target='_blank'><img src='img/icons/github-footer.png' width='25'></a></div></div></div></div></div></div>" );
      });
     
      $( "<ul/>", {
        "class": "contributors-list",
        html: modalTrigger.join( "" )
      }).appendTo( ".contributors" );
     
      $( "<div/>", {"class": "contributors-modal", html: modalContributor.join( "" )}).appendTo( "body" );
    });
});    
