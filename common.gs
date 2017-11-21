var formatDate = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
};

/*
function toISOFormat(date, tz) {
  return Utilities.formatDate(date, tz, "yyyy-MM-dd'T'HH:mm:ssXXX");
};
*/

/**
 URLの分割を行います。
 ret [0]:fullpath [1]:path [2]:full filename [3]:filename  [4]:ext
*/
var splitExt = function (filename) {
  //return filename.split(/\.(?=[^.]+$)/);
  //(.*/)?(.+?)\.([a-z]+)([\?#;].*)?$
  //(.*/)?((.+?)\.([a-z]+))?([\?#;].*)?$
  /*
  my/test/index.html
group(0)	my/test/index.html
group(1)	my/test/
group(2)	index.html
group(3)	index
group(4)	html
group(5)	
  */
  return filename.match("(.*/)?((.+?)\.([a-z]+))?([\?#;].*)?$");
}
