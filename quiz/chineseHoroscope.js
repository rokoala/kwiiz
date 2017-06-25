var ChineseHoroscope = function(birthday) {
  this.animals = ["monkey", "cock", "dog", "boar", "rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "sheep"];
  this.birthday = birthday;
};

ChineseHoroscope.prototype.getResultPath = function(){
  return "results/" + this.animals[(this.birthday % this.animals.length)] + ".jpg";
};

module.exports = ChineseHoroscope;