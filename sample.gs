
var tableId = '1_sL5eP-Vm63nfDplqME3---yb9Y5ElehHztCjXKw'; //作成したFusionTableのurlに含まれるdocidを指定します

function createBL(_content) {
  var content = _content;
  var e = content.request;
  return content;
}
routerData.logicMapping['create'] = createBL;

function getContent(_content) {
  Logger.log('--------------- ');
  var content = _content;
  var e = content.request;
  Logger.log('getContent '+e.filename);
  // 更新・削除画面の表示
  //ROWID, code, price, uid, scope, filename, ext, content, timestamp
  var sql = "SELECT ROWID, filename, ext, timestamp, uid, scope, content FROM " + tableId + " WHERE filename = '" + e.filename +"'"
   + " and ext = '" + e.ext + "'";
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
  Logger.log('getContent row[6]:'+row[6]);
    content.result.content = Utilities.newBlob(Utilities.base64Decode( row[6], Utilities.Charset.UTF_8)).getDataAsString();
  Logger.log('getContent row[6]#2:'+content.result.content);
    e.action = 'makeResponse';
  }else{
    e.action = 'makeExtHtmlContent';
    e.pageId = '404';
  }
  return content;
}
routerData.logicMapping['content'] = getContent;

function getContentById(_content) {
  var content = _content;
  var e = content.request;
  // 更新・削除画面の表示
  //ROWID, code, price, uid, scope, filename, ext, content, timestamp
  var sql = 'SELECT ROWID, filename, ext, timestamp, uid, scope, content FROM ' + tableId + ' WHERE ROWID = ' + e.parameters.row_id;
  var result = FusionTables.Query.sqlGet(sql);
  
  content.result = {"columns":result.columns,"length":result.rows.length};
  if( result.rows.length > 0 ) {
    var row = result.rows[0];
    content.result.row_id = row[0];
    content.result.filename = row[1];
    content.result.ext = row[2];
    content.result.scope = row[5];
    content.result.content = Utilities.newBlob(Utilities.base64Decode( row[6], Utilities.Charset.UTF_8)).getDataAsString();
  }
  e.action = 'makeResponse';
  return content;
}
routerData.logicMapping['update'] = getContentById;

function publicList(_content) {
  var content = _content;
  var e = content.request;
  // 一覧画面の表示
  //ROWID, code, price, uid, scope, filename, ext, content, timestamp
  var sql = 'SELECT ROWID, filename, ext, timestamp, uid, scope FROM ' + tableId 
    + ' WHERE '
    + " scope NOT EQUAL TO 'private' "
    + ' LIMIT 100';
  var result = FusionTables.Query.sqlGet(sql);
  content.result = {"columns":result.columns,"rows":result.rows};
 
  var output = HtmlService.createTemplateFromFile("list");
  output.content = content;
  content.response = output.evaluate();
  Logger.log('publicList response:'+content.response);
  return content
  
}
routerData.logicMapping['publicList'] = publicList;

function mylist(_content) {
  var content = _content;
  var e = content.request;
  // 一覧画面の表示
  //ROWID, code, price, uid, scope, filename, ext, content, timestamp
  var sql = 'SELECT ROWID, filename, ext, timestamp, uid, scope FROM ' + tableId 
    + ' WHERE '
    + " uid = '" + e.uid + "'"
    + ' LIMIT 100';
  var result = FusionTables.Query.sqlGet(sql);
  content.result = {"columns":result.columns,"rows":result.rows};
  return content;
}
routerData.logicMapping['mylist'] = mylist;


// レコード追加
function createRecordBL(_content) {
  var content = _content;
  var e = content.request;
  var form = { filename :e.filename||''
              ,ext :e.ext|| "txt"
              ,timestamp :formatDate(new Date())
              ,scope :e.parameters.scope || "public"
              ,content :Utilities.base64Encode(encodeString(e.parameters.datafile.contents), Utilities.Charset.UTF_8) || ""
             }
  var sql = "INSERT INTO " + tableId
   + " ('filename','ext','timestamp','uid','scope','content')"
   + " VALUES ('" + form.filename + "','" + form.ext + "','" + form.timestamp + "','" + e.uid + "','" + form.scope + "','" + form.content + "')";
  Logger.log('createRecordBL sql#1:'+sql);
  Logger.log('=================:');
  FusionTables.Query.sql(sql);
  return content;
}
routerData.logicMapping['createRecord'] = createRecordBL;

// レコード追加
function createRecord(form) {
  //{"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":{"ext":"txt","filename":"bbbb","scope":"","datafile":{"type":"text/plain","length":356,"contents":"ump\r\nsiolabsrv01txtdbmovedat\r\n\r\n","name":"SVNh.txt"},"pathInfo":"createRecord.json"}
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":form};
 /*
  var pathInfo = splitExt(e.parameters.uid+"/"+e.parameters.projectid+"/"+e.parameters.datafile.name);
  
  e.path = pathInfo[1].split("/");
  e.filename = pathInfo[3]||'';
  e.ext = pathInfo[4]||'';
   */ 
  return JSON.stringify(doExec(e,"POST"));
}

// レコード更新
function updateRecordBL(_content) {
  var content = _content;
  var e = content.request;
  Logger.log('updateRecordBL '+e.filename);
  // 更新・削除画面の表示
  //ROWID, code, price, uid, scope, filename, ext, content, timestamp
  var selectsql = "SELECT ROWID, filename, ext, timestamp, uid, scope, content FROM " + tableId + " WHERE filename = '" + e.filename +"'"
   + " and ext = '" + e.ext + "'";
  Logger.log('updateRecordBL sql#1:'+selectsql);
  var selectresult = FusionTables.Query.sqlGet(selectsql);
  Logger.log('updateRecordBL result:'+selectresult);
  
  if( selectresult.rows && selectresult.rows.length > 0 ) {
    
    var row = selectresult.rows[0];
    var row_id = row[0];
    
    var form = { filename :e.filename||''
              ,ext :e.ext|| "txt"
              ,filename :e.filename || ""
              ,ext :e.ext || "txt"
              ,timestamp :formatDate(new Date())
              ,scope :e.parameters.scope || "public"
              ,content :Utilities.base64Encode(encodeString(e.parameters.datafile.contents), Utilities.Charset.UTF_8) || ""
             }
    var sql = "UPDATE " + tableId
     + " SET timestamp='" + form.timestamp + "', scope='" + form.scope + "', content='" + form.content + "'"
     + " WHERE ROWID = '" + row_id + "'";
    Logger.log('updateRecordBL sql#2:'+sql);
    var cnt = FusionTables.Query.sql(sql);
    Logger.log('updateRecordBL rows:'+cnt.rows);
    content.result = {"rows":cnt.rows};
  }else{
    e.action = 'createRecord';
  }
  return content;
}
routerData.logicMapping['updateRecord'] = updateRecordBL;
// レコード更新
function updateRecord(form) {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":form};
  var pathInfo = splitExt(e.parameters.uid+"/"+e.parameters.projectid+"/"+e.parameters.datafile.name);

  e.path = pathInfo[1].split("/");
  e.filename = pathInfo[3]||'';
  e.ext = pathInfo[4]||'';
    
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
