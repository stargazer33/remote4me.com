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

// used in initReportThisJob(), postReport(): JobId текущего модального окна
var currentJobId = null;
// used in initReportThisJob(), postReport(): tag текущего модального окна
var tagCurrent = null;
// used in initReportThisJob(), postReport(): title текущего модального окна
var titleCurrent = null;

/**
 * firebase-app.js MUST be loaded before other firebase components!
 */
var firebaseJS1 = [
    '/assets/firebasejs/5.0.2/firebase-app.js'
];

var firebaseJS2 = [
    '/assets/firebasejs/5.0.2/firebase-auth.js',
    '/assets/firebasejs/5.0.2/firebase-firestore.js',
    '/assets/firebaseui/2.5.1/firebaseui.js'
];

/**
 * alertType: alert-danger, alert-success, alert-info (blue), alert-warning (yellow)
 * alertMessage: text/HTML to display
 */
function showAlert(alertType, alertMessage){
    $('#alert-placeholder-id').html(
        '<div class="alert '+alertType+' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +alertMessage+'</div>'
    );
}

/**
 * http://api.jquery.com/jQuery.getScript/
 */
jQuery.cachedScript = function( url, options ) {
    // Allow user to set any option except for dataType, cache, and url
    options = $.extend( options || {}, {
        dataType: "script",
        cache: true,
        url: url
    });
    // Use $.ajax() since it is more flexible than $.getScript
    // Return the jqXHR object so we can chain callbacks
    return jQuery.ajax( options );
};

/**
 * https://stackoverflow.com/questions/11803215/how-to-include-multiple-js-files-using-jquery-getscript-method
 */
$.getMultiScripts = function(arr, path) {
    var _arr = $.map(arr, function(scr) {
        return $.cachedScript( (path||"") + scr );
    });

    _arr.push($.Deferred(function( deferred ){
        $( deferred.resolve );
    }));

    return $.when.apply($, _arr);
}



/**
 * runs when page load complete
 */
$(document).ready(function () {
//function init() {
    try {
        $(".loader").show();
        try {
            // Send a request to get the DATA json file
            $.getJSON('/assets/data/' + dataFileName + '.json', onLoadDataFile).error(
                function (jqXHR, textStatus, errorThrown) {
                    $("#loaderID").hide();
                    $("#alertCanNotLoadID").text(jqXHR.status + ' ' + errorThrown);
                    $("#alertCanNotLoadID").show();
                    return;
                }
            );
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
                    detailOpen:  'fa fa-2x fa-caret-right iconStyle',
                    detailClose: 'fa fa-2x fa-caret-down iconStyle'
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
                        class: "published",
                        formatter: crawledFormatter
                    }
                ]
            });
            $("#table").bootstrapTable('hideLoading');
            $("#table").hide();
            readCheckboxesState();
        });

        initJobSearchFilters();
        initEmailSubscription();
        $('[data-toggle="popover"]').popover();

    } catch (err) {
        console.log(err);
    }
});


function onLoadDataFile(data){
    console.log('onLoadDataFile...');
    // Send a request to get the INDEX json file
    try{
        $.getJSON('/assets/lunar-index/'+dataFileName+'.json', onLoadLunarIndex);
    } catch (err) {
        console.log(err);
    }

    json_data = data.items;
    // duplicate json_data to json_data_original: we restore it later
    json_data_original=json_data.slice();

    // json_data initialized -> initialize mapIdToJob
    initMapIDToJob();
    // dynamically build structured data in <header>
    // initStructuredDataInHeaderToMakeGoogleHappy()

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

    //load fonts
    $('<link rel="stylesheet" type="text/css" href="/assets/themes/restart/css/font-opensans.woff2.css">').appendTo(document.head);

    // gtag.js and other analytic stuff
    try{
        console.log( "gtag/js..." );
        $.cachedScript("https://www.googletagmanager.com/gtag/js?id=UA-117928562-1").done(function( script, textStatus )
        {
            console.log( "gtag/js: "+textStatus );
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-117928562-1');
            console.log( "gtag/js done" );
        });
    } catch (err) {
        console.log(err);
    }

    //load all firebase *.js files
    console.log('initializing firebase1...');
    $.getMultiScripts(firebaseJS1).done(function() {
        console.log('initializing firebase2...');
        $.getMultiScripts(firebaseJS2).done(function() {
            $('head').append('<link type="text/css" rel="stylesheet" href="/assets/firebaseui/2.5.1/firebaseui.css"/>');
            initFirebase();
            initReportThisJob();
            console.log('initializing firebase2 done');
        });
        console.log('initializing firebase1 done');
    }).fail(function(error) {
        // one or more scripts failed to load
        console.log("Error in getMultiScripts: ", JSON.stringify(error));
        showAlert('alert-warning', 'Warning: the \'Report this job functionality\' disabled');
    });
    console.log('onLoadDataFile done');
}

function initJobSearchFilters() {
    // Stop dropdown menu from closing (keep it open) when clicked on one of its elements
    $("div.dropdown-menu").click(function(event){
        event.stopPropagation();
    });
    $("#jobSearchForm").submit(handleJobSearchFormSubmit);
    $(".filter-checkbox").click(handleClickOnFilterCheckbox);
}

function initReportThisJob() {
    $('#reportthisjob-modal').on('show.bs.modal', function (event) { // callback функция, вызывается при показе модального окна
        var button = $(event.relatedTarget);
        currentJobId = button.data('postid');
        tagCurrent = button.data('tagcurrent');
        titleCurrent = button.data('title');
    });
}

function initFirebase() {
    var config = {
        apiKey: "AIzaSyDWCBNGKq5wX4t7TNosOLVViWTvGzHKWvw",
        authDomain: "metajob-org.firebaseapp.com",
        databaseURL: "https://metajob-org.firebaseio.com",
        projectId: "metajob-org",
        storageBucket: "metajob-org.appspot.com",
        messagingSenderId: "652084187155"
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $('#firebaseui-auth-container-wrapper').hide();
            $('#reportthisjob-modal-body').show();
            loadReportedJobsFromDbAndFlagThem(user.email);
        } else {
            $('#reportthisjob-modal-body').hide();
            $('#firebaseui-auth-container-wrapper').show();
        }
    });
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', {
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID
        ],
        signInFlow: 'popup',
        // Other config options...
    });
}

function initEmailSubscription() {
    $("#form-subscribe-weekly-modal-id").submit(function(e) {
        handleEmailSubscriptionFormSubmit(
            e,
            "#form-subscribe-weekly-modal-id",
            '#week-input-email-id',
            '#week-maillist-name-id',
            '#subscribe-weekly-modal-id'
        );
    });

    $("#form-subscribe-daily-modal-id").submit(function(e) {
        handleEmailSubscriptionFormSubmit(
            e,
            '#form-subscribe-daily-modal-id',
            '#day-input-email-id',
            '#day-maillist-name-id',
            '#subscribe-daily-modal-id'
        );
    });
}

/**
 * функция отправки репорта в фаербейз, вызывается по нажатию кнопки "Send"
 * @param type - значение выбранного чекбокса (REMOTE1/not | REMOTE1/50)
 * @return undefined
 */
function postReport(type) {
    var user = firebase.auth().currentUser;
    if (user) {
        var reportObj = {
            jobId: currentJobId,
            tagCurrent: tagCurrent,
            tagShould: type,
            userEmail: user.email
        };

        var db = firebase.firestore();

        // Disable deprecated features
        db.settings({
            timestampsInSnapshots: true
        });

        db.collection("job-remote-error").add(reportObj)
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                $('#' + currentJobId).css('text-decoration','line-through');
                //$('#' + currentJobId + ' .abuse-btn').hide();
                $('#reportthisjob-modal-success-title').html(titleCurrent);
                $('#reportthisjob-modal-success-tag').html(reportObj.tagShould);
                $('#reportthisjob-modal-success').modal("show");
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });

        $('#reportthisjob-modal').modal("hide");
    } else {
        console.log('noauth');
    }
}

function loadReportedJobsFromDbAndFlagThem(email) {
    console.log("loadReportedJobsFromDbAndFlagThem...");
    var db = firebase.firestore();
    var settings = {timestampsInSnapshots: true};
    db.settings(settings);
    db.collection("job-remote-error").where("userEmail", "==", email)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                //console.log('render_jobad_list_filter  Line 164 doc.data().jobId: ', doc.data().jobId);

                $('#' + doc.data().jobId).css('text-decoration','line-through');
                //$('#' + doc.data().jobId + ' .abuse-btn').hide();
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    console.log("loadReportedJobsFromDbAndFlagThem done");
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
 * @param job
 * @returns structured data "JobPosting" object for "job". See
 * https://developers.google.com/search/docs/data-types/job-posting
 */
function createStructuredMarkupForJob(job) {

    var org = {
        name: "UNSET"
    };
    if ( job.hiringOrganization.name !== "UNSET" ) {
        org.name = job.hiringOrganization.name;
    }
    if (job.hiringOrganization.sameAs !== "UNSET") {
        org.sameAs = job.hiringOrganization.sameAs;
    }
    var skills = job.tagsNames2.join(", ");

    var result = {
        "@context": "http://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.content,
        "skills": skills,
        "datePosted": job.crawled,
        "validThrough": job.validThrough,
        "url": window.location.href + "#" + job.id,
        "identifier": {
            "@type": "PropertyValue",
            "name": "remote4meJobID",
            "value": job.id
        },
        "employmentType": "FULL_TIME",
        "workHours": "Flexible",
        "jobLocationType": "TELECOMMUTE",
        "jobLocation": {
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "Anywhere"
            }
        }
    };

    if(org.name !== "UNSET"){
        result.hiringOrganization=org;
    }
    if(job.salary.currency !== "UNSET"){
        result.baseSalary = {
            "@type": "MonetaryAmount",
            "currency": job.salary.currency,
            "value": {
                "@type": "QuantitativeValue",
                "minValue": job.salary.minValue,
                "maxValue": job.salary.maxValue,
                "unitText": job.salary.unit
            }
        };
        if(job.salary.isEquity === true){
            result.baseSalary.value.additionalProperty = {
                "@type": "PropertyValue",
                "name": "Additional compensation",
                "value": "+Equity"
            }
        }
        else if (job.salary.info) {
            result.baseSalary.value.additionalProperty = {
                "@type": "PropertyValue",
                "name": "Additional compensation",
                "value": job.salary.info
            }
        }
    }

    return result;
}

/**
 *
 * @param job type: Job
 * @param dateDaysAgo type: Date
 * @returns {boolean} - "true" if Job can be added to structured data section
 */
function isJobOkForStructuredData(job, dateDaysAgo){
    if(!job.content){
        return false;
    }
    if(job.hiringOrganization.name === "UNSET"){
        return false;
    }
    if(dateDaysAgo > new Date(job.crawled) ){
        return false;
    }
    if(dateDaysAgo > new Date(job.published) ){
        return false;
    }
    return true;
}


/**
 * Attaches <script type="application/ld+json"> to the <head>
 * inside the script: array of "@type": "JobPosting"
 * for 1 element of json_data: 1 element in the created array
 */
function initStructuredDataInHeaderToMakeGoogleHappy() {
    var scriptElement = document.createElement('script');
    scriptElement.type = 'application/ld+json';

    var arr = [];
    var markup;
    var daysAgo=7;
    var dateDaysAgo=new Date();
    dateDaysAgo.setDate(dateDaysAgo.getDate()-daysAgo);

    // Loop through json_data,
    $.each(json_data, function (index, job) {
        if( isJobOkForStructuredData(job, dateDaysAgo) === true ){
            markup = createStructuredMarkupForJob(job);
            arr.push(markup);
        }
    }
    );

    scriptElement.text += JSON.stringify(arr);
    document.querySelector('head').appendChild(scriptElement);
}

/**
 * Initialization of global variables:
 *   lunarIndex
 *   mapIdToJob
 *
 * @param data pre-built Lunar index in JSON format
 */
function onLoadLunarIndex(data){
    console.log('onLoadLunarIndex...');
    lunarIndex=lunr.Index.load(data);

    isLunarIndexLoaded=true;
    enableSearchControls();
    console.log('onLoadLunarIndex done');
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
    //console.log('lunarSearchResults: '+lunarSearchResults);


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
    try{
        var hash = window.location.hash.substr(1);
        if ( hash ) {
            document.getElementById(hash).scrollIntoView();
            document.getElementById(hash).click();
        }
    } catch (err) {
        console.log("error in handleAnchorLink(): "+JSON.stringify(err));
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
    var tagCurrent = null;
    for(var i = 0; i < jobAd.tags.length; i++) {
        if(~jobAd.tags[i].indexOf('REMOTE1')) {
            tagCurrent = jobAd.tags[i];
        }
    }
    var context = {content: jobAd.content, url: jobAd.url, id: jobAd.id, tagCurrent: tagCurrent, title: jobAd.title};
    return Handlebars.templates.jobdetails(context);
}


/**
 * Форматер столбцов может передавать до трех типов аргументов.
 * @param arg1 {string} value; значение item.'collumn field':value для этой записи;
 * @param arg2 {item} item; обьект типа Job из json_data относящийся к этой записи;
 * @param arg3 {integer} index; значение по index:value из данной записи;
 */

/**
 * Formatter for "crawled" column
 * @param {string} the Job.published;
 * @return {string} the Job.published as string in format "dd mmm";
 */
function crawledFormatter(pDate) {
    var publishedTmp = pDate.split(",")[0];
    return '<p class="publishedDate">' + publishedTmp + '</p>';
}

/**
 * Formatter for "title" column.
 * @param {string} value; unused
 * @param {item} job; Job; see json_data;
 */
function titleFormatter(value, job) {
    var tags = tagsFormatter(job);
    var organization = organizationFormatter(job);
    var salary = salaryFormatter(job);

    var context = {job: job};
    var title = Handlebars.templates.jobtitle(context);
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
        return '<p class="job-info org-info"><a rel="nofollow noopener" target="_blank" href="' + job.hiringOrganization.sameAs + '">' + job.hiringOrganization.name + '</a></p>';
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
    var nodePlusMinus=aNode.parentNode.parentNode.parentNode.children[0].children[0];
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
    var titleNode = eventObject.currentTarget.parentNode.parentNode.children[1].children[0].children[0];
    markHrefAsVisited(titleNode.href);
}

function footerPlusMinusClick( eventObject) {
    eventObject.preventDefault();

    var myHref=eventObject.currentTarget.getAttribute("data-postid");
    var rowId='#'+myHref+'.rowTitleClass';

    $(rowId).trigger('click');
}

/**** email subscription ****/

/**
 * Send the "new subscriber added" to mailerlite.com, report result using showAlert()
 *
 * @param e - Event
 * @param formID - ID of the form
 * @param emailID - ID of "email" form input
 * @param mailistNameID - ID of element with mail list name
 * @param modalID - ID of modal dialog
 */
function handleEmailSubscriptionFormSubmit(e, formID, emailID, mailistNameID, modalID){
    // see https://stackoverflow.com/questions/1960240/jquery-ajax-submit-form/6960586#6960586
    e.preventDefault(); // avoid to execute the actual submit of the form.
    var form = $(formID);
    var messageOK="<strong>"+ $(emailID).val() +"</strong> subscribed to <strong>"+$(mailistNameID).text()+"</strong>. Please check your inbox and confirm your email.";
    var messageErr="Subscription error! Technical details: ";

    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize(), // serializes the form's elements.
        success: function (data) {
            if(data.success == false){
                showAlert('alert-danger', messageErr+JSON.stringify(data));
            }
            else {
                showAlert('alert-success', messageOK)
            }
        },
        error: function (data) {
            showAlert('alert-danger', messageErr+JSON.stringify(data));
        },
    });
    $(modalID).modal("hide");
}

/**
 * Handlebars.templates.jobdetails
 * See "detailFormatter"
 *
 * This thing is generated by bin/compile-handl.sh
 */
