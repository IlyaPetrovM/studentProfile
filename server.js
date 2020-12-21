var TABLE_URL = 'https://docs.google.com/spreadsheets/d/1jIS6vzfIFmGFFBW67k1R1JmNokP8tv5F7R50q0fV8GA/edit#gid=0';
var gtable = SpreadsheetApp.openByUrl(TABLE_URL);
/**
 * @brief Передаёт собирает веб-страницу и передаёт её клиенту в самом начале его захода на сайт
 * @param [in] event e событие
 * @return объект HtmlService - веб-страница (cм. https://developers.google.com/apps-script/reference/html/html-service)
 */
function doGet(e) {
    var template = HtmlService.createTemplateFromFile('Index');
    if (e.parameter['email'] !== undefined) {
        template.emailFromGet = e.parameter['email'];
    } else {
        template.emailFromGet = Session.getActiveUser().getEmail();
    }
    template.editModeOn = e.parameter['edit'] == 1 ? true : false;

    return template.evaluate()
        .setTitle('Профиль ' + template.emailFromGet)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * @brief Получает список названий листов таблицы и отправляет их клиенту
 * @return массив названий листов таблицы (строки)
 */
function getSheets() {
    var shs = gtable.getSheets();
    var names = [];
    for (var i = 0; i < shs.length; i++) {
        names.push(shs[i].getSheetName());
    }
    return names;
}

function getFieldsRow(sh) {
    return 2;
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
    var meta = getMeta(sh);
    var rows_of_data = get_rows_of_data(sh.getRange(1, meta.fields[id_label], sh.getLastRow()).getValues(), id);
    var data = row_to_dataobject(rows_of_data, meta.fields, sh);
    return packTable(data, sheetName, sh, meta);
}
function getDataTemplate(sheetName, id, id_label) {
    var sh = gtable.getSheetByName(sheetName);
    var meta = getMeta(sh);
    return packTable(null, sheetName, sh, meta, Object.keys(meta.fields));
}
function getMeta(sh) {
    var rowNames = getRowNames(sh);
    var table_fields = get_object_from_row(sh.getRange(rowNames['table_fields'], 1, 1, sh.getLastColumn()).getValues()[0]);
    var fields = get_object_from_row(sh.getRange(rowNames.fields, 1, 1, sh.getLastColumn()).getValues()[0]);
    return {rowNames, table_fields, fields};
}

function packTable(data, sheetName, sh, meta, fields) {
    return {
        "data": data,
        fields: fields,
        "sheetName": sheetName,
        "tabName": sh.getRange(meta.rowNames.table_values, meta.table_fields.tabName).getValue(),
        "sheetId": new String(sheetName).replace(/ /gi, '_'),
        "sheetLayout": sh.getRange(meta.rowNames.table_values, meta.table_fields.sheetLayout).getValue(),
        "format": sh.getRange(meta.rowNames.table_values, meta.table_fields.format).getValue()
    };
}

function row_to_dataobject(rows_of_data, fields, sh) {
    var output_objects = [];

    var keys = Object.keys(fields);
    for (var i = 0; i < rows_of_data.length; i++) {
        var obj = {};
        keys.forEach((key, col) => obj[key] = "" + sh.getRange(rows_of_data[i], col+1).getValue());
        output_objects.push(obj);
    }
    return output_objects;
}

function getSheetLayout(sh) {
    return sh.getRange(1, 2).getValue();
}

/**
 * @brief Превращает значения массива в ключевые значения объекта
 * @param [in] Array[] head массив значений
 * @return объект с номерами названий столбцов от _1_ до n (например, {age: 0, name: 1})
 */
function get_object_from_row(head) {
    var fields = {};
    for (var cell = 0; cell < head.length; cell++) {
        if (head[cell] != '')
            fields[head[cell]] = cell+1; // Записываем, какие заголовки у нас есть в таблице и какие номера им присвоены
    }
    return fields;
}

/**
 * @brief Получает из массива-столбца номера нужных строк
 * @param [in] Array column столбец
 * @param [in] String id идентефикатор, который ищется в строке
 * @return Массив с номерами строк (int)
 */
function get_rows_of_data(column, id) {
    var nums = [];
    Logger.log('column',column, id);
    for (var row in column) {
        if (column[row][0] == id) {
            nums.push(parseInt(row)+1);
        }
    }
    return nums;
}



function saveTemplate(sheetName, html) {
    var sh = gtable.getSheetByName(sheetName);
    var meta = getMeta(sh);
    sh.getRange(meta.rowNames.table_values, meta.table_fields.format).setValue(html);
    return true;
}

function getRowNames(sh) {
    var range = sh.getRange(1, 1, sh.getLastRow()).getValues();
    var names = {};
    for (var row in range) {
        if (range[row][0] != '') {
            names[ ''+range[row][0] ] = parseInt(row)+1;
        }
    }
    return names;
}
