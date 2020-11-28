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

function getTitelsNums(sh){
    var head = sh.getRange("1:1").getValues()[0];
    var titles = {};
    for(var cell=0; cell < head.length; cell++){
        if(head[cell] != '')
          titles[ head[cell] ] = cell+1; // Записываем, какие заголовки у нас есть в таблице и какие номера им присвоены
    }
    return titles;
}

function getFirstInfoByEmail(sh, titles, email){
    var info = {};
    
    var r=0; //номер строки ученика
    var shLR=sh.getLastRow();
    var ran = sh.getRange(1,titles['email'],shLR,titles['email']);
    var data = ran.getValues();
    var labelRow = 2;

    for (var i = 0; i<shLR; i++) {
        if (data[i][0] == email) {
            r=i+1; 
            var keys = Object.keys(titles);
            for(var j in keys){
                info[keys[j]] = {label:""+sh.getRange(labelRow, titles[keys[j]]).getValue(), // label Row
                                 value:""+sh.getRange(r, titles[keys[j]]).getValue()};
            }
            break;
        }  
    }
    return info;
}

function getTeamsInfo(email){
    var sh = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1UAEi3OsgwtWncXIOsGvCpNs1O8zFSiE9Vz0ximD9YIA/edit')
                            .getSheetByName("Teams");
    var titles = getTitelsNums(sh);
    var teamsInfo = getFirstInfoByEmail(sh, titles, email);
    return teamsInfo;
}

function getDefaultInfo(email){
    var em = email;

    var url = 'https://docs.google.com/spreadsheets/d/1UAEi3OsgwtWncXIOsGvCpNs1O8zFSiE9Vz0ximD9YIA/edit';
    var sp = SpreadsheetApp.openByUrl(url);
    var sh = sp.getSheetByName("olymp");

    // Определение строк
    var head = sh.getRange("1:1").getValues()[0];
    var titles = {};
    for(var cell=0; cell<head.length; cell++){
        if(head[cell] != '')
          titles[ head[cell] ] = cell+1; // Записываем, какие заголовки у нас есть в таблице и какие номера им присвоены
    }

    var r=0; //номер строки ученика
    var shLR=sh.getLastRow();
    var ran = sh.getRange(1,titles['email'],shLR,titles['email']);
    var data = ran.getValues();

    var olymps = [];
    var sorry = "Вас нет в ДГшной базе олимпиад :(";
    for (var i = 0; i<shLR; i++) {
        if (data[i][0] == em) {
            r=i+1; 
            var info = {};
            var keys = Object.keys(titles);
            for(var j in keys){
                info[keys[j]] = ""+sh.getRange(r, titles[keys[j]]).getValue();
            }
            olymps.push(info);
        }  
    } // конец цикла по строкам
    Logger.log(olymps);
    return olymps;
}
