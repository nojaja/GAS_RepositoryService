
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
  var content  = {request:e};
  e.type = type;
  e.userid = Session.getActiveUser().getEmail();
  e.baseurl = ScriptApp.getService().getUrl();
  e.action = 'init';
  content = router(e,content);
  if (e.ext=='json') {
      return makeExtJsonContent(e,content);
  }else {
      return makeExtHtmlContent(e,content);
  }
}

function router(e, content) {
  Logger.log('router action='+e.action);
  if(e.action){
    var action = e.action+'';
    e.action = "";
    content = routerData.logicMapping[action](e, content)
    return router(e, content);
  }
}

function init(e, content) {
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

function makeExtJsonContent(e, content) {
  var content  = JSON.stringify(content);
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
