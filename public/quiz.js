var loadCircle = null;

var kwiiz = {
  getResult: function (token) {
    $.ajax({
      url: "",
      dataType: "JSON",
      type: "POST",
      data: {
        token: token
      },
      timeout: 9000,
      beforeSend: function () {

        $("div.widget").remove();

        var $load = $("<div/>").attr("id", "load-progress").css({ "width": "350px", "margin-left": "auto", "margin-right": "auto", "padding": "40px" });
        var $loadText = $("<h4/>").text("Analisando seu perfil...");

        var $div = $("<div/>").addClass("result").append($load).append($loadText);

        $("#content").append($div);

        var circle = new ProgressBar.Circle('#load-progress', {
          duration: 2000,
          easing: 'easeInOut',
          from: { color: '#FFF' },
          to: { color: 'rgb(66, 244, 66)' },
          step: function (state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            var value = Math.round(circle.value() * 100);
            if (value === 0) {
              circle.setText('');
            } else {
              circle.setText(value + "%");
            }
          }
        });

        loadCircle = circle;
        circle.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
        circle.text.style.fontSize = '2rem';

        circle.animate(0.5);
      },
      success: function (data) {

        $("div.result").children("h4").text("Calculando seu resultado...");
        loadCircle.animate(1);

        setTimeout(function () {
          window.location.href = data.url;
        }, 2000);
      }
    })
  }
}

$(document).ready(function () {
  var $div = $("<div/>").addClass("widget w-big").css({ "background": "url(" + imgPath + ")", "background-size": "cover" });
  var $title = $("<h5/>").text(title);

  $div.click(function (event) {
    event.preventDefault();
    FB.login(function (response) {
      if (response.authResponse) {
        kwiiz.getResult(response.authResponse.accessToken);
      }
    }, { scope: 'email, public_profile, user_birthday, user_friends' });
  });

  $div.append($title);
  $("#content").append($div);
});