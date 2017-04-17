//Function for removing items from array.

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

$(document).ready(function(){
    var filterTag = ['REMOTE1_100'];
    $(function () {
        var $table = $('#table').bootstrapTable({data: json_data, pageList:[25, 50, 100], pageSize:25, smartDisplay:1, detailFormatter: detailFormatter, detailView: 1, pagination:1, showHeader: 0
        });
        grepFunc = function (item) {
        function hasTag(element, index, array) {
            return element == filterTag;
        }
            return item.tags.some(hasTag);
        };       
        $table = $('#table').bootstrapTable('load', $.grep(json_data, grepFunc));
    });
    $("#table").on("click", "tr", function(e){
    $(this).find(".detail-icon").trigger("click");
    });
    $(".filter-checkbox").click(function () {
        var filterName = $(this).attr('data-filter');
        if (filterName==null){
            return;
        } else if(filterName=='all'){
            grepFunc = function (item) {
            function hasTag(element, index, array) {
              return element == 'REMOTE1_100';
            }
                return item.tags.some(hasTag);
            };
        }else{
            var check = $(this).prop('checked');
            if(check == true) {                                                      
                filterTag.push(filterName);
            }else{                                                                   
                filterTag.remove(filterName.indexOf(filterTag));
            }
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
        $table = $('#table').bootstrapTable('load', $.grep(json_data, grepFunc));
    });
});
function detailFormatter(index, row) {
    var html = [];
    var sourceName  = "";
    var PassUrl = "";
    html.push('<div class="detailContent">');
    $.each(row, function (key, value) {
        if (key == "title"){
            /*html.push('<h4>' + value + '</h4>');*/
        } else if (key == "url"){
            PassUrl = '<p><a href="' + value + '" class="underlineText"> View original job desription</a> at ' + sourceName + '</p>';
            html.push(PassUrl);
        } else if (key == "content"){
            html.push('<p>' + value + '</p><p>' + PassUrl + '</p></div><span class="detailFooter"></span>');
        } else if (key == "urlFetchPending" || key == "published" || key == "tags"){
            
        } else if (key == "sourceName"){
            sourceName = value;
        }else {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        }
    });
    return html.join('');
}
var PassTag="";
function publishedFormatter(value) {
    var publishedDay = value.split(",")[0];
    return '<p class="publishedDate">' + publishedDay + '</p>';
    }
function tagsFormatter(value) {
    var labelTags = "";
    for (i = 0; i < value.length; i++) {
        var appendValue = "";
        appendValue = '<span class = "tag label label-primary labelTag">' + value[i] + '</span>';
        labelTags = labelTags.concat(appendValue);
        }
        PassTag = labelTags;
        return labelTags;
    }
function titleFormatter(value) {
    return '<a class="underlineText">' + value + '</a><br>' + PassTag;
    }
