"use strict";

var checkWorldwide = false;
var check50remote = false;
var checkUSauth = false;
var checkEUauth = false;
var checkUStz = false;
var checkEUtz = false;
var checkASIAtz = false;
var regexpTzUS = new RegExp('^(TZ_America)', 'g');

var json_data = [];
var isDataLoaded = false;

var lunarIndex;
var isLunarIndexLoaded = false;
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
var mapIdToJob = new Map();
var json_data_original = [];

/**
 * runs when page load complete
 */
$(document).ready(function () {
    try {
        $(".loader").show();

        try {
            // Send a request to get the DATA json file
            $.getJSON('/assets/data/' + dataFileName + '.json', onLoadDataFile).error(
                function(jqXHR, textStatus, errorThrown) {
                    $( "#loaderID" ).hide();
                    $("#alertCanNotLoadID").text(jqXHR.status + ' ' + errorThrown);
                    $("#alertCanNotLoadID").show();
                    return;
                }
            );
        } catch (err) {
            console.log(err);
        }
        try {
            // Send a request to get the INDEX json file
            $.getJSON('/assets/lunar-index/'+dataFileName+'.json', onLoadLunarIndex);
        } catch (err) {
            console.log(err);
        }
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
                locale: 'en-US',
                uniqueId: 'id',
                icons: {
                    detailOpen: 'fa fa-plus-square iconStyle',
                    detailClose: 'fa fa-minus-square iconStyle'
                },
                columns: [
                    {
                        title: "",
                        field: "title",
                        class: "spanLink",
                        formatter: titleFormatter
                    },
                    {
                        title: "",
                        field: "published",
                        class: "spanLink",
                        formatter: publishedFormatter,
                        width: "12%"
                    }
                ]
            });
            $("#table").bootstrapTable('hideLoading');
            $("#table").hide();

            readCheckboxesState();
        });

        // click on table row -> click on ".detail-icon"
        /*
        $("#table").on("click", "tr", function () {
            $(this).find(".detail-icon").trigger("click");
        });
        */

        $("#jobSearchForm").submit(handleJobSearchFormSubmit);
        $(".filter-checkbox").click(handleClickOnFilterCheckbox);
    } catch (err) {
        console.log(err);
    }
});

function onLoadDataFile(data){
    console.log('data loaded');
    json_data = data.items;
    // duplicate json_data to json_data_original: we restore it later
    json_data_original=json_data.slice();

    isDataLoaded = true;
    $("#checkboxWorldwide").attr('disabled', false);
    $("#checkboxUStz").attr('disabled', false);
    $("#checkboxEUtz").attr('disabled', false);
    $("#checkboxASIAtz").attr('disabled', false);
    $("#checkboxUSauth").attr('disabled', false);
    $("#checkboxEUauth").attr('disabled', false);
    $("#checkbox50remote").attr('disabled', false);

    // we can call tableLoad ONLY when isDataLoaded == true
    tableLoad(true);
    enableSearchControls();
}

/**
 * Initialization of global variables:
 *   lunarIndex
 *   mapIdToJob
 *
 * @param data pre-built Lunar index in JSON format
 */
function onLoadLunarIndex(data){
    console.log('lunar index loaded: '+data);
    lunarIndex=lunr.Index.load(data);

    isLunarIndexLoaded=true;

    // Loop through json_data, build mapIdToJob
    // we need mapIdToJob only for search, we don't need it earlier
    $.each(json_data, function (index, result) {
            // here "result" is of type "Job"
            mapIdToJob.set(result.id, result);
        }
    );
    enableSearchControls();
}

/**
 * Enables search field and button when BOTH
 * isLunarIndexLoaded and isDataLoaded are true
 */
function enableSearchControls(){
    if(isLunarIndexLoaded && isDataLoaded){
        $("#jobSearchInputID").attr('disabled', false);
        $("#jobSearchButton").attr('disabled', false);
    }
}

/**
 * The grep/filter function for http://api.jquery.com/jquery.grep/
 * @param {item} array of elements of type Job
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
 * Job search form - the "submit" handler
 * @param event
 */
function handleJobSearchFormSubmit(event){
    event.preventDefault();
    if (!isLunarIndexLoaded) {
        return false;
    }


    var query = $("#jobSearchInputID").val();
    console.log('search for: '+query);

    // Find the results from lunr
    var lunarSearchResults = lunarIndex.search(query);
    console.log('lunarSearchResults: '+lunarSearchResults);


    $("#table").hide();
    $(".loader").show();
    if(query.trim()){
        //"query" is non empty

        // empty json_data, we fill it with jobs from lunarSearchResults, see below
        json_data.length = 0;

        // Loop through results
        var job;
        $.each(lunarSearchResults, function(index, result){
            //if(result.score > 0.02) {
                job=mapIdToJob.get(result.ref);
                if (job){
                    //console.log('job :' + JSON.stringify(job, null, 4));
                    json_data.push(job);
                }
                else {
                    console.log('job not found, ref: ' + result.ref);
                }
            //}
        });
    }
    else{
        // empty "query" -> restore the original array of jobs
        // this replace the "clear" button
        console.log('empty query, restoring json_data');
        json_data = json_data_original.slice();
    }
    // reload table with jobs
    tableLoad(false);
    return false;
}

/**
 * Search criteria checkboxes handler
 */
function handleClickOnFilterCheckbox() {
    $("#table").hide();
    $(".loader").show();

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
    console.log('heavyTableLoadAndHideLoader start, shouldHideLoader='+shouldHideLoader);
    $('#table').bootstrapTable('load', $.grep(json_data, grepFunc));

    if (shouldHideLoader) {
        $("#table").bootstrapTable('hideLoading');
        $(".loader").hide();
        $("#table").show();
    }
    handleAnchorLink(isFirstLoad);
}

/**
 * Perform search and load table, handle anchor link
 * Pre-requisite: isDataLoaded==true
 */
function tableLoad(isFirstLoad) {
    if(isDataLoaded==false){
        console.log('tableLoad: isDataLoaded==false')
        return;
    }
    setTimeout(heavyTableLoadAndHideLoader(isFirstLoad, true), 0);
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
    html.push('<div class="detail-view"><td colspan="3"><span class="detailFooter"></span><div class="detailContent"><div class="row"><div class="highlight col-sm-12 col-md-12">');

    $.each(row, function (key, value) {
        if (key == "title") {
        }
        else if (key == "url") {
            passUrl = '<div style="padding-left: 0;" class="col-xs-6 col-md-6">' + '<a href="' + value + '">View original job desription <i class="fa fa-external-link" aria-hidden="true"></i></a>' + ' </div><div class="col-sm-6 col-md-6 text-right">' + '<a href="#' + row.id + '">Get shareable link <i class="fa fa-link" aria-hidden="true"></i></a>' + '</div>';
            /*html.push(passUrl);*/
        }
        else if (key == "content") {
            html.push(value + passUrl + '<span class="detailFooter"></span></td>');
        }
        else if (key == "sourceName") {
            sourceName = value;
        }
        else {

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
 * Formatter for "title" column.
 * @param {string} value; unused
 * @param {item} row; Job; see json_data;
 * @return {string} the "title" column as HTML
 */
function titleFormatter(value, row) {
    return '<a onClick="rowTitleClick(this);return false;" class="rowTitleClass" href="#'+row.id+'" id="'+row.id+'"><b>' + row.title + '</b></a><br>' + tagsDeco(row.tagsNames1) + tagsDeco(row.tagsNames2);
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

function rowTitleClick(aNode) {
    // console.log('rowTitleClick: '+aNode);
    var aNodeDetail=aNode.parentNode.parentNode.children[2].children[0];
    aNodeDetail.click();
    return false;
}

