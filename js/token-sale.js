var moreBeneficial = false;

$(document).ready(function(){

    var mailInput = $('#email-input');
    var mailCheckButton = $('#submit-email');
    var mailCheckForm = $('#email-form');
    var ounerDetailsForm = $('#ouner-details-form');
    var anotherPersonDetails = $('#another-person');
    var curtain = $('#curtain');
    var prompMsg = $('.prompt');

    mailCheckForm.submit(function (event){
        event.preventDefault()
        checkEmail(mailInput.val())
    })

    mailCheckButton.click(function (){
        checkEmail(mailInput.val())
    })

    ounerDetailsForm.find('input[type="radio"]').click(function(){
        if (this.value) {
            moreBeneficial = false;
            anotherPersonDetails.addClass('hide');
        } else {
            moreBeneficial = true;
            anotherPersonDetails.removeClass('hide');
        }
    });

    ounerDetailsForm.submit(function (event) {
        event.preventDefault();
        if (validateOunerDetailsForm(ounerDetailsForm, moreBeneficial)) {
            $('#container').addClass('go-out');
            var addressInfo = ounerDetailsForm.serialize();
            addressInfo = addressInfo + '&email=' + mailInput.val();
            $.ajax({
                type: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                url: 'https://nessie.dav.network/tokensalevalidation?',
                data: addressInfo,
                success: startTokenSale
            });
            
        }
    })
    function disableEnableSubmitMoreDetailsButton() {
        var isUserAgreed = true;
        ounerDetailsForm.find('[type="checkbox"]').each(function(index, checkbox) {
            if (!$(checkbox).is(':checked')) isUserAgreed = false;
        });
        if (isUserAgreed) {
            ounerDetailsForm.find('[type="submit"]').removeClass('disabled').prop('disabled', false);
        } else {
            ounerDetailsForm.find('[type="submit"]').addClass('disabled').prop('disabled', true);
        }    
    }

    disableEnableSubmitMoreDetailsButton();
    ounerDetailsForm.find('[type="checkbox"]').change(disableEnableSubmitMoreDetailsButton);

    $('input').focus(function() {
        $(this).removeClass('invalid');
    })

    $('#copy-to-clipboard').click(function() {
        var copyText = document.querySelector("#contracts-address");
        try {
            iosCopyToClipboard(copyText);
        }
        finally {
            copyToClipboard ();
            ga('send', 'event', 'CopyToClipboard-Button-Click', 'click', 'CopyToClipboard-Button-Click');
        }

        function copyToClipboard () {
            copyText.select();
            document.execCommand("copy");
            prompMsg.removeClass('hide');
            setTimeout(function() {
                prompMsg.addClass('hide');
            }, 3000);    
        }
    })

    $('#forgot-wallet-address').click(function() {
        forgotWalletAddress(mailInput.val());
        ga('send', 'event', 'ForgotWalletAddress-Button-Click', 'click', 'ForgotWalletAddress-Button-Click');
    })
    
    $('#another-wallet').click(function() {
        curtain.removeClass('hide');
        $('#another-wallet-modal').removeClass('hide');
        ga('send', 'event', 'UseAnotherWallet-Button-Click', 'click', 'UseAnotherWallet-Button-Click');
    })

    $('.close-button').click(function() {
        curtain.addClass('hide');
        $('#modal').addClass('hide');
        $('#another-wallet-modal').addClass('hide');

    })
});

function checkEmail(email) {
    email = email.trim();
    if (validateEmail(email)) {
        return kycCheck(email);
    } 
    var errorMsg = $('#error-msg');
    showErrorMsg(errorMsg, "Please enter a valid email address.");
}

function kycCheck(email) {
    var url = "https://nessie.dav.network/status?email=" + encodeURIComponent(email);
    $('#container').addClass('go-out');
    $(".kyc-error").hide();
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: kycHendler(email)
    });
}

function validateOunerDetailsForm (form) {
    var valid = true;
    var ownerAddress = form.find('[name="ownerAddress"]');
    if (!ownerAddress.val()) {
        ownerAddress.addClass('invalid');
        valid = false;
    }
    if (moreBeneficial) {
        var moreInputs = form.find('#another-person').find('input');
        moreInputs.each(function(index, element) {
            input = $(element);
            if (!input.val()) {
                input.addClass('invalid');
                valid = false;
            }
        })
    }

    return valid;
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function iosCopyToClipboard(el) {
    var oldContentEditable = el.contentEditable,
        oldReadOnly = el.readOnly,
        range = document.createRange();

    el.contenteditable = true;
    el.readonly = false;
    range.selectNodeContents(el);

    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(range);

    el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

    el.contentEditable = oldContentEditable;
    el.readOnly = oldReadOnly;

    document.execCommand('copy');
}

function kycHendler(email) {
    return function(data) {
        var title = '';

        ga('send', 'event', 'TokenSale-StartButton-Click', 'click', 'TokenSale-UserStatus-' + data.statusText);
        var referrer=encodeURIComponent(window.localStorage.getItem('dav-referrer'))
        switch(data.statusText) {
            case "AutoFinish":
            case "ManualFinish":
                showHomeAddressForm(email);
                break;
            case "Failed":
            case "CheckRequired":
                title = "Your KYC application is currently being processed.";
                $(".kyc-response").text("You’ll receive an email once your application has been processed with next steps.");
                $(".kyc-button, .kyc-close,.kyc-telegram3").removeClass('hide');
                $(".kyc-button").attr("href","/").text('Back To Homepage');
                showErrorPage(title);
                break;
            case "Rejected":
                title = "Your KYC application has not been accepted.";
                $(".kyc-response").html("If you believe your KYC has been rejected by mistake we ask that you please resubmit your KYC by clicking the button below. "
                +"Our systems tell us you should be able to successfully complete your KYC by doing the following:<br><br><b>" + data.suggestionText + "</b>");
                $(".kyc-button,.kyc-medium,.kyc-telegram2").removeClass('hide');
                $(".kyc-button").attr("href","https://nessie.dav.network/join?email="+encodeURIComponent(email)+"&referrer="+referrer);
                showErrorPage(title);
                break;
            case "Expired":
                title = "Your KYC application has expired.";
                $(".kyc-response").text("We ask you to please resubmit your KYC by clicking the button below.");
                $(".kyc-button, .kyc-close,.kyc-medium,.kyc-telegram2").removeClass('hide');
                $(".kyc-button").attr("href","https://nessie.dav.network/join?email="+encodeURIComponent(email)+"&referrer="+referrer);
                showErrorPage(title);
            break;
            case "Started":
                window.location.href = "https://nessie.dav.network/join?email=" + encodeURIComponent(email)+"&referrer="+referrer;
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

function startTokenSale(data) {
    if (!data.contractAddress) return $('#container').removeClass('go-out');

    ga('send', 'event', 'TokenSalePage-LastPage-View', 'view', 'TokenSalePage-LastPage-View');
    $('#contracts-address').val(data.contractAddress);
    $('.token-sale').show();
    $('.welcome-section, .error, .home-address').addClass('hide');
    $(document).scrollTop(- $(document).scrollTop());
    $('#container').removeClass('go-out').addClass('sale-page');
}

function showHomeAddressForm(email) {
    saveTimestamp(email);
    $('.home-address').removeClass('hide');
    $('.welcome-section, .error').addClass('hide');
    $('#container').removeClass('go-out').addClass('ouner-details');
}

function saveTimestamp(email) {
    $.ajax({
        type: 'POST',
        url: "https://nessie.dav.network/formwatch",
        data: { email },
        success: function(data) {
            console.log('Timestamp saved');
        },
        error: function(error) {
            console.log(error);
        }
      });
}

function showErrorMsg(el, msg) {
    el.show();
    el.animateCss("shake");
    el.text(msg);
}

function forgotWalletAddress(email) {
    $.ajax({
        type: 'GET',
        url: "https://nessie.dav.network/restorewalletaddress?email="+encodeURIComponent(email),
        dataType: 'json',
        success: function (data) {
            $('#curtain').removeClass('hide');
            $('#modal').removeClass('hide');
        }
      });
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
  