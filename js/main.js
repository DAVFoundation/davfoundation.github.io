$('.dropdown-toggle').click(function(e) {
  if ($(document).width() > 768) {
    var url = $(this).attr('href');
    if (url === '#') {
      e.preventDefault();
    }
  }
});