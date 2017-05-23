"use strict";
/**
 * Скрипт выполняющийся после того как страница загрузится
 */
$(document).ready(function () {
    try {
        $(".loader").hide();
        /**
         * Функция которая настраивает отображение таблицы и её функционал.
         * Для деталей рекомендуется ознакомится с документацией по адрессу:
         * http://bootstrap-table.wenzhixin.net.cn/documentation/
         */
        $(function () {
            var $table = $('#table').bootstrapTable({
                data: json_data,
                smartDisplay: 1,
                detailFormatter: detailFormatter,
                detailView: 1,
                showHeader: 0,
                columns: [{
                    title: "",
                    field: "title",
                    class: "spanLink",
                    formatter: titleFormatter
                }, {
                    title: "",
                    field: "published",
                    class: "spanLink",
                    formatter: publishedFormatter
                }]
            });
            tableLoad();
        });
        /**
         * Если запрошеный URL имеет #hash составляющую, то производится клик по элементу с id=hash.
         */
        var hash = window.location.hash.substr(1);
        if (!(hash == null)) {
            setTimeout(function () {
                document.getElementById(hash).click();
            }, 100);
        }
        /**
         * Клик по строке таблицы, производит клик по кнопке развернутого вида записи.
         */
        $("#table").on("click", "tr", function () {
            $(this).find(".detail-icon").trigger("click");
        });
        /**
         * При клике по чекбоксу производится перезагрузка таблица с перепроверкой состояния чекбоксов.
         */
        $(".filter-checkbox").click(function () {
            tableLoad();
        });
    } catch (err) {
        console.log(err);
    }
});


/**
 * Функция которая участвует в составлении выборки записей для отображения в таблице.
 * Если запись отвечает истиной на все условия, то она добавляется в выборку.
 * @param {item} item; обьект типа Job из json_data;
 * @return {boolean} true если запись отвечает true на все три функции, false в противном случае;
 */
var grepFunc = function (item) {
    /**
     * Функция проверки наличия определеного значения среди обьектов массива;
     * @param {array} array; массив для проверки;
     * @param {string} val; значение для проверки;
     * @return {boolean} возвращает true если массив содержит проверяемое значение;
     */
    function checkAvailability(arr, val) {
        return arr.some(arrVal => val === arrVal);
    }

    function checkbox1Tz() {
        return true;
    }

    /**
     * Функция для проверки обьектов массива на наличие среди них "WORKAUTH_US" тэга;
     * @param {array} array; массив с тэгами для проверки;
     * @return {boolean} в зависимости от состояния чекбокса #checkboxUSauth
     * выдает true либо для записей без "WORKAUTH_US", либо для всех записей;
     */
    function checkbox2WorkauthUS(array) {
        if (checkUSauth == true) {
            return !(checkAvailability(array, 'WORKAUTH_US'));
        } else if (checkUSauth == false) {
            return true;
        }
    }

    /**
     * Функция для проверки обьектов массива на наличие среди них "WORKAUTH_EU" тэга;
     * @param {array} array; массив с тэгами для проверки;
     * @return {boolean} в зависимости от состояния чекбокса #checkboxEUauth
     * выдает true либо для записей без "WORKAUTH_EU", либо для всех записей;
     */
    function checkbox2WorkauthEU(array) {
        if (checkEUauth == true) {
            return !(checkAvailability(array, 'WORKAUTH_EU'));
        } else if (checkEUauth == false) {
            return true;
        }
    }

    /**
     * Функция для проверки обьектов массива на наличие среди них "REMOTE1_50" тэга;
     * @param {array} array; массив с тэгами для проверки;
     * @return {boolean} в зависимости от состояния чекбокса с "remote 50%";
     * выдает true либо для записей без "REMOTE1_50", либо для всех записей(и с и без "REMOTE1_50");
     */
    function checkbox3Remoteness(array) {
        if (check50remote == true) {
            return true;
        } else if (check50remote == false) {
            return !(checkAvailability(array, 'REMOTE1_50'));
        }
    }

    return checkbox3Remoteness(item.tags) && checkbox2WorkauthUS(item.tags) && checkbox2WorkauthEU(item.tags) && checkbox1Tz();
};

/**
 * Набор глобальных переменых с состояниями чекбоксов.
 * @var {boolean} все переменые булевые.
 */
var check50remote = false;
var checkUSauth = false;
var checkEUauth = false;


/**
 * Функция проверяющая состояния чекбоксов и записывающая их глобальные переменые.
 */
function readCheckboxesState() {
    check50remote = $('#checkbox50remote').prop('checked');
    checkUSauth = $('#checkboxUSauth').prop('checked');
    checkEUauth = $('#checkboxEUauth').prop('checked');
}


function tableLoadLongAndHideLoader() {
    $('#table').bootstrapTable('load', $.grep(json_data, grepFunc));
    $(".loader").hide();
    $("#table").show();
}

/**
 * Функция загружающая таблицу и отображающая индикатор загрузки.
 */
function tableLoad() {
    readCheckboxesState();
    if (json_data.length <= 50) {
        $('#table').bootstrapTable('load', $.grep(json_data, grepFunc));
    } else {
        $(".loader").show();
        $("#table").hide();
        setTimeout(tableLoadLongAndHideLoader, 0);
    }
}


/**
 * Форматирует информацию для презентации в развернутом виде записи.
 * @param {int} index, index=data-index строки;
 * @param {item} row; обьект типа Job из json_data, тоже что и item;
 * @return {string} html форматированая презентация развернутого вида записи;
 */
function detailFormatter(index, row) {
    var html = [];
    var sourceName = "";
    var passUrl = "";
    html.push('<span class="detailFooter"></span> <div class="detailContent">');
    $.each(row, function (key, value) {
        if (key == "title") {
        } else if (key == "url") {
            passUrl = '<div class="row"><div class="col-xs-6">' + '<a href="' + value + '">View original job desription <i class="fa fa-external-link" aria-hidden="true"></i></a>' + ' </div><div class="col-xs-6 text-right">' + '<a href="#' + row.id + '">Get shareable link <i class="fa fa-link" aria-hidden="true"></i></a>' + '</div> </div>';
            html.push(passUrl);
        } else if (key == "content") {
            html.push('<p>' + value + '</p>' + passUrl + '</div><span class="detailFooter"></span>');
        } else if (key == "sourceName") {
            sourceName = value;
        } else {

        }
    });
    return html.join('');
}


/**
 * Форматер столбцов может передавать до трех типов аргументов.
 * @param arg1 {string} value; значение item.'collumn field':value для этой записи;
 * @param arg2 {item} item; обьект типа Job из json_data относящийся к этой записи;
 * @param arg3 {integer} index; значение по index:value из данной записи;
 */
/**
 * Форматер для столбца published.
 * @param {string} value; значение published для обьекта Job;
 * @return {string} форматированя строка, содержащая только дату и месяц;
 */
function publishedFormatter(value) {
    var publishedDay = value.split(",")[0];
    return '<p class="publishedDate">' + publishedDay + '</p>';
}

/**
 * Форматер для столбца title.
 * @param {string} value; значение title для обьекта Job;
 * @param {item} row; обьект типа Job из json_data;
 * @return {string} кнопка развернутого вида + название записи + набор тэгов декорированных в спаны с лэйблами;
 */
function titleFormatter(value, row) {
    var tagsNames1 = tagsDeco(row.tagsNames1);
    var tagsNames2 = tagsDeco(row.tagsNames2);
    var labelTags = tagsNames1 + tagsNames2;
    return '<a class="detail-icon" href="#"><i class="fa fa-plus-square-o iconStyle"></i></a> ' + row.title + '<br>' + labelTags;
}

/**
 * Декоратор тэгов, упаковывает в спаны в виде лэйблов.
 * @param {array} tags; массив с тэгами, передается из записи, например: row.tagsNames1, row.tags;
 * @return {string} rtTags, возвращает суму отдекорированых в лэйблы тэгов;
 */
function tagsDeco(tags) {
    var appendValue = "";
    var rtTags = "";
    var i = 0;
    for (i = 0; i < tags.length; i++) {
        appendValue = '<span class = "tag label label-primary labelTag">' + tags[i] + '</span>';
        rtTags = rtTags.concat(appendValue);
    }
    return rtTags;
}