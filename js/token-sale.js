$(document).ready(function(){

    var mailInput = $('#email-input');
    var maleCheckButton = $('#submit-email');

    maleCheckButton.click(function (){
        checkEmail(mailInput.val())
    })
});

function checkEmail(email) {
    if (validateEmail(email)) {
        return kycCheck(email);
    }
    var errorMsg = $('#error-msg');
    errorMsg.show();
    errorMsg.animateCss("shake");
    errorMsg.text("Please enter a valid email address.");
}

function kycCheck(email) {
    var url = "https://nessie.dav.network/status?email=" + email;
    // alert("KYC check click " + email);
    $(".kyc-loader").removeClass('hide');
    $(".kyc-error").hide();
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: kycHendler
    });
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

  function kycHendler(data) {
    // $(".kyc-response").text(data.suggestionText);
    var title = '';
    switch(data.statusText) {
        case "AutoFinish":
        case "ManualFinish":
            startTokenSale();
        case "Failed":
        case "CheckRequired":
            title = "Your KYC application is currently being processed.";
            $(".kyc-response").text("You’ll receive an email once your application has been processed with next steps.");
            $(".kyc-close,.kyc-telegram3").removeClass('hide');
            break;
        case "Rejected":
            title = "Your KYC application has not been accepted.";
            $(".kyc-response").html("If you believe your KYC has been rejected by mistake we ask that you please resubmit your KYC by clicking the button below. Our systems tell us you should be able to successfully complete your KYC by doing the following:<br><br><b>" + data.suggestionText + "</b>");
            $(".kyc-button,.kyc-medium,.kyc-telegram2").removeClass('hide');
            $(".kyc-button").attr("href","https://nessie.dav.network/join?email="+email);
            break;
        case "Expired":
            title = "Your KYC application has expired.";
            $(".kyc-response").text("We ask you to please resubmit your KYC by clicking the button below.");
            $(".kyc-close,.kyc-medium,.kyc-telegram2").removeClass('hide');
            break;
        case "Started":
            title = "Your KYC application failed to process."
            $(".kyc-response").text("Our systems tell us the email address you used is not valid. We ask that you please resubmit your KYC by clicking the button below and providing a valid email address.");
            $(".kyc-button,.kyc-medium,.kyc-telegram2").removeClass('hide');
            $(".kyc-button").attr("href","https://nessie.dav.network/join?email="+email);
            break;
        default:
          break;
          $(".kyc-title").text(title);

    }
}

function startTokenSale() {

}

$.fn.extend({
    animateCss: function(animationName, callback) {
      var animationEnd = (function(el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd',
        };
  
        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      })(document.createElement('div'));
  
      this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);
  
        if (typeof callback === 'function') callback();
      });
  
      return this;
    },
  });
  