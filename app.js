const PORT = 3000;
const NUM_LOAD_WIDGET = 20;
const express = require('express');
const app = express();
const pug = require('pug');

const fs = require('fs');
const path = require('path');
const FB = require('fb');
var Promise = require('promise');

var Jimp = require('jimp');

var ChineseHoroscope = require('./quiz/chineseHoroscope');

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.set('view engine', 'pug');

var pages = [];

var compiledResult = pug.compileFile('views/quiz-result.pug');

function createRandomString(length) {
	var str = "";
	for (; str.length < length; str += Math.random().toString(36).substr(2));
	return str.substr(0, length);
}


var generatePage = function (img, option) {

	return new Promise(function (resolve, reject) {

		var randomString = createRandomString(16);

		img.write('public/results/' + option.id + '-' + randomString + ".jpg", function (err) {
			if (err) {
				reject(err);
				throw err;
			}
			else {
				var fileName = option.id + "-" + randomString + ".html";

				fs.writeFileSync("public/results/" + fileName,
					compiledResult({
						site: "http://www.kwiiz.com/results/" + fileName,
						img: "http://www.kwiiz.com/results/" + option.id + '-' + randomString + ".jpg",
						title: option.title,
						description: option.description,
						name: option.name
					}));

				resolve("http://www.kwiiz.com/results/" + fileName);
			}
		})

	});
}

const pageData = {
	"descubra-seu-signo-chines": {
		imgPath: "/images/descubra-seu-signo-chines.jpg",
		title: "Descubra o seu signo chinês",
		solve: function (data) {

			return new Promise(function (resolve, reject) {
				var chineseHoroscope = new ChineseHoroscope(data.name, data.birthday);

				chineseHoroscope.getImage().then(function (img) {

					generatePage(img, {
						id: data.id,
						title: "TITLE TESTE",
						description: "Description teste",
						name: data.name
					}).then(function (url) {
						resolve(url);
					})
				}).catch(function (err) {
					reject(err);
					throw err;
				})
			});
		}
	},
	"qual-sera-o-melhor-ano-da-sua-vida": {
		imgPath: "/images/ano-vida.jpg",
		title: "Qual será o melhor ano da sua vida?",
		solve: function (data) {

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
		pageData[req.params.page].solve({ token: data.token, name: data.name, birthday: data.birthday }).then(function (url) {
			res.send(JSON.stringify({ url: url }));
		})
	});
})

app.get('/:quiz', function (req, res) {
	var page = pageData[req.params.quiz]

	if (!!page)
		res.render('quiz', { data: page })
	else
		req.next();
})

app.listen(PORT);

console.log("Server started at port:%s", PORT);