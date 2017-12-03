var routerData = {
  pathMapping : {},
  logicMapping : {}
}

function doPost(e) {
  return  doExec(e,"POST");
}
function doGet(e) {
  return doExec(e,"GET");
}

function doExec (request,type) {
  request.type = type;
  //e.userid = Session.getActiveUser().getEmail();
  //Logger.log(Session.getTemporaryActiveUserKey());
  request.userid = "";
  request.baseurl = ScriptApp.getService().getUrl();
  request.action = ['init'];
  var content  = {request:request,response:{},model:{}};
  content = router(content);
  return content.response;
}

function router(_content) {
  var content = _content;
  Logger.log('======================== ');
  var nextAction = content.request.action.pop();
  Logger.log('router nextAction='+nextAction);
  if(nextAction){
    content = routerData.logicMapping[nextAction](content)
    Logger.log('router content='+JSON.stringify(content));
    Logger.log('======================== ');
    return router(content);
  }else{
    Logger.log('======================== ');
    return content
  }
}

function makeResponse(_content) {
  var content = _content;
  Logger.log('--------------- ');
  Logger.log('makeResponse content:'+JSON.stringify(content.result.content));
  content.response = ContentService.createTextOutput(content.result.content).setMimeType(ContentService.MimeType.TEXT);
  Logger.log('makeResponse response:'+content.response);
  return content
}
routerData.logicMapping['makeResponse'] = makeResponse;


function makeExtJsonContent(content) {
  var e = content.request;
  Logger.log('makeExtJsonContent '+JSON.stringify(content));
  if (!e.parameter.callback) {
    content.response = ContentService.createTextOutput(JSON.stringify(content.result)).setMimeType(ContentService.MimeType.JSON);
  } else {
    content.response = ContentService.createTextOutput(e.parameter.callback + "(" + JSON.stringify(content.result) + ");").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  Logger.log('makeExtJsonContent response:'+content.response);
  return content
}
routerData.logicMapping['makeExtJsonContent'] = makeExtJsonContent;

function makeExtHtmlContent(content) {
  var e = content.request;
  var output = HtmlService.createTemplateFromFile(e.pageId);
  output.content = content;
  content.response = output.evaluate();
  Logger.log('makeExtHtmlContent response:'+content.response);
  return content
}
routerData.logicMapping['makeExtHtmlContent'] = makeExtHtmlContent;
