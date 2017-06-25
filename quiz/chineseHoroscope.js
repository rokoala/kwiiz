var ChineseHoroscope = function(birthday) {
  this.animals = ["monkey", "cock", "dog", "boar", "rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "sheep"];
  this.birthday = birthday;
};

ChineseHoroscope.prototype.getResultImagePath = function(){
  var year = this.birthday.split('/')[2];
  return "results/" + this.animals[(year % this.animals.length)] + ".jpg";
};

module.exports = ChineseHoroscope;