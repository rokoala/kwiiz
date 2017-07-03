var Jimp = require("jimp");

var HouseHogwards = function (imgUrl, name, birthday) {
  this.houses = ["gryffindor", "hufflepuff", "ravenclaw", "slytherin"];
  this.name = name || '';
  this.birthday = birthday || '10/10/1988';
  this.imgUrl = imgUrl || 'public/images/silhouette.png';
};

HouseHogwards.prototype.getImage = function () {
  var image = this.houses[ Math.floor(Math.random()*4 ) ] + ".jpg";
  var profileImage = this.imgUrl;

  return new Promise(function (resolve, reject) {

    Jimp.read(profileImage).then(function (fbImg) {
      Jimp.read('results/houseHogwarts/' + image).then(function (img) {
        var clone = img.clone();
        clone.composite(fbImg, 108, 195);
        resolve(clone);
      }).catch(function (err) {
        console.error(err);
        reject(err);
        throw err;
      })
    });

  })
};

module.exports = HouseHogwards;