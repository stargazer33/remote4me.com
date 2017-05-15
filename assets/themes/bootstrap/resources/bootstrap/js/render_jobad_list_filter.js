/**
 * Shows loading indicator while table is loading.

 * if json_data has less than 50 elements, then load indicator are not used;
 */
function tableLoad() {
    if (json_data.length <= 50) {
        $table = $('#table').bootstrapTable('load', $.grep(json_data, grepFunc));
    } else {
        $(".loader").show();
        $("#table").hide();
        $table = $('#table').bootstrapTable('load', $.grep(json_data, grepFunc));
        $(".loader").hide();
        $("#table").show();
    }
}
/**
 * Main script, executes after page is ready.
 */
$(document).ready(function () {
    try {
        /**
         * Default filter for table.
         */
        var filterTag = ['REMOTE1_100'];
        $(".loader").hide();
        /**
         * Function that setups table. Look wenzhixin documentation for details.
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
            /**

             * Checks if object of Job has tags that is valid for filtering into table.
             * @param {item} item; an object of type Job;
             * @return {boolean} true if every tag to filter are met in tags of element;
             */
            grepFunc = function (item) {
                /**
                 * Checks if element is equal to filtered tags.
                 * @param {array} item.tags array with tags;
                 * @return {boolean};
                 */
                function hasTag(element) {
                    return element == filterTag;
                }
                return item.tags.some(hasTag);
            };
            /**
             * Loading table with filtered by default data.
             */
            tableLoad();
        });
        /**
         * If requested URL has a #hash part, then we click on element which id=hash.
         */
        var hash = window.location.hash.substr(1);
        if (!(hash == null)) {
            setTimeout(function () {
                document.getElementById(hash).click();
            }, 100);
        }
        /**
         * Click on row = click to open detailed view.
         */
        $("#table").on("click", "tr", function () {
            $(this).find(".detail-icon").trigger("click");
        });
    } catch (err) {
        console.log(err);
    }
});
/**
 * Formating data from json_data for detailed view of every row.
 * for every key:value dictionaries of row it decorates and pushes strings to html.
 * @param {int} index, index=data-index of tr, this param passes this information to formatter;
 * @param {item} row; an object of type Job;
 * @return {string} htmled detailed view of clicked row;
 */
function detailFormatter(index, row) {
    console.log(index);
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
 * Collumn formatter functions has 3 param arguments to pass.
 * @param arg1 {string} value; value of item.'collumn field' for this item;
 * @param arg2 {item} item; an object of type Job;
 * @param arg3 {integer} index; value of item.published for this row;
 */
/**
 * Formater for published column.
 * @param {string} value; value of item.published;
 * @return {string} decorated date of publishing, splited to only date and month;
 */
function publishedFormatter(value) {
    var publishedDay = value.split(",")[0];
    return '<p class="publishedDate">' + publishedDay + '</p>';
}
/**
 * Formatter for title column.
 * @param {string} value; value of item.title;
 * @param {item} row; an object of type Job;
 * @return {string} decorated labelTags;
 */
function titleFormatter(value, row) {
    var tagsNames1 = tagsDeco(row.tagsNames1);
    var tagsNames2 = tagsDeco(row.tagsNames2);
    var labelTags = tagsNames1 + tagsNames2;
    return '<a class="detail-icon" href="#"><i class="fa fa-plus-square-o iconStyle"></i></a> ' + row.title + '<br>' + labelTags;
}

/**
 * Decorate tags from given array into html string, set of labeled tags.
 * @param {array} tags; array with tags, ex: row.tagsNames1, row.tags;
 * @return {string} rtTags, a returned sum of decorated tags;
 */

function tagsDeco(tags) {
    var appendValue = "";
    var rtTags = "";
    for (i = 0; i < tags.length; i++) {
        appendValue = '<span class = "tag label label-primary labelTag">' + tags[i] + '</span>';
        rtTags = rtTags.concat(appendValue);
    }
    return rtTags;
}