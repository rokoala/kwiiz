var kwiiz = {
	id: 0
};

var createWidget = function (option) {
	var $widget = $("<a/>").attr("id", kwiiz.id++).attr("href", option.path).addClass("widget").css({ "background": "url(" + option.imgPath + ")", "background-size": "cover" });
	var $title = $("<h5/>").text(option.title);

	$widget.append($title);
	$("#content").append($widget);
};

var load = function (data) {
	data.forEach(function (option) {
		createWidget(option);
	});
};

var initialize = function () {
	$.ajax({
		url: '/initialize',
		success: function (data) {
			load(data);
		}
	})
};

$(document).ready(function () {

	initialize();

	var win = $(window);

	win.scroll(function () {

		if ($(document).height() - win.height() == win.scrollTop()) {

			console.log("load...")

			var lastId = $("#content").children("a").last().attr("id");

			$.ajax({
				url: '/load',
				data: {
					widgetId: lastId
				},
				success: function (data) {
					load(data);
				}
			})
		}
	})
});
