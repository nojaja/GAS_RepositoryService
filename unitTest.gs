
function getUUIDTest() {
  Logger.log(getUUID());
  Logger.log(getUUID());
  Logger.log(getUUID());
  Logger.log(getUUID());
  Logger.log(getUUID());
}


function Base64Test() {
  
  var base64 = Encoding.base64Encode(Encoding.convert(Encoding.stringToCode("Base64エンコード"), 'SJIS'));
  Logger.log(base64); //=> "QmFzZTY044Ko44Oz44Kz44O844OJ"
  Logger.log(Encoding.codeToString(Encoding.convert(Encoding.base64Decode(base64)), 'UNICODE')); //=> "Base64エンコード"
  
  Logger.log(Encoding.codeToString(Encoding.convert(Encoding.base64Decode("QmFzZTY044OH44Kz44O844OJ")), 'UNICODE')); //=> "Base64エンコード"
  


  //Logger.log(Base64.encode("Base64エンコード")); //=> "QmFzZTY044Ko44Oz44Kz44O844OJ"
  //Logger.log(Base64.decode("QmFzZTY044OH44Kz44O844OJ")); //=> "Base64デコード"
}

function convertUNICODETest() {
  // SJISの文字コード配列 (中身は 'こんにちは、ほげ☆ぴよ')  
  var sjisArray = [  
    130, 177, 130, 241, 130, 201, 130, 191, 130, 205, 129,  
    65, 130, 217, 130, 176, 129, 153, 130, 210, 130, 230  
  ];  
  // Unicodeに変換  
  var unicodeArray = Encoding.convert(sjisArray, 'UNICODE');  
  // 文字列にして表示  
  // codeToStringは、文字コード配列を文字列に変換(連結)して返す関数  
  Logger.log( Encoding.codeToString(unicodeArray) );  
  //  
}

function convertUNICODETest2() {
  // SJISの文字コード配列 (中身は 'こんにちは、ほげ☆ぴよ')  
  var sjisArray = [  
    130, 177, 130, 241, 130, 201, 130, 191, 130, 205, 129,  
    65, 130, 217, 130, 176, 129, 153, 130, 210, 130, 230  
  ];  

    // Unicodeに変換  
  var unicodeArray = Encoding.convert(sjisArray, 'SJIS');  
  // 文字列にして表示  
  // codeToStringは、文字コード配列を文字列に変換(連結)して返す関数  
  var sjistxt =  Encoding.codeToString(unicodeArray);
  Logger.log( sjistxt );  
  // 文字列にして表示  
  // codeToStringは、文字コード配列を文字列に変換(連結)して返す関数  
  Logger.log( encodeString(sjistxt) );  
  //  
}

function convertUNICODETest3() {
  var sjistxt =  "SVNÚs_ËR}h.txt";
  Logger.log( sjistxt );  
  // 文字列にして表示  
  // codeToStringは、文字コード配列を文字列に変換(連結)して返す関数  
  Logger.log( encodeString(sjistxt) );  
  //  
}


function splitExtTest() {
  
  Logger.log( JSON.stringify(splitExt("/uid/projectid/hoge.txt")));
  
}

function splitPathTest() {
  
  Logger.log( JSON.stringify(splitPath("/uid/projectid/hoge.txt")));
  Logger.log( JSON.stringify(splitPath("my/test/index.html")));
  
}



function doGetTest() {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":{},"pathInfo":"my/test/index.json"};
  return doExec(e,"GET");
}
function doGetTest2() {
  var e ={"parameter":{"p":"my/test/index.json"},"contextPath":"","contentLength":-1,"queryString":"","parameters":{"p":["my/test/index.json"]}};
  return doExec(e,"GET");
}

function updateRecordTest() {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":{"uid":"my","projectid":"test","datafile":{"type":"text/plain","length":356,"contents":"ump\r\nsiolabsrv01txtdbmovedat\r\n\r\n","name":"test.txt"}}};
  return doExec(e,"POST");
}

function createRecordTest() {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":{"ext":"txt","filename":"test","scope":"","content":"hoge"},"pathInfo":"my/test/test.txt"};
  return doExec(e,"POST");
}

function doGetFileTest() {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":{},"pathInfo":"my/test/index.html"};
  return doExec(e,"GET");
}

function do404FileTest() {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":{},"pathInfo":"my/test/404.html"};
  return doExec(e,"GET");
}

function doGetListTest() {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":{},"pathInfo":"my/test/"};
  return doExec(e,"GET");
}
