
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
  //e.userid = Session.getActiveUser().getEmail();
  e.userid = "";
  e.baseurl = ScriptApp.getService().getUrl();
  e.action = 'init';
  var content  = {request:e,response:{}};
  content = router(content);
  //content = makeResponse(content);
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
  Logger.log('======================== ');
  Logger.log('router action='+content.request.action);
  if(content.request.action){
    var action = content.request.action+'';
    content.request.action = "";
    content = routerData.logicMapping[action](content)
    Logger.log('router content='+JSON.stringify(content));
    Logger.log('======================== ');
    return router(content);
  }else{
    Logger.log('======================== ');
    return content
  }
}

function init(_content) {
  var content = _content;
  var e = content.request;
  Logger.log('init content='+JSON.stringify(content));
  if(e.parameters.datafile){
    Logger.log('init init='+e.parameters.datafile.name);
    Logger.log('init encodeString='+encodeString(e.parameters.datafile.name));
    e.pathInfo = e.parameters.uid+"/"+e.parameters.projectid+"/"+encodeString(e.parameters.datafile.name);
    
  }
  if(e.parameter.p){
    e.pathInfo = e.parameter.p;
    Logger.log('p '+e.parameter.p);
  }
  Logger.log('init '+e.pathInfo||'');
  var pathInfo = splitExt(e.pathInfo||'');
  Logger.log('pathInfo[1] '+pathInfo[1]);
  if(!pathInfo[1]){
    //e.action = 'projectList';
    e.action = 'publicList';
    return content;
  }
  e.path = pathInfo[1].split("/");
  e.filename = pathInfo[3]||'';
  e.ext = pathInfo[4]||'';
    
  e.uid = e.path[0]||'';
  e.projectid = e.path[1]||'';
    
  Logger.log('uid '+e.uid);
  Logger.log('projectid '+e.projectid);
  Logger.log('type '+e.type);
  if(e.type=='GET'){
    if(e.filename){ // get
      e.action = 'content';
    }else{//search
      e.action = 'publicList';
    }
  }else{
    if(e.parameters.datafile){ // update/insert
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
routerData.logicMapping['makeResponse'] = makeResponse;


function makeExtJsonContent(content) {
  var content  = JSON.stringify(content);
  var e = content.request;
  Logger.log('makeExtJsonContent '+content.result);
  if (!e.parameter.callback) {
    content.response = ContentService.createTextOutput(content.result).setMimeType(ContentService.MimeType.JSON);
  } else {
    content.response = ContentService.createTextOutput(e.parameter.callback + "(" + content.result + ");").setMimeType(ContentService.MimeType.JAVASCRIPT);
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
