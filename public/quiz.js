$(document).ready(function () {
  var $div = $("<div/>").addClass("widget w-big").css({ "background": "url(" + imgPath + ")", "background-size": "cover" });
  var $title = $("<h5/>").text(title);


  $div.click(function(event){
    event.preventDefault();
    FB.login(function(response){
      console.log(response);
    }, {scope:'email, public_profile, user_friends'});
  });

  $div.append($title);
  $("#content").append($div);
});