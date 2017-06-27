var Jimp = require("jimp");

var ChineseHoroscope = function (imgUrl, name, birthday) {
  this.animals = ["monkey", "cock", "dog", "boar", "rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "sheep"];
  this.name = name;
  this.birthday = birthday;
  this.imgUrl = imgUrl;
};

ChineseHoroscope.prototype.getImage = function () {
  var year = this.birthday.split('/')[2];
  var image = this.animals[(year % this.animals.length)] + ".jpg";
  var profileImage = this.imgUrl;
  var message = this.name + " seu signo é:";

  return new Promise(function (resolve, reject) {

    Jimp.read(profileImage).then(function (fbImg) {
      Jimp.read('results/chinesehoroscope/' + image).then(function (img) {
        var clone = img.clone();
        //Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then(function (font) {
          clone.composite(fbImg,205,20);
          resolve(clone);
        //});
      }).catch(function (err) {
        console.error(err);
        reject(err);
        throw err;
      })
    });

  })
};

module.exports = ChineseHoroscope;