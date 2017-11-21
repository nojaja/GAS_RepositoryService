function Base64Test() {
  
Logger.log(Base64.encode("Base64エンコード")); //=> "QmFzZTY044Ko44Oz44Kz44O844OJ"
Logger.log(Base64.decode("QmFzZTY044OH44Kz44O844OJ")); //=> "Base64デコード"
  
}

function doGetTest() {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":{},"pathInfo":"my/test/index.json"};
  return doExec(e,"GET");
}

function createRecordTest() {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":{"code":"test","filename":"test","price":100},"pathInfo":"my/test/createRecord.json"};
  return doExec(e,"GET");
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
