//Function for removing items from array.

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function tagsDeco(tags) {
    var appendValue = "";
    var rtTags = "";
    for (i = 0; i < tags.length; i++) {
        appendValue = '<span class = "tag label label-primary labelTag">' + tags[i] + '</span>';
        rtTags = rtTags.concat(appendValue);
    }
    return rtTags;
}

function tableLoad() {
    if (($.grep(json_data, grepFunc)).length <= 50) {
        $table = $('#table').bootstrapTable('load', $.grep(json_data, grepFunc));
    } else {
        $(".loader").show();
        $("#table").hide();
        $table = $('#table').bootstrapTable('load', $.grep(json_data, grepFunc));
        $(".loader").hide();
        $("#table").show();
    }
}

$(document).ready(function(){
    try {
//This filterTag enables show of only objects with tag REMOTE1_100 by default.
    var filterTag = ['REMOTE1_100'];
    $(".loader").hide();
// Function that setups table
    $(function () {
        var $table = $('#table').bootstrapTable({data: json_data,
         smartDisplay:1,
         detailFormatter: detailFormatter,
         detailView: 1,
         showHeader: 0,
//Setuping columns. Formatters are functions listed below. If all columns are set to be sortable, then "Published" column is dissapiring in resolutions sub to 992px.
         columns: [{
            title: "",
            field: "title",
            class: "spanLink",
            formatter:titleFormatter
//            sortable: true,
          }, {
            title: "",
            field: "published",
            class: "spanLink",
            formatter:publishedFormatter
//            sortable: true,
          }]
        });
//Here we use filterTag for default filter.
        grepFunc = function (item) {
        function hasTag(element, index, array) {
            return element == filterTag;
        }
            return item.tags.some(hasTag);
        };
//table reloads with new, filtered data. 
        tableLoad();
    });
//Hash is anchor reference in link, so it get part after # and by its id simulate click on <a> tag by this id, after a little timeout(because table need some time to set up).
   var hash = window.location.hash.substr(1);
    if (!(hash == null)){
        setTimeout(function(){
            document.getElementById(hash).click();
        }, 100);
    }
//CLick on row to activate detailed view. So this function says that when ever there is a lick on <tr> of table, it will found icon for detailed view and will click on it. This way whole row is "button" for detailed view.
    $("#table").on("click", "tr", function(e, row, $element){
        $(this).find(".detail-icon").trigger("click");
/*        if(!($(this).find('.anchorLink').attr('href') == undefined)){
            window.location.hash = $(this).find('.anchorLink').attr('href');

        }*/
//        window.location = $(this).find('.anchorLink').attr('href');
    });
//Checkbox functionality.
    $(".filter-checkbox").click(function () {
//It get "data-filter" attribute from clicked element
        var filterName = $(this).attr('data-filter');
//If its "null", its stops
        if (filterName == null){
            return;
//If its "Show jobs worldwide", than its defaulting the filtering to REMOTE1_100(later i will rewrite it to filtering groups, each window will generate is own part of filter query). So far its just a stub, as far there is no more tags to filter.
        } else if(filterName =='all'){
            grepFunc = function (item) {
            function hasTag(element, index, array) {
                return element == 'REMOTE1_100';
            }
                return item.tags.some(hasTag);
            };
//If it has different "data-filter" than null or default, and checkbox get a "checked" prop than its append this value to filtering query. If this value are already in query, that its get removed.       
            } else {
            var check = $(this).prop('checked');
            if(check == true) {                                                      
                filterTag.push(filterName);
            } else {                                                                   
                filterTag.remove(filterName.indexOf(filterTag));
            }
//This part will be rewriten latter, but so far its work. Its check if the element in json_data has all the tags that is in filtering query array(they all return true).
            grepFunc = function (item) {
            function hasTag(element, index, array) {
                if (filterTag.length == 2){
                    return element == filterTag[0],filterTag[1];
                }else if (filterTag.length == 1){
                    return element == filterTag[0];
                }else if (filterTag.length == 3){
                    return element == filterTag[0],filterTag[1],filterTag[2];
                }else if (filterTag.length == 4){
                    return element == filterTag[0],filterTag[1],filterTag[2],filterTag[3];
                }else if (filterTag.length == 5){
                    return element == filterTag[0],filterTag[1],filterTag[2],filterTag[3],filterTag[4];
                }
            }
                return item.tags.some(hasTag);
            };
        }
//table reloads with new, filtered data.
    tableLoad();
    });
} catch(err) {
console.log(err);
}
});

//Formatter for detailed view(Full view of entry row). 
function detailFormatter(index, row) {
    var html = [];
    var sourceName  = "";
    var passUrl = "";
    html.push('<span class="detailFooter"></span> <div class="detailContent">');
    $.each(row, function (key, value) {
        if (key == "title"){
            /*html.push('<h4>' + value + '</h4>');*/
        } else if (key == "url") {
            passUrl = '<div class="row"><div class="col-xs-6">'+ '<a href="' + value + '">View original job desription <i class="fa fa-external-link" aria-hidden="true"></i></a>' +' </div><div class="col-xs-6 text-right">'+'<a href="#' + row.id + '">Get shareable link <i class="fa fa-link" aria-hidden="true"></i></a>'+'</div> </div>';
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
//Formatter for published column. It take a value and split it by ','. ANd take only first part with number of day and month.
function publishedFormatter(value) {
    var publishedDay = value.split(",")[0];
    return '<p class="publishedDate">' + publishedDay + '</p>';
}
//Formatter for title column. So it is incapsulating title in <a> which is linked to anchor of itself and then it takes passTag variable that was prepared before by tagsFormatter.
function titleFormatter(data, row, value) {
    var tagsNames1 = tagsDeco(row.tagsNames1);
    var tagsNames2 = tagsDeco(row.tagsNames2);
    var labelTags = tagsNames1 + tagsNames2;
    return '<a class="detail-icon" href="#"><i class="fa fa-plus-square-o iconStyle"></i></a> ' + row.title + '<br>' + labelTags;
}