function doGet(e) {
    var template = HtmlService.createTemplateFromFile('Index');
    if(e.parameter['email'] !== undefined){
        template.emailFromGet = e.parameter['email'];
    }else{
        template.emailFromGet = Session.getActiveUser().getEmail();
    }
    return template.evaluate()
        .setTitle('Профиль '+ template.emailFromGet)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getUserEmail() {
    return Session.getActiveUser().getEmail();
}

function getTitelsNums(data){
    var head = data[0];
    var titles = {};
    for(var cell=0; cell < head.length; cell++){
        if(head[cell] != '')
          titles[ head[cell] ] = cell+1; // Записываем, какие заголовки у нас есть в таблице и какие номера им присвоены
    }
    return titles;
}

//function getRowsById(sh, titles, id, id_label) {
//    var userInfo = [];
//    var id_row_no = 0; //номер строки ученика
//    var shLR = sh.getLastRow();
//
//    var id_col = sh.getRange(1, titles[id_label], shLR, titles[id_label]).getValues();
//    var labelRow = 2;
//
//    var keys = Object.keys(titles);
//    for (var i = 0; i < shLR; i++) {
//        if (id_col[i][0] == email) {
//            id_row_no = i + 1;
//            var info = {}
//
//            for (var j in keys) {
//                info[keys[j]] = {
//                    label: "" + sh.getRange(labelRow, titles[keys[j]]).getValue(), // label Row
//                    value: "" + sh.getRange(id_row_no, titles[keys[j]]).getValue()
//                };
//            }
//            userInfo.push(info);
//        }
//    }
//    return userInfo;
//}
//
//function getFirstRowById(sh, titles, id, id_label) {
//    var info = {};
//    
//    var labelRow = 2;
//
//    var shLR = sh.getLastRow();
//    var id_col = sh.getRange(1, titles[id_label], shLR, titles[id_label]).getValues();
//
//    var r = 0; //номер строки ученика
//    for (var i = 0; i < shLR; i++) {
//        if (id_col[i][0] == email) {
//            r = i + 1;
//            var keys = Object.keys(titles);
//            for (var j in keys) {
//                info[keys[j]] = {
//                    label: "" + sh.getRange(labelRow, titles[keys[j]]).getValue(), // label Row
//                    value: "" + sh.getRange(r, titles[keys[j]]).getValue()
//                };
//            }
//            break;
//        }
//    }
//    return info;
//}

//function getDataFromSheet(sheetName, id, id_label){
//    var sh = gtable.getSheetByName(sheets[i].getName());
//    var data = sh.getRange(1,sh.getLastCol(),sh.getLastRow(),sh.getLastCol()).getValues();
//    var titles = getTitelsNums(data);
//    var filter = getRowsById(data, titles, id, id_label);
//}

function getSheets(){
    var gtable = SpreadsheetApp.openByUrl(TABLE_URL);
    var shs = gtable.getSheets();
    var names = [];
    for(vat i=0; i<shs.length; i++ ){
        names.push(shs[i].getName());
    }
    return names;
}


//
//function getTeamsInfo(email){
//    var data = getSheetData(TABLE_URL,'Teams');
//
//    var teamsInfo = getFirstInfoByEmail(sh, titles, email, 'email');
//    return teamsInfo;
//}
//
//function getDefaultInfo(email){
//    var em = email;
//
//    var url = TABLE_URL; 
//    var sp = SpreadsheetApp.openByUrl(url);
//    var sh = sp.getSheetByName("olymp");
//
//    // Определение строк
//    var head = sh.getRange("1:1").getValues()[0];
//    var titles = {};
//    for(var cell=0; cell<head.length; cell++){
//        if(head[cell] != '')
//          titles[ head[cell] ] = cell+1; // Записываем, какие заголовки у нас есть в таблице и какие номера им присвоены
//    }
//
//    var r=0; //номер строки ученика
//    var shLR=sh.getLastRow();
//    var ran = sh.getRange(1,titles['email'],shLR,titles['email']);
//    var data = ran.getValues();
//
//    var olymps = [];
//    var sorry = "Вас нет в ДГшной базе олимпиад :(";
//    for (var i = 0; i<shLR; i++) {
//        if (data[i][0] == em) {
//            r=i+1; 
//            var info = {};
//            var keys = Object.keys(titles);
//            for(var j in keys){
//                info[keys[j]] = ""+sh.getRange(r, titles[keys[j]]).getValue();
//            }
//            olymps.push(info);
//        }  
//    } // конец цикла по строкам
//    Logger.log(olymps);
//    return olymps;
//}
