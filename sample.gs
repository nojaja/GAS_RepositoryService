
var tableId = '1_sL5eP-Vm63nfDplqME3---yb9Y5ElehHztCjXKw'; //作成したFusionTableのurlに含まれるdocidを指定します

function createBL(_content) {
  var content = _content;
  var e = content.request;
  return content;
}
routerData.logicMapping['create'] = createBL;

function getContent(_content) {
  var content = _content;
  var e = content.request;
  Logger.log('getContent '+e.filename);
  // 更新・削除画面の表示
  //ROWID, code, price, uid, scope, filename, ext, content, timestamp
  var sql = "SELECT ROWID, filename, ext, timestamp, uid, scope, content FROM " + tableId + " WHERE filename = '" + e.filename +"'";
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
  var form = { filename :e.parameters.filename || ""
              ,ext :e.parameters.ext || "txt"
              ,timestamp :formatDate(new Date())
              ,scope :e.parameters.scope || "public"
              ,content :Utilities.base64Encode(e.parameters.content, Utilities.Charset.UTF_8) || ""
             }
  var sql = "INSERT INTO " + tableId
   + " ('name','ext','timestamp','uid','scope','content')"
   + " VALUES ('" + form.filename + "','" + form.ext + "','" + form.timestamp + "','" + e.uid + "','" + form.scope + "','" + form.content + "')";
  FusionTables.Query.sql(sql);
}
routerData.logicMapping['createRecord'] = createRecordBL;

// レコード追加
function createRecord(form) {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":form,"pathInfo":"createRecord.json"};
  doExec(e,"GET");
}

// レコード更新
function updateRecordBL(_content) {
  var content = _content;
  var e = content.request;
  var form = { row_id : e.parameters.row_id
              ,filename :e.parameters.filename || ""
              ,ext :e.parameters.ext || "txt"
              ,timestamp :formatDate(new Date())
              ,scope :e.parameters.scope || "public"
              ,content :Utilities.base64Encode(e.parameters.content, Utilities.Charset.UTF_8)|| ""
             }
  var sql = "UPDATE " + tableId
   + " SET filename='" + form.filename + "', ext='" + form.ext + "', timestamp='" + form.timestamp + "', uid='" + e.uid + "', scope='" + form.scope + "', content='" + form.content + "'"
   + " WHERE ROWID = '" + form.row_id + "'";
   //+ " and uid = '" + e.uid + "'";
  Logger.log(sql);
  FusionTables.Query.sql(sql);
}
routerData.logicMapping['updateRecord'] = updateRecordBL;
// レコード更新
function updateRecord(form) {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":form,"pathInfo":"updateRecord.json"};
  doExec(e,"GET");
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
  doExec(e,"GET");
}
