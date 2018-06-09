$(document).ready(function(){

    var mailInput = $('#email-input');
    var mailCheckButton = $('#submit-email');
    var mailCheckForm = $('#email-form');

    mailCheckButton.submit(function (e){
        e.preventdefault()
        checkEmail(mailInput.val())
    })

    mailCheckButton.click(function (){
        checkEmail(mailInput.val())
    })

    $('#copy-to-clipboard').click(function() {
        var copyText = document.querySelector("#construct-address");
        copyText.select();
        document.execCommand("copy");
    })

    $('#forgot-wallet-address').click(function() {
        forgotWalletAddress(mailInput.val());
    })
});

function checkEmail(email) {
    if (validateEmail(email)) {
        return kycCheck(email);
    } 
    var errorMsg = $('#error-msg');
    showErrorMsg(errorMsg, "Please enter a valid email address.");
}

function kycCheck(email) {
    var url = "https://nessie.dav.network/status?email=" + email;
    $('#container').addClass('go-out');
    $(".kyc-error").hide();
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: kycHendler(email)
    });
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function kycHendler(email) {
    return function(data) {
        // var foo = 'ManualFinish'
        var title = '';
        switch(data.statusText) {
            case "ManualFinish":
                startTokenSale();
            case "CheckRequired":
                title = "Your KYC application is currently being processed.";
                $(".kyc-response").text("You’ll receive an email once your application has been processed with next steps.");
                $(".kyc-close,.kyc-telegram3").removeClass('hide');
                showErrorPage(title);
                break;
            case "Rejected":
                title = "Your KYC application has not been accepted.";
                $(".kyc-response").html("If you believe your KYC has been rejected by mistake we ask that you please resubmit your KYC by clicking the button below. "
                +"Our systems tell us you should be able to successfully complete your KYC by doing the following:<br><br><b>" + data.suggestionText + "</b>");
                $(".kyc-button,.kyc-medium,.kyc-telegram2").removeClass('hide');
                $(".kyc-button").attr("href","https://nessie.dav.network/join?email="+email);
                showErrorPage(title);
                break;
            case "Expired":
                title = "Your KYC application has expired.";
                $(".kyc-response").text("We ask you to please resubmit your KYC by clicking the button below.");
                $(".kyc-close,.kyc-medium,.kyc-telegram2").removeClass('hide');
                showErrorPage(title);
            break;
            case "Started":
                window.location.href = "https://nessie.dav.network/join?email=" + email;
                break;
            default:
            break;
        }
    }
}

function showErrorPage(title) {
    $('.kyc-title').text(title);
    $('.kyc-title, .kyc-response').removeClass('hide');
    $('.right-section .welcome-section').addClass('hide');
    $('#container').removeClass('go-out')
}

function startTokenSale() {
    $('.token-sale').show();
    $('.welcome-section, .error').addClass('hide');
    $('#container').removeClass('go-out').addClass('sale-page');
}

function showErrorMsg(el, msg) {
    el.show();
    el.animateCss("shake");
    el.text(msg);
}

function forgotWalletAddress() {
    $('.prompt.success').removeClass('hide');
    setTimeout(function () {
        $('.prompt.success').addClass('hide');  
    }, 5000)
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
  