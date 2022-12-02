// These characters will be removed from ngrams/shingles
// @see: org/apache/lucene/analysis/cn/smart/stopwords.txt

// Historical Geocoding - do NOT remove apostrophes, we WANT to tokenize on it !
module.exports.all = [
  ".","`","‘","-","_","=","?",
  //"'",
  "|","\"","(",")","{","}","[","]","<",">","*",
  "#","&","^","$","@","!","~",":",";","+","《","》","—","－","，","。",
  "、", "：","；","！","·","？","„","“","”","）","（","【","】","［","］","●"
];

module.exports.allowed = [
  "-", // allow hypens
  "&"  // allow ampersands
];

module.exports.blacklist = module.exports.all.slice();

// remove alowed chars from blacklist
module.exports.allowed.forEach(function(item){
  var index = module.exports.blacklist.indexOf(item);
  if( index > -1 ){
    module.exports.blacklist.splice(index, 1);
  }
});
