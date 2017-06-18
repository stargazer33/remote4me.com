"use strict";

var checkWorldwide = false;
var check50remote = false;
var checkUSauth = false;
var checkEUauth = false;
var checkUStz = false;
var checkEUtz = false;
var checkASIAtz = false;
var regexpTzUS = new RegExp('^(TZ_America)', 'g');

/**
 * runs when page load complete
 */
$(document).ready(function () {
    try {
        $(".loader").show();
        /**
         * See http://bootstrap-table.wenzhixin.net.cn/documentation/
         */
        $(function () {
            $('#table').bootstrapTable({
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
            readCheckboxesState();
            tableLoad(true);
        });

        // click on table row -> click on ".detail-icon"
        $("#table").on("click", "tr", function () {
            $(this).find(".detail-icon").trigger("click");
        });

        $("#jobSearchForm").submit(handleJobSearchFormSubmit);
        $(".filter-checkbox").click(handleClickOnFilterCheckbox);
    } catch (err) {
        console.log(err);
    }
});

/**
 * The grep/filter function for http://api.jquery.com/jquery.grep/
 * @param {item} the current array item of type Job
 * @return {boolean} return 'true' when Job meets all search criteria/checkboxes
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
    /**
     * Функция проверки наличия определеного значениясоответсвующего регулярному выражению среди обьектов массива;
     * @param {array} array; массив для проверки;
     * @param {regexp obj} val; значение для проверки, обьект типа regexp;
     * @return {boolean} возвращает true если массив содержит проверяемое значение;
     */
    function checkAvailabilityRegexp(arr, val) {
        return arr.some(function(rx) { return val.test(rx); });
    }

    function checkbox1TzUS(array) {
        if (checkWorldwide) {
            return true;
        }
        if (checkUStz) {
            return checkAvailabilityRegexp(array, regexpTzUS);
        }
        return false;
    }

    function checkbox1TzEU(array) {
        if (checkWorldwide) {
            return true;
        }
        if (checkEUtz) {
            return checkAvailability(array, 'TZ_Europe');
        }
        return false;
    }

    function checkbox1TzASIA(array) {
        if (checkWorldwide) {
            return true;
        }
        if (checkASIAtz) {
            return checkAvailability(array, 'TZ_Asia');
        }
        return false;
    }

    function checkbox2WorkauthUS(array) {
        if (checkUSauth) {
            return !(checkAvailability(array, 'WORKAUTH_US'));
        }
        return true;
    }

    function checkbox2WorkauthEU(array) {
        if (checkEUauth) {
            return !(checkAvailability(array, 'WORKAUTH_EU'));
        }
        return true;
    }

    function checkbox3Remoteness(array) {
        if (check50remote) {
            return true;
        }
        return !(checkAvailability(array, 'REMOTE1_50'));
    }

    return checkbox3Remoteness(item.tags)
        && checkbox2WorkauthUS(item.tags)
        && checkbox2WorkauthEU(item.tags)
        && (checkbox1TzUS(item.tags) || checkbox1TzEU(item.tags) || checkbox1TzASIA(item.tags));
};

/**
 * job search form "submit" handler
 * TODO: implement actual filter functionality here
 * @param event
 */
function handleJobSearchFormSubmit(event){
    var query = $("#jobSearchInputID").val();
    console.log('search for: '+query);
    event.preventDefault();
}

/**
 * Search criteria checkboxes handler
 */
function handleClickOnFilterCheckbox() {
    switch( $(this).attr("id") ){
        case "checkboxWorldwide":
            $('#checkboxUStz').prop('checked', false);
            $('#checkboxEUtz').prop('checked', false);
            $('#checkboxASIAtz').prop('checked', false);
            break;
        case "checkboxUStz":
            $('#checkboxWorldwide').prop('checked', false);
            break;
        case "checkboxEUtz":
            $('#checkboxWorldwide').prop('checked', false);
            break;
        case "checkboxASIAtz":
            $('#checkboxWorldwide').prop('checked', false);
            break;
    }

    readCheckboxesState();
    changeCheckboxesState();

    tableLoad(false);
}

/**
 * Read DOM checkboxes state, save it global variables
 */
function readCheckboxesState() {
    checkWorldwide = $('#checkboxWorldwide').prop('checked');
    check50remote = $('#checkbox50remote').prop('checked');
    checkUSauth = $('#checkboxUSauth').prop('checked');
    checkEUauth = $('#checkboxEUauth').prop('checked');
    checkUStz = $('#checkboxUStz').prop('checked');
    checkEUtz = $('#checkboxEUtz').prop('checked');
    checkASIAtz = $('#checkboxASIAtz').prop('checked');
}

/**
 * Check "worldwide" if no timezone selected
 */
function changeCheckboxesState(){
    if (checkUStz == false && checkEUtz == false && checkASIAtz == false) {
        $('#checkboxWorldwide').prop('checked', true);
        readCheckboxesState();
    }
}

/**
 * If window.location.hash has #hash (anchor) -> than scroll to that anchor and click
 */
function handleAnchorLink(isFirstLoad) {
    if(!isFirstLoad){
        return;
    }
    var hash = window.location.hash.substr(1);
    if ( hash ) {
        document.getElementById(hash).scrollIntoView();
        document.getElementById(hash).click();
    }
}

function heavyTableLoadAndHideLoader(isFirstLoad, shouldHideLoader) {
    $('#table').bootstrapTable('load', $.grep(json_data, grepFunc));

    if (shouldHideLoader) {
        $(".loader").hide();
        $("#table").show();
    }
    handleAnchorLink(isFirstLoad);
}

/**
 * Perform search and load table, handle anchor link
 */
function tableLoad(isFirstLoad) {
    var shouldHideLoader = true;
    $(".loader").show();
    $("#table").hide();

    /*
    var shouldHideLoader = false;
    if (json_data.length > 50) {
        shouldHideLoader = true;
        $(".loader").show();
        $("#table").hide();
    }*/

    setTimeout(heavyTableLoadAndHideLoader(isFirstLoad, shouldHideLoader), 0);
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