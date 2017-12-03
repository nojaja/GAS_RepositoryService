
var tableId = '1_sL5eP-Vm63nfDplqME3---yb9Y5ElehHztCjXKw'; //作成したFusionTableのurlに含まれるdocidを指定します

/*
/exec/{uid}/{projectid}/{filename}.{ext}
get → get / search
 ファイルあり　→ get
 ファイルなし → search
 
post → update/insert/delete
　内容あり → update/insert
　内容なし → delete
*/
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
  var pathInfo = splitPath(e.pathInfo||'');
  Logger.log('pathInfo '+pathInfo.path);
  e.path = pathInfo.paths;
  e.filename = pathInfo.filename;
  e.ext = pathInfo.ext;
    
  e.uid = pathInfo.paths[0]||'';
  e.projectid = pathInfo.paths[1]||'';
    
  Logger.log('uid '+e.uid);
  Logger.log('projectid '+e.projectid);
  Logger.log('type '+e.type);
  
  if(e.projectid == ""){
    e.action.push('projectList');
    //e.action.push('publicList');
    return content;
  }
  if(e.type=='GET'){
    if(e.filename){ // get
      e.action.push('content');
    }else{//search
      e.action.push('publicList');
    }
  }else{
    if(e.parameters.datafile){ // update/insert
      e.action.push('updateRecord');
    }else{
      if(e.parameters.datafilecontents){ // update/insert
        var datafilecontents = e.parameters.datafilecontents + '';
        var datafilename = e.parameters.datafilename + '';
        var contents = Encoding.codeToString(Encoding.convert(Encoding.base64Decode(datafilecontents), 'UNICODE'));
        datafilename = Encoding.codeToString(Encoding.convert(Encoding.base64Decode(datafilename), 'UNICODE'));
 
        e.pathInfo = e.parameters.uid+"/"+e.parameters.projectid+"/"+encodeString(datafilename);
        
        e.parameters.datafile = {"type":e.parameters.datafiletype,"length":e.parameters.datafilelength,"contents":contents,"name":datafilename}
        e.action.push('publicList');
        e.action.push('updateRecord');
      }else{//delete
        e.action.push('deleteRecord');
      }
    }
  }
  return content;
}
routerData.logicMapping['init'] = init;

function createBL(_content) {
  var content = _content;
  var e = content.request;
  return content;
}
routerData.logicMapping['create'] = createBL;

function getProjectList(_content) {  
  var content = _content;
  var e = content.request;
  // 一覧画面の表示
  var sql = 'SELECT projectid FROM ' + tableId 
    //+ " WHERE " uid = '" + e.uid +"'"
    + " GROUP BY projectid "
    + ' LIMIT 100';
  Logger.log('getProjectList sql:'+sql);
  var result = FusionTables.Query.sqlGet(sql);
  Logger.log('getProjectList result:'+result);
  
  content.result = {"columns":result.columns,"rows":result.rows};
  if(!e.parameter.t){
    e.action.push('makeExtHtmlContent');
    e.pageId = 'projectlist';
  }else{
    e.action.push('makeExtJsonContent');
  }
  return content
}
routerData.logicMapping['projectList'] = getProjectList;


function getContent(_content) {
  Logger.log('--------------- ');
  var content = _content;
  var e = content.request;
  Logger.log('getContent '+e.filename);
  // 更新・削除画面の表示
  //ROWID, code, price, uid, scope, filename, ext, content, timestamp
  var sql = "SELECT ROWID, filename, ext, timestamp, uid, scope, content FROM " + tableId
    + " WHERE filename = '" + e.filename +"'"
    + " and ext = '" + e.ext + "'"
    + " and projectid = '" + e.projectid +"'";
  Logger.log('getContent sql:'+sql);
  var result = FusionTables.Query.sqlGet(sql);
  Logger.log('getContent result:'+result);
  
  if( result.rows && result.rows.length > 0 ) {
    content.result = {"columns":result.columns,"length":result.rows.length};
    var row = result.rows[0];
    content.result.row_id = row[0];
    content.result.filename = row[1];
    content.result.ext = row[2];
    content.result.scope = row[5];
    content.result.content = Utilities.newBlob(Utilities.base64Decode( row[6], Utilities.Charset.UTF_8)).getDataAsString();
    Logger.log('getContent row[6]#2:'+content.result.content);
    e.action.push('makeResponse');
  }else{
    e.action.push('makeExtHtmlContent');
    e.pageId = '404';
  }
  return content;
}
routerData.logicMapping['content'] = getContent;


function publicList(_content) {
  var content = _content;
  var e = content.request;
  // 一覧画面の表示
  //ROWID, code, price, uid, scope, filename, ext, content, timestamp
  var sql = 'SELECT ROWID, filename, ext, timestamp, uid, scope FROM ' + tableId 
    + ' WHERE '
    + " scope NOT EQUAL TO 'private' "
    + " and projectid = '" + e.projectid +"'"
    + ' LIMIT 100';
  var result = FusionTables.Query.sqlGet(sql);
  content.result = {"columns":result.columns,"rows":result.rows};
  if(!e.parameter.t){
    e.action.push('makeExtHtmlContent');
    e.pageId = 'list';
  }else{
    e.action.push('makeExtJsonContent');
  }
  return content
}
routerData.logicMapping['publicList'] = publicList;


// レコード追加
function createRecordBL(_content) {
  var content = _content;
  var e = content.request;
  var form = { filename :e.filename||''
              ,ext :e.ext|| "txt"
              ,timestamp :formatDate(new Date())
              ,scope :e.parameters.scope || "public"
              ,content :Utilities.base64Encode((e.parameters.datafile.contents), Utilities.Charset.UTF_8) || ""
             }
  var temp = [];
  temp.push(e.uid);
  temp.push(e.projectid);
  temp.push(form.filename);
  temp.push(form.ext);
  temp.push(form.content);
  temp.push(form.scope);
  temp.push(form.timestamp);
  var rowsData = '"'+temp.join('","')+'"';
  Logger.log('createRecordBL rowsData#1:'+rowsData);
  var mediaData = Utilities.newBlob(rowsData, "application/octet-stream");
  
  FusionTables.Table.importRows(tableId, mediaData);
  Logger.log('=================:');
  return content;
}
routerData.logicMapping['createRecord'] = createRecordBL;

// レコード追加
function createRecord(form) {
  //{"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":{"ext":"txt","filename":"bbbb","scope":"","datafile":{"type":"text/plain","length":356,"contents":"ump\r\nsiolabsrv01txtdbmovedat\r\n\r\n","name":"SVNh.txt"},"pathInfo":"createRecord.json"}
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":form};
  return JSON.stringify(doExec(e,"POST"));
}

// レコード更新
function updateRecordBL(_content) {
  var content = _content;
  var e = content.request;
  Logger.log('updateRecordBL '+e.filename);
  // 更新・削除画面の表示
  //ROWID, code, price, uid, scope, filename, ext, content, timestamp
  var selectsql = "SELECT ROWID, filename, ext, timestamp, uid, scope, content FROM " + tableId 
    + " WHERE filename = '" + e.filename +"'"
    + " and ext = '" + e.ext + "'"
    + " and projectid = '" + e.projectid +"'";
  Logger.log('updateRecordBL sql#1:'+selectsql);
  var selectresult = FusionTables.Query.sqlGet(selectsql);
  Logger.log('updateRecordBL result:'+selectresult);
  
  if( selectresult.rows && selectresult.rows.length > 0 ) {
    var row = selectresult.rows[0];
    var row_id = row[0]; 
    var sql = "DELETE FROM " + tableId + " WHERE ROWID = '" + row_id + "'";
    Logger.log('updateRecordBL sql#2:'+sql);
    var cnt = FusionTables.Query.sql(sql);
    Logger.log('updateRecordBL delete rows:'+cnt.rows);
    e.action.push('createRecord');
  }else{
    e.action.push('createRecord');
  }
  return content;
}
routerData.logicMapping['updateRecord'] = updateRecordBL;

// レコード更新
function updateRecord(form) {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":form};
  var pathInfo = splitPath(e.parameters.uid+"/"+e.parameters.projectid+"/"+e.parameters.datafile.name);
  e.path = pathInfo.paths;
  e.filename = pathInfo.filename;
  e.ext = pathInfo.ext;
  return JSON.stringify(doExec(e,"POST"));
}


// レコード削除
function deleteRecordBL(_content) {
  var content = _content;
  var e = content.request;
  var form = { row_id :e.parameters.row_id || ""};
  var sql = "DELETE FROM " + tableId + " WHERE ROWID = '" + form.row_id + "'";
  // + " WHERE uid = '" + e.uid + "'";
  FusionTables.Query.sql(sql);
}
routerData.logicMapping['deleteRecord'] = deleteRecordBL;

// レコード削除
function deleteRecord(form) {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":form,"pathInfo":"deleteRecord.json"};
  return doExec(e,"GET");
}
