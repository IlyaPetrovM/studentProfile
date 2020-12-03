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
    var fieldsRow = 1;
    var fieldsArr = sh.getRange(fieldsRow, 1, 1, sh.getLastColumn()).getValues()[0];
    var fields = getFieldsNums(fieldsArr);
    fieldsArr = Object.keys(fields);
    var colWithIds = sh.getRange(1,  1, sh.getLastRow()).getValues(); // getRange(row, column, numRows, numColumns)
    var rowNums = getRowNums(colWithIds, id);
    var d = [];
//    for (var i = 0; i < 2; i++) {
        var obj = {};
//        var values = sh.getRange(10, 1, 1, fieldsArr.length-1).getValues();
//        Logger.log(values);
//        var values = sh.getRange(10, 1, 1, fieldsArr.length-1).getValues()[0];
//        Logger.log(values);
//        fieldsArr.forEach((key, col) => obj[key] = new String(values[col]));
//        d.push(values);
//    }
    return sh.getRange(10, 1, 1, fieldsArr.length-1).getValues()[0];  //*< \TODO: Почему-то обрабатывает только первые три строчки - остальные возвращает null. Возможно связано со временем выполнения
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

function selectRows(data, nums){
    var res = [];

    var keys = data[0];
    for(var r in data){
        var values = data[r];
        if(values[id_col] == id){
            var row = {};
//            keys.forEach((key, i) => row[key] = values[i]);
            res.push(values);
        }
    }
    Logger.log(data);
    return data[5];
}
