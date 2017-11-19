
var routerData = {
  pathMapping : {  },
  logicMapping : {  }
}

/*
/exec/{uid}/{projectid}/{filename}.{ext}
get → get / search
 ファイルあり　→ get
 ファイルなし → search
 
post → update/insert/delete
　内容あり → update/insert
　内容なし → delete
*/
function doPost(e) {
  return  doExec(e,"POST");
}
function doGet(e) {
  return doExec(e,"GET");
}

function doExec (e,type) {
  e.type = type;
  e.userid = Session.getActiveUser().getEmail();
  e.baseurl = ScriptApp.getService().getUrl();
  e.action = 'init';
  var content  = {request:e,response:{}};
  content = router(content);
  content = makeResponse(content);
  return content.response;
  /*
  if (e.ext=='json') {
      return makeExtJsonContent(e,content);
  }else {
      return makeExtHtmlContent(e,content);
  }
  */
}

function router(_content) {
  var content = _content;
  Logger.log('router action='+content.request.action);
  if(content.request.action){
    var action = content.request.action+'';
    content.request.action = "";
    content = routerData.logicMapping[action](content)
    Logger.log('router content='+JSON.stringify(content));
    return router(content);
  }else{
    return content
  }
}

function init(_content) {
  var content = _content;
  var e = content.request;
  Logger.log('init '+e.pathInfo);
  var pathInfo = splitExt(e.pathInfo||'');
  e.path = pathInfo[1].split("/");
  e.file = pathInfo[2]||'';
  e.ext = pathInfo[3]||'';
    
  e.uid = e.path[0]||'';
  e.projectid = e.path[1]||'';
    
  Logger.log('uid '+e.uid);
  Logger.log('projectid '+e.projectid);
  Logger.log('type '+e.type);
  if(e.type=='GET'){
    if(e.file){ // get
      e.action = 'content';
    }else{//search
      e.action = 'publicList';
    }
  }else{
    if(e.parameters.content){ // update/insert
      e.action = 'updateRecord';
    }else{//delete
      e.action = 'deleteRecord';
    }
  }
  return content;
}
routerData.logicMapping['init'] = init;


function makeResponse(_content) {
  var content = _content;
  Logger.log('--------------- ');
  Logger.log('makeResponse content:'+JSON.stringify(content.result.content));
  content.response = ContentService.createTextOutput(content.result.content).setMimeType(ContentService.MimeType.TEXT);
  Logger.log('makeResponse response:'+content.response);
  return content
}

function makeExtJsonContent(e, content) {
  var content  = JSON.stringify(content);
  Logger.log('makeExtJsonContent '+content);
  if (!e.parameter.callback) {
    return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput(e.parameter.callback + "(" + content + ");").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

function makeExtHtmlContent(e, content) {
    var output = HtmlService.createTemplateFromFile(e.file);
    output.content = content;
    return output.evaluate();
}
