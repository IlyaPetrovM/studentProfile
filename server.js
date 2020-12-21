var TABLE_URL = 'https://docs.google.com/spreadsheets/d/1jIS6vzfIFmGFFBW67k1R1JmNokP8tv5F7R50q0fV8GA/edit#gid=0';
var gtable = SpreadsheetApp.openByUrl(TABLE_URL);
/**
 * @brief Передаёт собирает веб-страницу и передаёт её клиенту в самом начале его захода на сайт
 * @param [in] event e событие
 * @return объект HtmlService - веб-страница (cм. https://developers.google.com/apps-script/reference/html/html-service)
 */
function doGet(e) {
    var template = HtmlService.createTemplateFromFile('Index');
    if(e.parameter['email'] !== undefined){
        template.emailFromGet = e.parameter['email'];
    }else{
        template.emailFromGet = Session.getActiveUser().getEmail();
    }
    template.editModeOn = e.parameter['edit'] == 1 ? true : false;

    return template.evaluate()
        .setTitle('Профиль '+ template.emailFromGet)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * @brief Получает список названий листов таблицы и отправляет их клиенту
 * @return массив названий листов таблицы (строки)
 */
function getSheets(){
    var shs = gtable.getSheets();
    var names = [];
    for(var i=0; i<shs.length; i++ ){
        names.push(shs[i].getSheetName());
    }
    return names;
}

/**
 * @brief Получает строки из конкретного листа, соответствующего id
 * @param [in] String sheetName Название листа
 * @param [in] String id Значение id, по которому ищутся записи в таблице
 * @param [in] String id_label Заголовок столбца, в котором надо искать id
 * @return Массив из объектов - записей таблицы
 */
function getData(sheetName, id, id_label) {
    var sh = gtable.getSheetByName(sheetName);
    var fieldsRow = 2;
    var fieldsArr = sh.getRange(fieldsRow, 1, 1, sh.getLastColumn()).getValues()[0];
    var fields = getFieldsNums(fieldsArr);
    fieldsArr = Object.keys(fields);
    var colWithIds = sh.getRange(1, 1, sh.getLastRow()).getValues(); // getRange(row, column, numRows, numColumns)
    var rowNums = getRowNums(colWithIds, id);
    var d = [];
    for (var i = 0; i < rowNums.length; i++) {
        var obj = {};
        fieldsArr.forEach((key, col) => obj[key] = "" + sh.getRange(rowNums[i]+1, col + 1).getValue());
        d.push(obj);
    }
    var format = '';
    var sheetLayout = getSheetLayout(sh);
    if(sheetLayout == 'template'){
        format = getTemplRange(sh).getValue();
    }
    return { /// TODO
        "data": d,
        "sheetName": sheetName,
        "sheetId": new String(sheetName).replace(/ /gi, '_'),
        "sheetLayout": sheetLayout,
        "format": format
    };
}
function getSheetLayout(sh){
    return sh.getRange(1,2).getValue();
}

/**
 * @brief Превращает значения массива в ключевые значения объекта
 * @param [in] Array[] head массив значений
 * @return объект с номерами названий столбцов от _0_ до n (например, {age: 0, name: 1})
 */
function getFieldsNums(head) {
    var fields = {};
    for (var cell = 0; cell < head.length; cell++) {
        if (head[cell] != '')
            fields[head[cell]] = cell; // Записываем, какие заголовки у нас есть в таблице и какие номера им присвоены
    }
    return fields;
}

/**
 * @brief Получает из массива-столбца номера нужных строк
 * @param [in] Array column столбец
 * @param [in] String id идентефикатор, который ищется в строке
 * @return Массив с номерами строк (int)
 */
function getRowNums(column, id) {
    var nums = [];
    for (var row in column) {
        if (column[row][0] == id) {
            nums.push(parseInt(row));
        }
    }
    return nums;
}

/**
 * @brief Получает строки из конкретного листа, соответствующего id
 * @param [in] String sheetName Название листа
 * @param [in] String id Значение id, по которому ищутся записи в таблице
 * @param [in] String id_label Заголовок столбца, в котором надо искать id
 * @return Массив из объектов - записей таблицы
 */
function getDataTemplate(sheetName, id, id_label) {
    var sh = gtable.getSheetByName(sheetName);
    var fieldsRow = 2;
    var fieldsArr = sh.getRange(fieldsRow, 1, 1, sh.getLastColumn()).getValues()[0];
    var fields = getFieldsNums(fieldsArr);
    fieldsArr = Object.keys(fields);


    var format = '';
    var sheetLayout = getSheetLayout(sh);
    if(sheetLayout == 'template'){
        format = getTemplRange(sh).getValue();
    }
    return { /// TODO
        fields: fieldsArr,
        "sheetName": sheetName,
        "sheetId": new String(sheetName).replace(/ /gi, '_'),
        "sheetLayout": sheetLayout,
        "format":format
    };
}

function saveTemplate(sheetName, html){
    var sh = gtable.getSheetByName(sheetName);
    var templRange = getTemplRange(sh);
    templRange.setValue(html);
    return true;
}

function getTemplRange(sh){
    return sh.getRange(1,1);
}

