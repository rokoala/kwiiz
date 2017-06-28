var kwiiz = {
  share: function (url) {
    FB.ui({
      method: 'share',
      href: url,
      hashtag: '#kwiiz'
    }, function (response) {
      if (response && !response.error_message) {
        window.location.href = url;
      }
    });
  }
}

$(document).ready(function () {
  $("button.btn-share").click(function () {
    kwiiz.share(window.location.href);
  })
});