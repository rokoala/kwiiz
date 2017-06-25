var kwiiz = {
  getResult: function (app,token) {
    $.ajax({
      url: "",
      dataType: "JSON",
      type: "POST",
      data: {
        app:app,
        token: token
      },
      timeout: 9000,
      beforeSend: function () {
        console.log("Solicitando...");
      },
      success: function (data) {
        console.log("Sucesso!");
        console.log(data);
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
    }, { scope: 'email, public_profile, user_friends' });
  });

  $div.append($title);
  $("#content").append($div);
});