const PORT = 3000;
const NUM_LOAD_WIDGET = 20;
const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
const FB = require('fb');

var ChineseHoroscope = require('./quiz/chineseHoroscope');

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.set('view engine', 'pug');

var pages = [];

const pageData = {
	"descubra-seu-signo-chines": {
		imgPath: "/images/descubra-seu-signo-chines.jpg",
		title: "Descubra o seu signo chinês",
		result: function (data) {
			var chineseHoroscope = new ChineseHoroscope(data.birthday);
			return chineseHoroscope.resolve();
		}
	},
	"qual-sera-o-melhor-ano-da-sua-vida": {
		imgPath: "/images/ano-vida.jpg",
		title: "Qual será o melhor ano da sua vida?",
		result: function (data) {

		}
	}
}

for (key in pageData) {
	pages.push({
		title: pageData[key].title,
		path: key,
		imgPath: pageData[key].imgPath
	})
}

app.use(express.static('public'));

app.get('/load', function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	var index = parseInt(req.query.widgetId, 10) + 1;
	res.send(JSON.stringify(pages.slice(index, index + NUM_LOAD_WIDGET)));
});

app.get('/initialize', function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(pages.slice(0, NUM_LOAD_WIDGET)));
});

app.post('/:page', function (req, res) {
		FB.api('me', { fields: 'id,name,birthday', access_token: req.body.token }, function (data) {
		var result = pageData[req.params.quiz].resolve(data);
		res.send(JSON.stringify({ image: result }))
	});
})

app.get('/:quiz', function (req, res) {
	res.render('quiz', { data: pageData[req.params.quiz] })
})

app.listen(PORT);

console.log("Server started at port:%s", PORT);