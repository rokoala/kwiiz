const PORT = 3000;
const NUM_LOAD_WIDGET = 20;
const express = require('express');
const app = express();
const pug = require('pug');
const request = require('request');
const session = require('express-session')

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

app.use(session({
	secret: 'blablabla2',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}))

app.set('view engine', 'pug');

var ROOT_URL = "http://www.kwiiz.com/";

if (app.get('env') === 'development') {
	ROOT_URL = "http://localhost:3000/";
}

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

		img.write('public/results/' + option.page + "/" + randomString + ".jpg", function (err) {
			if (err) {
				reject(err);
				throw err;
			}
			else {
				var fileName = randomString + ".html";

				fs.writeFileSync("client_results/" + option.page + "/" + fileName,
					compiledResult({
						site: ROOT_URL + option.page + "/results/" + fileName,
						img: ROOT_URL + "results/" + option.page + "/" + randomString + ".jpg",
						title: option.title,
						description: option.description,
						name: option.name
					}));

				fs.writeFileSync("client_results/" + option.page + "/" + randomString + "-" + option.cookie + ".key", "");

				resolve(ROOT_URL + option.page + "/results/" + fileName);
			}
		})

	});
}

const pageData = {
	"descubra-seu-signo-chines": {
		imgPath: "/images/descubra-seu-signo-chines.jpg",
		title: "Descubra o seu signo chinês",
		appurl: "/descubra-seu-signo-chines",
		solve: function (data) {

			return new Promise(function (resolve, reject) {
				var chineseHoroscope = new ChineseHoroscope(data.imgUrl, data.name, data.birthday);

				chineseHoroscope.getImage().then(function (img) {

					generatePage(img, {
						id: data.id,
						title: "Qual é o seu signo chinês?",
						description: "Venha descobrir o seu! clique aqui!",
						name: data.name,
						page: data.page,
						cookie: data.cookie
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
		appurl: "/qual-sera-o-melhor-ano-da-sua-vida",
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

	FB.api('me', { fields: 'id,name,birthday,picture.type(large)', access_token: req.body.token }, function (data) {
		var randomNumber = Math.random().toString();
		randomNumber = randomNumber.substring(2, randomNumber.length);

		pageData[req.params.page].solve({ id: data.id, token: data.token, name: data.name, birthday: data.birthday, imgUrl: data.picture.data.url, page: req.params.page, cookie: randomNumber }).then(function (url) {
			req.session.cookie.expires = false;
			req.session.cookieName = randomNumber;
			res.send(JSON.stringify({ url: url }));
		})
	});

	// 	var randomNumber = Math.random().toString();
	// 	randomNumber = randomNumber.substring(2, randomNumber.length);
	// pageData[req.params.page].solve({ id: "321321", token: '321321321', name: 'rokoala koala', birthday: '22/10/1988', page: req.params.page, cookie: randomNumber }).then(function (url) {
		
	// 	req.session.cookie.expires = false;
	// 	req.session.cookieName = randomNumber;

	// 	res.send(JSON.stringify({ url: url }))
	})
})

app.get('/:quiz/results/:result', function (req, res) {
	var cookie = req.session.cookieName;
	var userAgent = req.headers["user-agent"];
	var isFb = userAgent.indexOf("facebookexternalhit") !== -1 ? true : false;

	if (!!cookie || isFb) {

		var file = __dirname + '/client_results/' + req.params.quiz + "/" + req.params.result;

		if (isFb)
			res.sendFile(file)

		var key = __dirname + '/client_results/' + req.params.quiz + "/" + req.params.result.split('.')[0] + "-" + cookie + ".key";

		if (fs.existsSync(key)) {
			res.sendFile(file)
		}
	} else {
		var page = pageData[req.params.quiz]
		res.render('quiz', { data: page });
	}
});

app.get('/:quiz', function (req, res) {
	var page = pageData[req.params.quiz]

	if (!!page)
		res.render('quiz', { data: page })
	else
		req.next();
})

app.use(express.static('public'));

app.get('/*', function (req, res) {
	res.redirect("/");
})

app.listen(PORT);

console.log("Server started at port:%s", PORT);