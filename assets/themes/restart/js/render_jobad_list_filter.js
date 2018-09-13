"use strict";

var checkWorldwide = false;
var check50remote = false;
var checkUSauth = false;
var checkEUauth = false;
var checkUStz = false;
var checkEUtz = false;
var checkASIAtz = false;
var regexpTzUS = new RegExp('^(TZ/America)', 'g');

var json_data = [];
var isDataLoaded = false;

var lunarIndex;
var isLunarIndexLoaded = false;
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
var mapIdToJob = new Map();
var json_data_original = [];
var detailFormatterTemplate = null;

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
                    detailOpen: 'fa fa-caret-right iconStyle',
                    detailClose: 'fa fa-caret-down iconStyle'
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
                        width: "62px"
                    }
                ]
            });
            $("#table").bootstrapTable('hideLoading');
            $("#table").hide();

            readCheckboxesState();
        });

        $("#jobSearchForm").submit(handleJobSearchFormSubmit);
        $(".filter-checkbox").click(handleClickOnFilterCheckbox);

        // Stop dropdown menu from closing (keep it open) when clicked on one of its elements
        $("div.dropdown-menu").click(function(event){
          event.stopPropagation();
        });


        var source   = document.getElementById("detailFormatter").innerHTML;
        detailFormatterTemplate = Handlebars.compile(source);

        $('#reportthisjob-modal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget),
                recipient = button.data('postid');
        })
        //modal window (end)
    } catch (err) {
        console.log(err);
    }
});

function onLoadDataFile(data){
    console.log('data loaded');
    json_data = data.items;
    // duplicate json_data to json_data_original: we restore it later
    json_data_original=json_data.slice();

    // json_data initialized -> initialize mapIdToJob
    initMapIDToJob();

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

    //attach rowPlusMinusClick
    $("#table").find('>tbody').find('> tr[data-index] > td > .detail-icon').on('click', rowPlusMinusClick);
}

function initMapIDToJob() {
    // Loop through json_data, build mapIdToJob
    // we need mapIdToJob only for search, we don't need it earlier
    $.each(json_data, function (index, result) {
            // here "result" is of type "Job"
            mapIdToJob.set(result.id, result);
        }
    );
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
        return arr.some( function(element){return val === element;} );
    }
    /**
     * @param "arr" array to check
     * @param "regexp" a regexp to search in the array
     * @return {boolean} true in case the regexp found a match in arr; false if no match
     */
    function checkAvailabilityRegexp(arr, regexp) {
        return arr.some( function(rx){ return regexp.test(rx);} );
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
            return checkAvailability(array, 'TZ/Europe');
        }
        return false;
    }

    function checkbox1TzASIA(array) {
        if (checkWorldwide) {
            return true;
        }
        if (checkASIAtz) {
            return checkAvailability(array, 'TZ/Asia');
        }
        return false;
    }

    function checkbox2WorkauthUS(array) {
        if (checkUSauth) {
            return !(checkAvailability(array, 'WORKAUTH/US'));
        }
        return true;
    }

    function checkbox2WorkauthEU(array) {
        if (checkEUauth) {
            return !(checkAvailability(array, 'WORKAUTH/EU'));
        }
        return true;
    }

    function checkbox3Remoteness(array) {
        if (check50remote) {
            return true;
        }
        return !(checkAvailability(array, 'REMOTE1/50'));
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
    handleTextChangeInFilterButtons();
}
//Change button text when checkbox or radiobutton is clicked
function handleTextChangeInFilterButtons() {
  $("#btn-tz").text(computeTimezoneButtonText());
  $("#btn-auth").text(computeAuthButtonText());
  $("#btn-remote").text(computeRemoteButtonText());
}

// Compute text for timezone button depending on the checked inputs
function computeTimezoneButtonText() {
  var tzStr = "Timezone:";
  if (checkWorldwide) {
    tzStr = tzStr + " Worldwide";
  }
  if (checkUStz) {
    tzStr = tzStr + " US,";
  }
  if (checkEUtz) {
    tzStr = tzStr + " EU,";
  }
  if (checkASIAtz) {
    tzStr = tzStr + " Asia"
  }
  if (tzStr.slice(-1) == ",") {
    tzStr = tzStr.slice(0, -1);
  }
  return tzStr;
}
// Compute text for authentification button depending on the checked inputs
function computeAuthButtonText() {
  var authStr = "Work auth:";
  if (checkUSauth) {
    authStr = authStr + " US,";
  }
  if (checkEUauth) {
    authStr = authStr + " EU";
  }
  if (authStr.slice(-1) == ",") {
    authStr = authStr.slice(0, -1);
  }
  return authStr;
}
// Compute text for remoteness button depending on the checked inputs
function computeRemoteButtonText() {
  var remoteStr = "Remoteness: 100%";
  if (check50remote) {
    remoteStr = remoteStr + ", 50%";
  }
  return remoteStr;
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
 * @param {jobAd} jobAd; обьект типа Job из json_data
 * @return {string} table detail as HTML
 */
function detailFormatter(index, jobAd) {
    var context = {content: jobAd.content, url: jobAd.url, id: jobAd.id};
    return detailFormatterTemplate(context);
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
    var title = '<p  class="job-title"><a onClick="rowTitleClick(this);return false;" class="rowTitleClass" href="#'+row.id+'" id="'+row.id+'">' + row.title + '</a></p>';
    var tags = tagsFormatter(row);
    var organization = organizationFormatter(row);
    var salary = salaryFormatter(row);
    return title + organization + salary + tags;
}

/**
 * @return {string} HTML for job.hiringOrganization
 */
function organizationFormatter(job) {
    if (!job.hasOwnProperty("hiringOrganization"))
        return '';
    if (job.hiringOrganization.name == "UNSET")
        return '';

    if (job.hiringOrganization.sameAs !== "UNSET") {
        return '<p class="job-info org-info"><a href="' + job.hiringOrganization.sameAs + '">' + job.hiringOrganization.name + '</a></p>';
    }
    else {
        return '<p class="job-info org-info">' + job.hiringOrganization.name + '</p>';
    }
}

/**
 * @return {string} HTML for job.salary
 */
function salaryFormatter(job) {
    if (!job.hasOwnProperty("salary"))
        return '';
    if (job.salary.currency == "UNSET" && job.salary.unit == "UNSET")
        return '';
    if (job.salary.minValue == 0 && job.salary.maxValue == 0)
        return '';

    var result;
    if (job.salary.minValue == job.salary.maxValue)
        result = kFormatter(job.salary.maxValue);
    else
        result = kFormatter(job.salary.minValue) + ' – ' + kFormatter(job.salary.maxValue);

    result =    '<p class="job-info">' +
                currencyFormatter(job.salary.currency) +
                result +
                ' /' +
                salaryUnitFormatter(job.salary.unit) +
                infoFormatter(job.salary.info) +
                '</p>'
    return result;
}

/**
 * @returns info (salary.info) formatted
 */
function infoFormatter(info) {
    if(info)
        return " | " + info;
    return info;
}

/**
 * @returns {string} salary.unit formatted: MONTH->Month, YEAR->Year etc
 */
function salaryUnitFormatter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * @returns {string} salary.currency formatted
 */
function currencyFormatter(curr){
    if(curr.length > 1)
        return curr + ' ';
    return curr;
}

/**
 * See https://stackoverflow.com/questions/9461621/how-to-format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900-in-javascrip
 *
 * @param num the number to format
 * @returns {string} the "num" in "k format"
 */
function kFormatter(num) {
    return num > 4999 ? (num/1000).toFixed(1).replace(/\.0$/, '') + 'k' : num
}

/**
 * @return {string} HTML for job.tagsNames1 and job.tagsNames2
 */
function tagsFormatter(job) {
    return '<div>' + tagsDeco(job.tagsNames1) + tagsDeco(job.tagsNames2) + '</div>';
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

/**
 * see https://stackoverflow.com/questions/795654/using-javascript-to-mark-a-link-as-visited
 * @param href {string} the URL to mark as "visited"
 */
function markHrefAsVisited(href){
    try{
        // store the current URL
        var current_url = window.location.href;
        // use replaceState to push a new entry into the browser's history
        history.replaceState({},"", href);
        // use replaceState again to reset the URL
        history.replaceState({},"",current_url);
    }
    catch (err) {
        console.log(err);
    }
}

function rowTitleClick(aNode) {
    markHrefAsVisited(aNode.href);

    // send click to PlusMinus Node
    var nodePlusMinus=aNode.parentNode.parentNode.parentNode.children[2].children[0];
    nodePlusMinus.click();
    return false;
}

function rowPlusMinusClick( eventObject) {
    // mark PlusMinus anchor as visited
    markHrefAsVisited(eventObject.currentTarget.href);

    if(eventObject.eventPhase === 2){
        // this event comes from rowTitleClick()
        // skip marking title as visited
        return;
    }
    // mark "title" anchor visited
    var titleNode = eventObject.currentTarget.parentNode.parentNode.children[0].children[0].children[0];
    markHrefAsVisited(titleNode.href);
}
