!function($){"use strict";var cachedWidth=null,sprintf=function(str){var args=arguments,flag=!0,i=1;return str=str.replace(/%s/g,function(){var arg=args[i++];return void 0===arg?(flag=!1,""):arg}),flag?str:""},getFieldIndex=function(columns,field){var index=-1;return $.each(columns,function(i,column){return column.field!==field||(index=i,!1)}),index},getScrollBarWidth=function(){if(null===cachedWidth){var w1,w2,inner=$("<p/>").addClass("fixed-table-scroll-inner"),outer=$("<div/>").addClass("fixed-table-scroll-outer");outer.append(inner),$("body").append(outer),w1=inner[0].offsetWidth,outer.css("overflow","scroll"),w1===(w2=inner[0].offsetWidth)&&(w2=outer[0].clientWidth),outer.remove(),cachedWidth=w1-w2}return cachedWidth},calculateObjectValue=function(self,name,args,defaultValue){var func=name;if("string"==typeof name){var names=name.split(".");1<names.length?(func=window,$.each(names,function(i,f){func=func[f]})):func=window[name]}return"object"==typeof func?func:"function"==typeof func?func.apply(self,args||[]):!func&&"string"==typeof name&&sprintf.apply(this,[name].concat(args))?sprintf.apply(this,[name].concat(args)):defaultValue},compareObjects=function(objectA,objectB,compareLength){var objectAProperties=Object.getOwnPropertyNames(objectA),objectBProperties=Object.getOwnPropertyNames(objectB),propName="";if(compareLength&&objectAProperties.length!==objectBProperties.length)return!1;for(var i=0;i<objectAProperties.length;i++)if(propName=objectAProperties[i],-1<$.inArray(propName,objectBProperties)&&objectA[propName]!==objectB[propName])return!1;return!0},escapeHTML=function(text){return"string"==typeof text?text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;").replace(/`/g,"&#x60;"):text},getRealDataAttr=function(dataAttr){for(var attr in dataAttr){var auxAttr=attr.split(/(?=[A-Z])/).join("-").toLowerCase();auxAttr!==attr&&(dataAttr[auxAttr]=dataAttr[attr],delete dataAttr[attr])}return dataAttr},getItemField=function(item,field,escape){var value=item;if("string"!=typeof field||item.hasOwnProperty(field))return escape?escapeHTML(item[field]):item[field];var props=field.split(".");for(var p in props)props.hasOwnProperty(p)&&(value=value&&value[props[p]]);return escape?escapeHTML(value):value},isIEBrowser=function(){return!!(0<navigator.userAgent.indexOf("MSIE ")||navigator.userAgent.match(/Trident.*rv\:11\./))},BootstrapTable=function(el,options){this.options=options,this.$el=$(el),this.$el_=this.$el.clone(),this.timeoutId_=0,this.timeoutFooter_=0,this.init()};BootstrapTable.DEFAULTS={classes:"table table-hover",sortClass:void 0,locale:void 0,height:void 0,undefinedText:"-",sortName:void 0,sortOrder:"asc",sortStable:!1,striped:!1,columns:[[]],data:[],totalField:"total",dataField:"rows",method:"get",url:void 0,ajax:void 0,cache:!0,contentType:"application/json",dataType:"json",ajaxOptions:{},queryParams:function(params){return params},queryParamsType:"limit",responseHandler:function(res){return res},pagination:!1,onlyInfoPagination:!1,paginationLoop:!0,sidePagination:"client",totalRows:0,pageNumber:1,pageSize:10,pageList:[10,25,50,100],paginationHAlign:"right",paginationVAlign:"bottom",paginationDetailHAlign:"left",paginationPreText:"&lsaquo;",paginationNextText:"&rsaquo;",search:!1,searchOnEnterKey:!1,strictSearch:!1,searchAlign:"right",selectItemName:"btSelectItem",showHeader:!0,showFooter:!1,showColumns:!1,showPaginationSwitch:!1,showRefresh:!1,showToggle:!1,buttonsAlign:"right",smartDisplay:!0,escape:!1,minimumCountColumns:1,idField:void 0,uniqueId:void 0,cardView:!1,detailView:!1,detailFormatter:function(index,row){return""},trimOnSearch:!0,clickToSelect:!1,singleSelect:!1,toolbar:void 0,toolbarAlign:"left",checkboxHeader:!0,sortable:!0,silentSort:!0,maintainSelected:!1,searchTimeOut:500,searchText:"",iconSize:void 0,buttonsClass:"default",iconsPrefix:"",icons:{paginationSwitchDown:"glyphicon-collapse-down icon-chevron-down",paginationSwitchUp:"glyphicon-collapse-up icon-chevron-up",refresh:"glyphicon-refresh icon-refresh",toggle:"glyphicon-list-alt icon-list-alt",columns:"glyphicon-th icon-th",detailOpen:"glyphicon-plus icon-plus",detailClose:"glyphicon-minus icon-minus"},customSearch:$.noop,customSort:$.noop,rowStyle:function(row,index){return{}},rowAttributes:function(row,index){return{}},footerStyle:function(row,index){return{}},onAll:function(name,args){return!1},onClickCell:function(field,value,row,$element){return!1},onDblClickCell:function(field,value,row,$element){return!1},onClickRow:function(item,$element){return!1},onDblClickRow:function(item,$element){return!1},onSort:function(name,order){return!1},onCheck:function(row){return!1},onUncheck:function(row){return!1},onCheckAll:function(rows){return!1},onUncheckAll:function(rows){return!1},onCheckSome:function(rows){return!1},onUncheckSome:function(rows){return!1},onLoadSuccess:function(data){return!1},onLoadError:function(status){return!1},onColumnSwitch:function(field,checked){return!1},onPageChange:function(number,size){return!1},onSearch:function(text){return!1},onToggle:function(cardView){return!1},onPreBody:function(data){return!1},onPostBody:function(){return!1},onPostHeader:function(){return!1},onExpandRow:function(index,row,$detail){return!1},onCollapseRow:function(index,row){return!1},onRefreshOptions:function(options){return!1},onRefresh:function(params){return!1},onResetView:function(){return!1}},(BootstrapTable.LOCALES={})["en-US"]=BootstrapTable.LOCALES.en={formatLoadingMessage:function(){return"Loading, please wait..."},formatRecordsPerPage:function(pageNumber){return sprintf("%s rows per page",pageNumber)},formatShowingRows:function(pageFrom,pageTo,totalRows){return sprintf("Showing %s to %s of %s rows",pageFrom,pageTo,totalRows)},formatDetailPagination:function(totalRows){return sprintf("Showing %s rows",totalRows)},formatSearch:function(){return"Search"},formatNoMatches:function(){return"No matching records found"},formatPaginationSwitch:function(){return"Hide/Show pagination"},formatRefresh:function(){return"Refresh"},formatToggle:function(){return"Toggle"},formatColumns:function(){return"Columns"},formatAllRows:function(){return"All"}},$.extend(BootstrapTable.DEFAULTS,BootstrapTable.LOCALES["en-US"]),BootstrapTable.COLUMN_DEFAULTS={radio:!1,checkbox:!1,checkboxEnabled:!0,field:void 0,title:void 0,titleTooltip:void 0,class:void 0,align:void 0,halign:void 0,falign:void 0,valign:void 0,width:void 0,sortable:!1,order:"asc",visible:!0,switchable:!0,clickToSelect:!0,formatter:void 0,footerFormatter:void 0,events:void 0,sorter:void 0,sortName:void 0,cellStyle:void 0,searchable:!0,searchFormatter:!0,cardVisible:!0,escape:!1},BootstrapTable.EVENTS={"all.bs.table":"onAll","click-cell.bs.table":"onClickCell","dbl-click-cell.bs.table":"onDblClickCell","click-row.bs.table":"onClickRow","dbl-click-row.bs.table":"onDblClickRow","sort.bs.table":"onSort","check.bs.table":"onCheck","uncheck.bs.table":"onUncheck","check-all.bs.table":"onCheckAll","uncheck-all.bs.table":"onUncheckAll","check-some.bs.table":"onCheckSome","uncheck-some.bs.table":"onUncheckSome","load-success.bs.table":"onLoadSuccess","load-error.bs.table":"onLoadError","column-switch.bs.table":"onColumnSwitch","page-change.bs.table":"onPageChange","search.bs.table":"onSearch","toggle.bs.table":"onToggle","pre-body.bs.table":"onPreBody","post-body.bs.table":"onPostBody","post-header.bs.table":"onPostHeader","expand-row.bs.table":"onExpandRow","collapse-row.bs.table":"onCollapseRow","refresh-options.bs.table":"onRefreshOptions","reset-view.bs.table":"onResetView","refresh.bs.table":"onRefresh"},BootstrapTable.prototype.init=function(){this.initLocale(),this.initContainer(),this.initTable(),this.initHeader(),this.initData(),this.initHiddenRows(),this.initFooter(),this.initToolbar(),this.initPagination(),this.initBody(),this.initSearchText(),this.initServer()},BootstrapTable.prototype.initLocale=function(){if(this.options.locale){var parts=this.options.locale.split(/-|_/);parts[0].toLowerCase(),parts[1]&&parts[1].toUpperCase(),$.fn.bootstrapTable.locales[this.options.locale]?$.extend(this.options,$.fn.bootstrapTable.locales[this.options.locale]):$.fn.bootstrapTable.locales[parts.join("-")]?$.extend(this.options,$.fn.bootstrapTable.locales[parts.join("-")]):$.fn.bootstrapTable.locales[parts[0]]&&$.extend(this.options,$.fn.bootstrapTable.locales[parts[0]])}},BootstrapTable.prototype.initContainer=function(){this.$container=$(['<div class="bootstrap-table">','<div class="fixed-table-toolbar"></div>',"top"===this.options.paginationVAlign||"both"===this.options.paginationVAlign?'<div class="fixed-table-pagination" style="clear: both;"></div>':"",'<div class="fixed-table-container">','<div class="fixed-table-header"><table></table></div>','<div class="fixed-table-body">','<div class="fixed-table-loading">',this.options.formatLoadingMessage(),"</div>","</div>",'<div class="fixed-table-footer"><table><tr></tr></table></div>',"bottom"===this.options.paginationVAlign||"both"===this.options.paginationVAlign?'<div class="fixed-table-pagination"></div>':"","</div>","</div>"].join("")),this.$container.insertAfter(this.$el),this.$tableContainer=this.$container.find(".fixed-table-container"),this.$tableHeader=this.$container.find(".fixed-table-header"),this.$tableBody=this.$container.find(".fixed-table-body"),this.$tableLoading=this.$container.find(".fixed-table-loading"),this.$tableFooter=this.$container.find(".fixed-table-footer"),this.$toolbar=this.$container.find(".fixed-table-toolbar"),this.$pagination=this.$container.find(".fixed-table-pagination"),this.$tableBody.append(this.$el),this.$container.after('<div class="clearfix"></div>'),this.$el.addClass(this.options.classes),this.options.striped&&this.$el.addClass("table-striped"),-1!==$.inArray("table-no-bordered",this.options.classes.split(" "))&&this.$tableContainer.addClass("table-no-bordered")},BootstrapTable.prototype.initTable=function(){var that=this,columns=[],data=[];if(this.$header=this.$el.find(">thead"),this.$header.length||(this.$header=$("<thead></thead>").appendTo(this.$el)),this.$header.find("tr").each(function(){var column=[];$(this).find("th").each(function(){void 0!==$(this).data("field")&&$(this).data("field",$(this).data("field")+""),column.push($.extend({},{title:$(this).html(),class:$(this).attr("class"),titleTooltip:$(this).attr("title"),rowspan:$(this).attr("rowspan")?+$(this).attr("rowspan"):void 0,colspan:$(this).attr("colspan")?+$(this).attr("colspan"):void 0},$(this).data()))}),columns.push(column)}),$.isArray(this.options.columns[0])||(this.options.columns=[this.options.columns]),this.options.columns=$.extend(!0,[],columns,this.options.columns),this.columns=[],function(columns){var i,j,k,totalCol=0,flag=[];for(i=0;i<columns[0].length;i++)totalCol+=columns[0][i].colspan||1;for(i=0;i<columns.length;i++)for(flag[i]=[],j=0;j<totalCol;j++)flag[i][j]=!1;for(i=0;i<columns.length;i++)for(j=0;j<columns[i].length;j++){var r=columns[i][j],rowspan=r.rowspan||1,colspan=r.colspan||1,index=$.inArray(!1,flag[i]);for(1===colspan&&(r.fieldIndex=index,void 0===r.field&&(r.field=index)),k=0;k<rowspan;k++)flag[i+k][index]=!0;for(k=0;k<colspan;k++)flag[i][index+k]=!0}}(this.options.columns),$.each(this.options.columns,function(i,columns){$.each(columns,function(j,column){void 0!==(column=$.extend({},BootstrapTable.COLUMN_DEFAULTS,column)).fieldIndex&&(that.columns[column.fieldIndex]=column),that.options.columns[i][j]=column})}),!this.options.data.length){var m=[];this.$el.find(">tbody>tr").each(function(y){var row={};row._id=$(this).attr("id"),row._class=$(this).attr("class"),row._data=getRealDataAttr($(this).data()),$(this).find(">td").each(function(x){for(var tx,ty,$this=$(this),cspan=+$this.attr("colspan")||1,rspan=+$this.attr("rowspan")||1;m[y]&&m[y][x];x++);for(tx=x;tx<x+cspan;tx++)for(ty=y;ty<y+rspan;ty++)m[ty]||(m[ty]=[]),m[ty][tx]=!0;var field=that.columns[x].field;row[field]=$(this).html(),row["_"+field+"_id"]=$(this).attr("id"),row["_"+field+"_class"]=$(this).attr("class"),row["_"+field+"_rowspan"]=$(this).attr("rowspan"),row["_"+field+"_colspan"]=$(this).attr("colspan"),row["_"+field+"_title"]=$(this).attr("title"),row["_"+field+"_data"]=getRealDataAttr($(this).data())}),data.push(row)}),(this.options.data=data).length&&(this.fromHtml=!0)}},BootstrapTable.prototype.initHeader=function(){var that=this,visibleColumns={},html=[];this.header={fields:[],styles:[],classes:[],formatters:[],events:[],sorters:[],sortNames:[],cellStyles:[],searchables:[]},$.each(this.options.columns,function(i,columns){html.push("<tr>"),0===i&&!that.options.cardView&&that.options.detailView&&html.push(sprintf('<th class="detail" rowspan="%s"><div class="fht-cell"></div></th>',that.options.columns.length)),$.each(columns,function(j,column){var halign,align,text="",style="",class_=sprintf(' class="%s"',column.class),unitWidth=(that.options.sortOrder||column.order,"px"),width=column.width;if(void 0===column.width||that.options.cardView||"string"==typeof column.width&&-1!==column.width.indexOf("%")&&(unitWidth="%"),column.width&&"string"==typeof column.width&&(width=column.width.replace("%","").replace("px","")),halign=sprintf("text-align: %s; ",column.halign?column.halign:column.align),align=sprintf("text-align: %s; ",column.align),style=sprintf("vertical-align: %s; ",column.valign),style+=sprintf("width: %s; ",!column.checkbox&&!column.radio||width?width?width+unitWidth:void 0:"36px"),void 0!==column.fieldIndex){if(that.header.fields[column.fieldIndex]=column.field,that.header.styles[column.fieldIndex]=align+style,that.header.classes[column.fieldIndex]=class_,that.header.formatters[column.fieldIndex]=column.formatter,that.header.events[column.fieldIndex]=column.events,that.header.sorters[column.fieldIndex]=column.sorter,that.header.sortNames[column.fieldIndex]=column.sortName,that.header.cellStyles[column.fieldIndex]=column.cellStyle,that.header.searchables[column.fieldIndex]=column.searchable,!column.visible)return;if(that.options.cardView&&!column.cardVisible)return;visibleColumns[column.field]=column}html.push("<th"+sprintf(' title="%s"',column.titleTooltip),column.checkbox||column.radio?sprintf(' class="bs-checkbox %s"',column.class||""):class_,sprintf(' style="%s"',halign+style),sprintf(' rowspan="%s"',column.rowspan),sprintf(' colspan="%s"',column.colspan),sprintf(' data-field="%s"',column.field),">"),html.push(sprintf('<div class="th-inner %s">',that.options.sortable&&column.sortable?"sortable both":"")),text=that.options.escape?escapeHTML(column.title):column.title,column.checkbox&&(!that.options.singleSelect&&that.options.checkboxHeader&&(text='<input name="btSelectAll" type="checkbox" />'),that.header.stateField=column.field),column.radio&&(text="",that.header.stateField=column.field,that.options.singleSelect=!0),html.push(text),html.push("</div>"),html.push('<div class="fht-cell"></div>'),html.push("</div>"),html.push("</th>")}),html.push("</tr>")}),this.$header.html(html.join("")),this.$header.find("th[data-field]").each(function(i){$(this).data(visibleColumns[$(this).data("field")])}),this.$container.off("click",".th-inner").on("click",".th-inner",function(event){var target=$(this);if(that.options.detailView&&target.closest(".bootstrap-table")[0]!==that.$container[0])return!1;that.options.sortable&&target.parent().data().sortable&&that.onSort(event)}),this.$header.children().children().off("keypress").on("keypress",function(event){that.options.sortable&&$(this).data().sortable&&(13==(event.keyCode||event.which)&&that.onSort(event))}),$(window).off("resize.bootstrap-table"),!this.options.showHeader||this.options.cardView?(this.$header.hide(),this.$tableHeader.hide(),this.$tableLoading.css("top",0)):(this.$header.show(),this.$tableHeader.show(),this.$tableLoading.css("top",this.$header.outerHeight()+1),this.getCaret(),$(window).on("resize.bootstrap-table",$.proxy(this.resetWidth,this))),this.$selectAll=this.$header.find('[name="btSelectAll"]'),this.$selectAll.off("click").on("click",function(){var checked=$(this).prop("checked");that[checked?"checkAll":"uncheckAll"](),that.updateSelected()})},BootstrapTable.prototype.initFooter=function(){!this.options.showFooter||this.options.cardView?this.$tableFooter.hide():this.$tableFooter.show()},BootstrapTable.prototype.initData=function(data,type){this.data="append"===type?this.data.concat(data):"prepend"===type?[].concat(data).concat(this.data):data||this.options.data,this.options.data="append"===type?this.options.data.concat(data):"prepend"===type?[].concat(data).concat(this.options.data):this.data,"server"!==this.options.sidePagination&&this.initSort()},BootstrapTable.prototype.initSort=function(){var that=this,name=this.options.sortName,order="desc"===this.options.sortOrder?-1:1,index=$.inArray(this.options.sortName,this.header.fields),timeoutId=0;this.options.customSort===$.noop?-1!==index&&(this.options.sortStable&&$.each(this.data,function(i,row){row.hasOwnProperty("_position")||(row._position=i)}),this.data.sort(function(a,b){that.header.sortNames[index]&&(name=that.header.sortNames[index]);var aa=getItemField(a,name,that.options.escape),bb=getItemField(b,name,that.options.escape),value=calculateObjectValue(that.header,that.header.sorters[index],[aa,bb]);return void 0!==value?order*value:(null==aa&&(aa=""),null==bb&&(bb=""),that.options.sortStable&&aa===bb&&(aa=a._position,bb=b._position),$.isNumeric(aa)&&$.isNumeric(bb)?(aa=parseFloat(aa))<(bb=parseFloat(bb))?-1*order:order:aa===bb?0:("string"!=typeof aa&&(aa=aa.toString()),-1===aa.localeCompare(bb)?-1*order:order))}),void 0!==this.options.sortClass&&(clearTimeout(timeoutId),timeoutId=setTimeout(function(){that.$el.removeClass(that.options.sortClass);var index=that.$header.find(sprintf('[data-field="%s"]',that.options.sortName).index()+1);that.$el.find(sprintf("tr td:nth-child(%s)",index)).addClass(that.options.sortClass)},250))):this.options.customSort.apply(this,[this.options.sortName,this.options.sortOrder])},BootstrapTable.prototype.onSort=function(event){var $this="keypress"===event.type?$(event.currentTarget):$(event.currentTarget).parent(),$this_=this.$header.find("th").eq($this.index());this.$header.add(this.$header_).find("span.order").remove(),this.options.sortName===$this.data("field")?this.options.sortOrder="asc"===this.options.sortOrder?"desc":"asc":(this.options.sortName=$this.data("field"),this.options.sortOrder="asc"===$this.data("order")?"desc":"asc"),this.trigger("sort",this.options.sortName,this.options.sortOrder),$this.add($this_).data("order",this.options.sortOrder),this.getCaret(),"server"!==this.options.sidePagination?(this.initSort(),this.initBody()):this.initServer(this.options.silentSort)},BootstrapTable.prototype.initToolbar=function(){var $keepOpen,$search,that=this,html=[],timeoutId=0,switchableCount=0;this.$toolbar.find(".bs-bars").children().length&&$("body").append($(this.options.toolbar)),this.$toolbar.html(""),"string"!=typeof this.options.toolbar&&"object"!=typeof this.options.toolbar||$(sprintf('<div class="bs-bars pull-%s"></div>',this.options.toolbarAlign)).appendTo(this.$toolbar).append($(this.options.toolbar)),html=[sprintf('<div class="columns columns-%s btn-group pull-%s">',this.options.buttonsAlign,this.options.buttonsAlign)],"string"==typeof this.options.icons&&(this.options.icons=calculateObjectValue(null,this.options.icons)),this.options.showPaginationSwitch&&html.push(sprintf('<button class="btn'+sprintf(" btn-%s",this.options.buttonsClass)+sprintf(" btn-%s",this.options.iconSize)+'" type="button" name="paginationSwitch" aria-label="pagination Switch" title="%s">',this.options.formatPaginationSwitch()),sprintf('<i class="%s %s"></i>',this.options.iconsPrefix,this.options.icons.paginationSwitchDown),"</button>"),this.options.showRefresh&&html.push(sprintf('<button class="btn'+sprintf(" btn-%s",this.options.buttonsClass)+sprintf(" btn-%s",this.options.iconSize)+'" type="button" name="refresh" aria-label="refresh" title="%s">',this.options.formatRefresh()),sprintf('<i class="%s %s"></i>',this.options.iconsPrefix,this.options.icons.refresh),"</button>"),this.options.showToggle&&html.push(sprintf('<button class="btn'+sprintf(" btn-%s",this.options.buttonsClass)+sprintf(" btn-%s",this.options.iconSize)+'" type="button" name="toggle" aria-label="toggle" title="%s">',this.options.formatToggle()),sprintf('<i class="%s %s"></i>',this.options.iconsPrefix,this.options.icons.toggle),"</button>"),this.options.showColumns&&(html.push(sprintf('<div class="keep-open btn-group" title="%s">',this.options.formatColumns()),'<button type="button" aria-label="columns" class="btn'+sprintf(" btn-%s",this.options.buttonsClass)+sprintf(" btn-%s",this.options.iconSize)+' dropdown-toggle" data-toggle="dropdown">',sprintf('<i class="%s %s"></i>',this.options.iconsPrefix,this.options.icons.columns),' <span class="caret"></span>',"</button>",'<ul class="dropdown-menu" role="menu">'),$.each(this.columns,function(i,column){if(!column.radio&&!column.checkbox&&(!that.options.cardView||column.cardVisible)){var checked=column.visible?' checked="checked"':"";column.switchable&&(html.push(sprintf('<li role="menuitem"><label><input type="checkbox" data-field="%s" value="%s"%s> %s</label></li>',column.field,i,checked,column.title)),switchableCount++)}}),html.push("</ul>","</div>")),html.push("</div>"),(this.showToolbar||2<html.length)&&this.$toolbar.append(html.join("")),this.options.showPaginationSwitch&&this.$toolbar.find('button[name="paginationSwitch"]').off("click").on("click",$.proxy(this.togglePagination,this)),this.options.showRefresh&&this.$toolbar.find('button[name="refresh"]').off("click").on("click",$.proxy(this.refresh,this)),this.options.showToggle&&this.$toolbar.find('button[name="toggle"]').off("click").on("click",function(){that.toggleView()}),this.options.showColumns&&($keepOpen=this.$toolbar.find(".keep-open"),switchableCount<=this.options.minimumCountColumns&&$keepOpen.find("input").prop("disabled",!0),$keepOpen.find("li").off("click").on("click",function(event){event.stopImmediatePropagation()}),$keepOpen.find("input").off("click").on("click",function(){var $this=$(this);that.toggleColumn($(this).val(),$this.prop("checked"),!1),that.trigger("column-switch",$(this).data("field"),$this.prop("checked"))})),this.options.search&&((html=[]).push('<div class="pull-'+this.options.searchAlign+' search">',sprintf('<input class="form-control'+sprintf(" input-%s",this.options.iconSize)+'" type="text" placeholder="%s">',this.options.formatSearch()),"</div>"),this.$toolbar.append(html.join("")),($search=this.$toolbar.find(".search input")).off("keyup drop blur").on("keyup drop blur",function(event){that.options.searchOnEnterKey&&13!==event.keyCode||-1<$.inArray(event.keyCode,[37,38,39,40])||(clearTimeout(timeoutId),timeoutId=setTimeout(function(){that.onSearch(event)},that.options.searchTimeOut))}),isIEBrowser()&&$search.off("mouseup").on("mouseup",function(event){clearTimeout(timeoutId),timeoutId=setTimeout(function(){that.onSearch(event)},that.options.searchTimeOut)}))},BootstrapTable.prototype.onSearch=function(event){var text=$.trim($(event.currentTarget).val());this.options.trimOnSearch&&$(event.currentTarget).val()!==text&&$(event.currentTarget).val(text),text!==this.searchText&&(this.searchText=text,this.options.searchText=text,this.options.pageNumber=1,this.initSearch(),this.updatePagination(),this.trigger("search",text))},BootstrapTable.prototype.initSearch=function(){var that=this;if("server"!==this.options.sidePagination){if(this.options.customSearch!==$.noop)return void this.options.customSearch.apply(this,[this.searchText]);var s=this.searchText&&(this.options.escape?escapeHTML(this.searchText):this.searchText).toLowerCase(),f=$.isEmptyObject(this.filterColumns)?null:this.filterColumns;this.data=f?$.grep(this.options.data,function(item,i){for(var key in f)if($.isArray(f[key])&&-1===$.inArray(item[key],f[key])||!$.isArray(f[key])&&item[key]!==f[key])return!1;return!0}):this.options.data,this.data=s?$.grep(this.data,function(item,i){for(var j=0;j<that.header.fields.length;j++)if(that.header.searchables[j]){var value,key=$.isNumeric(that.header.fields[j])?parseInt(that.header.fields[j],10):that.header.fields[j],column=that.columns[getFieldIndex(that.columns,key)];if("string"==typeof key){value=item;for(var props=key.split("."),prop_index=0;prop_index<props.length;prop_index++)value=value[props[prop_index]];column&&column.searchFormatter&&(value=calculateObjectValue(column,that.header.formatters[j],[value,item,i],value))}else value=item[key];if("string"==typeof value||"number"==typeof value)if(that.options.strictSearch){if((value+"").toLowerCase()===s)return!0}else if(-1!==(value+"").toLowerCase().indexOf(s))return!0}return!1}):this.data}},BootstrapTable.prototype.initPagination=function(){if(this.options.pagination){this.$pagination.show();var i,from,to,$pageList,$first,$pre,$next,$last,$number,that=this,html=[],$allSelected=!1,data=this.getData(),pageList=this.options.pageList;if("server"!==this.options.sidePagination&&(this.options.totalRows=data.length),this.totalPages=0,this.options.totalRows){if(this.options.pageSize===this.options.formatAllRows())this.options.pageSize=this.options.totalRows,$allSelected=!0;else if(this.options.pageSize===this.options.totalRows){var pageLst="string"==typeof this.options.pageList?this.options.pageList.replace("[","").replace("]","").replace(/ /g,"").toLowerCase().split(","):this.options.pageList;-1<$.inArray(this.options.formatAllRows().toLowerCase(),pageLst)&&($allSelected=!0)}this.totalPages=1+~~((this.options.totalRows-1)/this.options.pageSize),this.options.totalPages=this.totalPages}if(0<this.totalPages&&this.options.pageNumber>this.totalPages&&(this.options.pageNumber=this.totalPages),this.pageFrom=(this.options.pageNumber-1)*this.options.pageSize+1,this.pageTo=this.options.pageNumber*this.options.pageSize,this.pageTo>this.options.totalRows&&(this.pageTo=this.options.totalRows),html.push('<div class="pull-'+this.options.paginationDetailHAlign+' pagination-detail">','<span class="pagination-info">',this.options.onlyInfoPagination?this.options.formatDetailPagination(this.options.totalRows):this.options.formatShowingRows(this.pageFrom,this.pageTo,this.options.totalRows),"</span>"),!this.options.onlyInfoPagination){html.push('<span class="page-list">');var pageNumber=[sprintf('<span class="btn-group %s">',"top"===this.options.paginationVAlign||"both"===this.options.paginationVAlign?"dropdown":"dropup"),'<button type="button" class="btn'+sprintf(" btn-%s",this.options.buttonsClass)+sprintf(" btn-%s",this.options.iconSize)+' dropdown-toggle" data-toggle="dropdown">','<span class="page-size">',$allSelected?this.options.formatAllRows():this.options.pageSize,"</span>",' <span class="caret"></span>',"</button>",'<ul class="dropdown-menu" role="menu">'];if("string"==typeof this.options.pageList){var list=this.options.pageList.replace("[","").replace("]","").replace(/ /g,"").split(",");pageList=[],$.each(list,function(i,value){pageList.push(value.toUpperCase()===that.options.formatAllRows().toUpperCase()?that.options.formatAllRows():+value)})}for($.each(pageList,function(i,page){var active;(!that.options.smartDisplay||0===i||pageList[i-1]<that.options.totalRows)&&(active=$allSelected?page===that.options.formatAllRows()?' class="active"':"":page===that.options.pageSize?' class="active"':"",pageNumber.push(sprintf('<li role="menuitem"%s><a href="#">%s</a></li>',active,page)))}),pageNumber.push("</ul></span>"),html.push(this.options.formatRecordsPerPage(pageNumber.join(""))),html.push("</span>"),html.push("</div>",'<div class="pull-'+this.options.paginationHAlign+' pagination">','<ul class="pagination'+sprintf(" pagination-%s",this.options.iconSize)+'">','<li class="page-pre"><a href="#">'+this.options.paginationPreText+"</a></li>"),this.totalPages<5?(from=1,to=this.totalPages):(to=(from=this.options.pageNumber-2)+4,from<1&&(from=1,to=5),to>this.totalPages&&(from=(to=this.totalPages)-4)),6<=this.totalPages&&(3<=this.options.pageNumber&&(html.push('<li class="page-first'+(1===this.options.pageNumber?" active":"")+'">','<a href="#">',1,"</a>","</li>"),from++),4<=this.options.pageNumber&&(4==this.options.pageNumber||6==this.totalPages||7==this.totalPages?from--:html.push('<li class="page-first-separator disabled">','<a href="#">...</a>',"</li>"),to--)),7<=this.totalPages&&this.options.pageNumber>=this.totalPages-2&&from--,6==this.totalPages?this.options.pageNumber>=this.totalPages-2&&to++:7<=this.totalPages&&(7==this.totalPages||this.options.pageNumber>=this.totalPages-3)&&to++,i=from;i<=to;i++)html.push('<li class="page-number'+(i===this.options.pageNumber?" active":"")+'">','<a href="#">',i,"</a>","</li>");8<=this.totalPages&&this.options.pageNumber<=this.totalPages-4&&html.push('<li class="page-last-separator disabled">','<a href="#">...</a>',"</li>"),6<=this.totalPages&&this.options.pageNumber<=this.totalPages-3&&html.push('<li class="page-last'+(this.totalPages===this.options.pageNumber?" active":"")+'">','<a href="#">',this.totalPages,"</a>","</li>"),html.push('<li class="page-next"><a href="#">'+this.options.paginationNextText+"</a></li>","</ul>","</div>")}this.$pagination.html(html.join("")),this.options.onlyInfoPagination||($pageList=this.$pagination.find(".page-list a"),$first=this.$pagination.find(".page-first"),$pre=this.$pagination.find(".page-pre"),$next=this.$pagination.find(".page-next"),$last=this.$pagination.find(".page-last"),$number=this.$pagination.find(".page-number"),this.options.smartDisplay&&(this.totalPages<=1&&this.$pagination.find("div.pagination").hide(),(pageList.length<2||this.options.totalRows<=pageList[0])&&this.$pagination.find("span.page-list").hide(),this.$pagination[this.getData().length?"show":"hide"]()),this.options.paginationLoop||(1===this.options.pageNumber&&$pre.addClass("disabled"),this.options.pageNumber===this.totalPages&&$next.addClass("disabled")),$allSelected&&(this.options.pageSize=this.options.formatAllRows()),$pageList.off("click").on("click",$.proxy(this.onPageListChange,this)),$first.off("click").on("click",$.proxy(this.onPageFirst,this)),$pre.off("click").on("click",$.proxy(this.onPagePre,this)),$next.off("click").on("click",$.proxy(this.onPageNext,this)),$last.off("click").on("click",$.proxy(this.onPageLast,this)),$number.off("click").on("click",$.proxy(this.onPageNumber,this)))}else this.$pagination.hide()},BootstrapTable.prototype.updatePagination=function(event){event&&$(event.currentTarget).hasClass("disabled")||(this.options.maintainSelected||this.resetRows(),this.initPagination(),"server"===this.options.sidePagination?this.initServer():this.initBody(),this.trigger("page-change",this.options.pageNumber,this.options.pageSize))},BootstrapTable.prototype.onPageListChange=function(event){var $this=$(event.currentTarget);return $this.parent().addClass("active").siblings().removeClass("active"),this.options.pageSize=$this.text().toUpperCase()===this.options.formatAllRows().toUpperCase()?this.options.formatAllRows():+$this.text(),this.$toolbar.find(".page-size").text(this.options.pageSize),this.updatePagination(event),!1},BootstrapTable.prototype.onPageFirst=function(event){return this.options.pageNumber=1,this.updatePagination(event),!1},BootstrapTable.prototype.onPagePre=function(event){return this.options.pageNumber-1==0?this.options.pageNumber=this.options.totalPages:this.options.pageNumber--,this.updatePagination(event),!1},BootstrapTable.prototype.onPageNext=function(event){return this.options.pageNumber+1>this.options.totalPages?this.options.pageNumber=1:this.options.pageNumber++,this.updatePagination(event),!1},BootstrapTable.prototype.onPageLast=function(event){return this.options.pageNumber=this.totalPages,this.updatePagination(event),!1},BootstrapTable.prototype.onPageNumber=function(event){if(this.options.pageNumber!==+$(event.currentTarget).text())return this.options.pageNumber=+$(event.currentTarget).text(),this.updatePagination(event),!1},BootstrapTable.prototype.initRow=function(item,i,data,parentDom){var key,that=this,html=[],style={},csses=[],data_="",attributes={},htmlAttributes=[];if(!(-1<$.inArray(item,this.hiddenRows))){if((style=calculateObjectValue(this.options,this.options.rowStyle,[item,i],style))&&style.css)for(key in style.css)csses.push(key+": "+style.css[key]);if(attributes=calculateObjectValue(this.options,this.options.rowAttributes,[item,i],attributes))for(key in attributes)htmlAttributes.push(sprintf('%s="%s"',key,escapeHTML(attributes[key])));return item._data&&!$.isEmptyObject(item._data)&&$.each(item._data,function(k,v){"index"!==k&&(data_+=sprintf(' data-%s="%s"',k,v))}),html.push("<tr",sprintf(" %s",htmlAttributes.join(" ")),sprintf(' id="%s"',$.isArray(item)?void 0:item._id),sprintf(' class="%s"',style.classes||($.isArray(item)?void 0:item._class)),sprintf(' data-index="%s"',i),sprintf(' data-uniqueid="%s"',item[this.options.uniqueId]),sprintf("%s",data_),">"),this.options.cardView&&html.push(sprintf('<td colspan="%s"><div class="card-views">',this.header.fields.length)),!this.options.cardView&&this.options.detailView&&html.push('<td class="detail-td">',sprintf('<a class="detail-icon" href="#%splus">',item.id),sprintf('<i class="%s %s"></i>',this.options.iconsPrefix,this.options.icons.detailOpen),"</a>","</td>"),$.each(this.header.fields,function(j,field){var text="",value_=getItemField(item,field,that.options.escape),value="",type="",cellStyle={},id_="",class_=that.header.classes[j],data_="",rowspan_="",colspan_="",title_="",column=that.columns[j];if((!that.fromHtml||void 0!==value_)&&column.visible&&(!that.options.cardView||column.cardVisible)){if(column.escape&&(value_=escapeHTML(value_)),style=sprintf('style="%s"',csses.concat(that.header.styles[j]).join("; ")),item["_"+field+"_id"]&&(id_=sprintf(' id="%s"',item["_"+field+"_id"])),item["_"+field+"_class"]&&(class_=sprintf(' class="%s"',item["_"+field+"_class"])),item["_"+field+"_rowspan"]&&(rowspan_=sprintf(' rowspan="%s"',item["_"+field+"_rowspan"])),item["_"+field+"_colspan"]&&(colspan_=sprintf(' colspan="%s"',item["_"+field+"_colspan"])),item["_"+field+"_title"]&&(title_=sprintf(' title="%s"',item["_"+field+"_title"])),(cellStyle=calculateObjectValue(that.header,that.header.cellStyles[j],[value_,item,i,field],cellStyle)).classes&&(class_=sprintf(' class="%s"',cellStyle.classes)),cellStyle.css){var csses_=[];for(var key in cellStyle.css)csses_.push(key+": "+cellStyle.css[key]);style=sprintf('style="%s"',csses_.concat(that.header.styles[j]).join("; "))}value=calculateObjectValue(column,that.header.formatters[j],[value_,item,i],value_),item["_"+field+"_data"]&&!$.isEmptyObject(item["_"+field+"_data"])&&$.each(item["_"+field+"_data"],function(k,v){"index"!==k&&(data_+=sprintf(' data-%s="%s"',k,v))}),column.checkbox||column.radio?(type=column.checkbox?"checkbox":type,type=column.radio?"radio":type,text=[sprintf(that.options.cardView?'<div class="card-view %s">':'<td class="bs-checkbox %s">',column.class||""),"<input"+sprintf(' data-index="%s"',i)+sprintf(' name="%s"',that.options.selectItemName)+sprintf(' type="%s"',type)+sprintf(' value="%s"',item[that.options.idField])+sprintf(' checked="%s"',!0===value||value_||value&&value.checked?"checked":void 0)+sprintf(' disabled="%s"',!column.checkboxEnabled||value&&value.disabled?"disabled":void 0)+" />",that.header.formatters[j]&&"string"==typeof value?value:"",that.options.cardView?"</div>":"</td>"].join(""),item[that.header.stateField]=!0===value||value&&value.checked):(value=null==value?that.options.undefinedText:value,text=that.options.cardView?['<div class="card-view">',that.options.showHeader?sprintf('<span class="title" %s>%s</span>',style,function(list,from,to,value){var result="";return $.each(list,function(i,item){return item[from]!==value||(result=item[to],!1)}),result}(that.columns,"field","title",field)):"",sprintf('<span class="value">%s</span>',value),"</div>"].join(""):[sprintf("<td%s %s %s %s %s %s %s>",id_,class_,style,data_,rowspan_,colspan_,title_),value,"</td>"].join(""),that.options.cardView&&that.options.smartDisplay&&""===value&&(text='<div class="card-view"></div>')),html.push(text)}}),this.options.cardView&&html.push("</div></td>"),html.push("</tr>"),html.join(" ")}},BootstrapTable.prototype.initBody=function(fixedScroll){var that=this,data=this.getData();this.trigger("pre-body",data),this.$body=this.$el.find(">tbody"),this.$body.length||(this.$body=$("<tbody></tbody>").appendTo(this.$el)),this.options.pagination&&"server"!==this.options.sidePagination||(this.pageFrom=1,this.pageTo=data.length);for(var hasTr,trFragments=$(document.createDocumentFragment()),i=this.pageFrom-1;i<this.pageTo;i++){var item=data[i],tr=this.initRow(item,i,data,trFragments);hasTr=hasTr||!!tr,tr&&!0!==tr&&trFragments.append(tr)}hasTr||trFragments.append('<tr class="no-records-found">'+sprintf('<td colspan="%s">%s</td>',this.$header.find("th").length,this.options.formatNoMatches())+"</tr>"),this.$body.html(trFragments),fixedScroll||this.scrollTo(0),this.$body.find("> tr[data-index] > td").off("click dblclick").on("click dblclick",function(e){var $td=$(this),$tr=$td.parent(),item=that.data[$tr.data("index")],index=$td[0].cellIndex,field=that.getVisibleFields()[that.options.detailView&&!that.options.cardView?index-1:index],column=that.columns[getFieldIndex(that.columns,field)],value=getItemField(item,field,that.options.escape);if(!$td.find(".detail-icon").length&&(that.trigger("click"===e.type?"click-cell":"dbl-click-cell",field,value,item,$td),that.trigger("click"===e.type?"click-row":"dbl-click-row",item,$tr,field),"click"===e.type&&that.options.clickToSelect&&column.clickToSelect)){var $selectItem=$tr.find(sprintf('[name="%s"]',that.options.selectItemName));$selectItem.length&&$selectItem[0].click()}}),this.$body.find("> tr[data-index] > td > .detail-icon").off("click").on("click",function(){var $this=$(this),$tr=$this.parent().parent(),index=$tr.data("index"),row=data[index];if($tr.next().is("tr.detail-view"))$this.find("i").attr("class",sprintf("%s %s",that.options.iconsPrefix,that.options.icons.detailOpen)),that.trigger("collapse-row",index,row),$tr.next().remove();else{$this.find("i").attr("class",sprintf("%s %s",that.options.iconsPrefix,that.options.icons.detailClose)),$tr.after(sprintf('<tr class="detail-view"><td colspan="%s"></td></tr>',$tr.find("td").length));var $element=$tr.next().find("td"),content=calculateObjectValue(that.options,that.options.detailFormatter,[index,row,$element],"");1===$element.length&&$element.append(content),that.trigger("expand-row",index,row,$element)}return that.resetView(),!1}),this.$selectItem=this.$body.find(sprintf('[name="%s"]',this.options.selectItemName)),this.$selectItem.off("click").on("click",function(event){event.stopImmediatePropagation();var $this=$(this),checked=$this.prop("checked"),row=that.data[$this.data("index")];that.options.maintainSelected&&$(this).is(":radio")&&$.each(that.options.data,function(i,row){row[that.header.stateField]=!1}),row[that.header.stateField]=checked,that.options.singleSelect&&(that.$selectItem.not(this).each(function(){that.data[$(this).data("index")][that.header.stateField]=!1}),that.$selectItem.filter(":checked").not(this).prop("checked",!1)),that.updateSelected(),that.trigger(checked?"check":"uncheck",row,$this)}),$.each(this.header.events,function(i,events){if(events){"string"==typeof events&&(events=calculateObjectValue(null,events));var field=that.header.fields[i],fieldIndex=$.inArray(field,that.getVisibleFields());for(var key in that.options.detailView&&!that.options.cardView&&(fieldIndex+=1),events)that.$body.find(">tr:not(.no-records-found)").each(function(){var $tr=$(this),$td=$tr.find(that.options.cardView?".card-view":"td").eq(fieldIndex),index=key.indexOf(" "),name=key.substring(0,index),el=key.substring(index+1),func=events[key];$td.find(el).off(name).on(name,function(e){var index=$tr.data("index"),row=that.data[index],value=row[field];func.apply(this,[e,value,row,index])})})}}),this.updateSelected(),this.resetView(),this.trigger("post-body",data)},BootstrapTable.prototype.initServer=function(silent,query,url){var request,that=this,data={},params={searchText:this.searchText,sortName:this.options.sortName,sortOrder:this.options.sortOrder};this.options.pagination&&(params.pageSize=this.options.pageSize===this.options.formatAllRows()?this.options.totalRows:this.options.pageSize,params.pageNumber=this.options.pageNumber),(url||this.options.url||this.options.ajax)&&("limit"===this.options.queryParamsType&&(params={search:params.searchText,sort:params.sortName,order:params.sortOrder},this.options.pagination&&(params.offset=this.options.pageSize===this.options.formatAllRows()?0:this.options.pageSize*(this.options.pageNumber-1),params.limit=this.options.pageSize===this.options.formatAllRows()?this.options.totalRows:this.options.pageSize)),$.isEmptyObject(this.filterColumnsPartial)||(params.filter=JSON.stringify(this.filterColumnsPartial,null)),data=calculateObjectValue(this.options,this.options.queryParams,[params],data),$.extend(data,query||{}),!1!==data&&(silent||this.$tableLoading.show(),request=$.extend({},calculateObjectValue(null,this.options.ajaxOptions),{type:this.options.method,url:url||this.options.url,data:"application/json"===this.options.contentType&&"post"===this.options.method?JSON.stringify(data):data,cache:this.options.cache,contentType:this.options.contentType,dataType:this.options.dataType,success:function(res){res=calculateObjectValue(that.options,that.options.responseHandler,[res],res),that.load(res),that.trigger("load-success",res),silent||that.$tableLoading.hide()},error:function(res){that.trigger("load-error",res.status,res),silent||that.$tableLoading.hide()}}),this.options.ajax?calculateObjectValue(this,this.options.ajax,[request],null):(this._xhr&&4!==this._xhr.readyState&&this._xhr.abort(),this._xhr=$.ajax(request))))},BootstrapTable.prototype.initSearchText=function(){if(this.options.search&&""!==this.options.searchText){var $search=this.$toolbar.find(".search input");$search.val(this.options.searchText),this.onSearch({currentTarget:$search})}},BootstrapTable.prototype.getCaret=function(){var that=this;$.each(this.$header.find("th"),function(i,th){$(th).find(".sortable").removeClass("desc asc").addClass($(th).data("field")===that.options.sortName?that.options.sortOrder:"both")})},BootstrapTable.prototype.updateSelected=function(){var checkAll=this.$selectItem.filter(":enabled").length&&this.$selectItem.filter(":enabled").length===this.$selectItem.filter(":enabled").filter(":checked").length;this.$selectAll.add(this.$selectAll_).prop("checked",checkAll),this.$selectItem.each(function(){$(this).closest("tr")[$(this).prop("checked")?"addClass":"removeClass"]("selected")})},BootstrapTable.prototype.updateRows=function(){var that=this;this.$selectItem.each(function(){that.data[$(this).data("index")][that.header.stateField]=$(this).prop("checked")})},BootstrapTable.prototype.resetRows=function(){var that=this;$.each(this.data,function(i,row){that.$selectAll.prop("checked",!1),that.$selectItem.prop("checked",!1),that.header.stateField&&(row[that.header.stateField]=!1)}),this.initHiddenRows()},BootstrapTable.prototype.trigger=function(name){var args=Array.prototype.slice.call(arguments,1);name+=".bs.table",this.options[BootstrapTable.EVENTS[name]].apply(this.options,args),this.$el.trigger($.Event(name),args),this.options.onAll(name,args),this.$el.trigger($.Event("all.bs.table"),[name,args])},BootstrapTable.prototype.resetHeader=function(){clearTimeout(this.timeoutId_),this.timeoutId_=setTimeout($.proxy(this.fitHeader,this),this.$el.is(":hidden")?100:0)},BootstrapTable.prototype.fitHeader=function(){var fixedBody,scrollWidth,focused,focusedTemp,that=this;if(that.$el.is(":hidden"))that.timeoutId_=setTimeout($.proxy(that.fitHeader,that),100);else{if(scrollWidth=(fixedBody=this.$tableBody.get(0)).scrollWidth>fixedBody.clientWidth&&fixedBody.scrollHeight>fixedBody.clientHeight+this.$header.outerHeight()?getScrollBarWidth():0,this.$el.css("margin-top",-this.$header.outerHeight()),0<(focused=$(":focus")).length){var $th=focused.parents("th");if(0<$th.length){var dataField=$th.attr("data-field");if(void 0!==dataField){var $headerTh=this.$header.find("[data-field='"+dataField+"']");0<$headerTh.length&&$headerTh.find(":input").addClass("focus-temp")}}}this.$header_=this.$header.clone(!0,!0),this.$selectAll_=this.$header_.find('[name="btSelectAll"]'),this.$tableHeader.css({"margin-right":scrollWidth}).find("table").css("width",this.$el.outerWidth()).html("").attr("class",this.$el.attr("class")).append(this.$header_),0<(focusedTemp=$(".focus-temp:visible:eq(0)")).length&&(focusedTemp.focus(),this.$header.find(".focus-temp").removeClass("focus-temp")),this.$header.find("th[data-field]").each(function(i){that.$header_.find(sprintf('th[data-field="%s"]',$(this).data("field"))).data($(this).data())});var visibleFields=this.getVisibleFields(),$ths=this.$header_.find("th");this.$body.find(">tr:first-child:not(.no-records-found) > *").each(function(i){var $this=$(this),index=i;that.options.detailView&&!that.options.cardView&&(0===i&&that.$header_.find("th.detail").find(".fht-cell").width($this.innerWidth()),index=i-1);var $th=that.$header_.find(sprintf('th[data-field="%s"]',visibleFields[index]));1<$th.length&&($th=$($ths[$this[0].cellIndex])),$th.find(".fht-cell").width($this.innerWidth())}),this.$tableBody.off("scroll").on("scroll",function(){that.$tableHeader.scrollLeft($(this).scrollLeft()),that.options.showFooter&&!that.options.cardView&&that.$tableFooter.scrollLeft($(this).scrollLeft())}),that.trigger("post-header")}},BootstrapTable.prototype.resetFooter=function(){var that=this,data=that.getData(),html=[];this.options.showFooter&&!this.options.cardView&&(!this.options.cardView&&this.options.detailView&&html.push('<td><div class="th-inner">&nbsp;</div><div class="fht-cell"></div></td>'),$.each(this.columns,function(i,column){var key,falign,valign,style,csses=[],class_=sprintf(' class="%s"',column.class);if(column.visible&&(!that.options.cardView||column.cardVisible)){if(falign=sprintf("text-align: %s; ",column.falign?column.falign:column.align),valign=sprintf("vertical-align: %s; ",column.valign),(style=calculateObjectValue(null,that.options.footerStyle))&&style.css)for(key in style.css)csses.push(key+": "+style.css[key]);html.push("<td",class_,sprintf(' style="%s"',falign+valign+csses.concat().join("; ")),">"),html.push('<div class="th-inner">'),html.push(calculateObjectValue(column,column.footerFormatter,[data],"&nbsp;")||"&nbsp;"),html.push("</div>"),html.push('<div class="fht-cell"></div>'),html.push("</div>"),html.push("</td>")}}),this.$tableFooter.find("tr").html(html.join("")),this.$tableFooter.show(),clearTimeout(this.timeoutFooter_),this.timeoutFooter_=setTimeout($.proxy(this.fitFooter,this),this.$el.is(":hidden")?100:0))},BootstrapTable.prototype.fitFooter=function(){var $footerTd,elWidth,scrollWidth;clearTimeout(this.timeoutFooter_),this.$el.is(":hidden")?this.timeoutFooter_=setTimeout($.proxy(this.fitFooter,this),100):(scrollWidth=(elWidth=this.$el.css("width"))>this.$tableBody.width()?getScrollBarWidth():0,this.$tableFooter.css({"margin-right":scrollWidth}).find("table").css("width",elWidth).attr("class",this.$el.attr("class")),$footerTd=this.$tableFooter.find("td"),this.$body.find(">tr:first-child:not(.no-records-found) > *").each(function(i){var $this=$(this);$footerTd.eq(i).find(".fht-cell").width($this.innerWidth())}))},BootstrapTable.prototype.toggleColumn=function(index,checked,needUpdate){if(-1!==index&&(this.columns[index].visible=checked,this.initHeader(),this.initSearch(),this.initPagination(),this.initBody(),this.options.showColumns)){var $items=this.$toolbar.find(".keep-open input").prop("disabled",!1);needUpdate&&$items.filter(sprintf('[value="%s"]',index)).prop("checked",checked),$items.filter(":checked").length<=this.options.minimumCountColumns&&$items.filter(":checked").prop("disabled",!0)}},BootstrapTable.prototype.getVisibleFields=function(){var that=this,visibleFields=[];return $.each(this.header.fields,function(j,field){that.columns[getFieldIndex(that.columns,field)].visible&&visibleFields.push(field)}),visibleFields},BootstrapTable.prototype.resetView=function(params){var padding=0;if(params&&params.height&&(this.options.height=params.height),this.$selectAll.prop("checked",0<this.$selectItem.length&&this.$selectItem.length===this.$selectItem.filter(":checked").length),this.options.height){var toolbarHeight=this.$toolbar.outerHeight(!0),paginationHeight=this.$pagination.outerHeight(!0),height=this.options.height-toolbarHeight-paginationHeight;this.$tableContainer.css("height",height+"px")}if(this.options.cardView)return this.$el.css("margin-top","0"),this.$tableContainer.css("padding-bottom","0"),void this.$tableFooter.hide();this.options.showHeader&&this.options.height?(this.$tableHeader.show(),this.resetHeader(),padding+=this.$header.outerHeight()):(this.$tableHeader.hide(),this.trigger("post-header")),this.options.showFooter&&(this.resetFooter(),this.options.height&&(padding+=this.$tableFooter.outerHeight()+1)),this.getCaret(),this.$tableContainer.css("padding-bottom",padding+"px"),this.trigger("reset-view")},BootstrapTable.prototype.getData=function(useCurrentPage){return!this.searchText&&$.isEmptyObject(this.filterColumns)&&$.isEmptyObject(this.filterColumnsPartial)?useCurrentPage?this.options.data.slice(this.pageFrom-1,this.pageTo):this.options.data:useCurrentPage?this.data.slice(this.pageFrom-1,this.pageTo):this.data},BootstrapTable.prototype.load=function(data){var fixedScroll=!1;"server"===this.options.sidePagination?(this.options.totalRows=data[this.options.totalField],fixedScroll=data.fixedScroll,data=data[this.options.dataField]):$.isArray(data)||(fixedScroll=data.fixedScroll,data=data.data),this.initData(data),this.initSearch(),this.initPagination(),this.initBody(fixedScroll)},BootstrapTable.prototype.append=function(data){this.initData(data,"append"),this.initSearch(),this.initPagination(),this.initSort(),this.initBody(!0)},BootstrapTable.prototype.prepend=function(data){this.initData(data,"prepend"),this.initSearch(),this.initPagination(),this.initSort(),this.initBody(!0)},BootstrapTable.prototype.remove=function(params){var i,row,len=this.options.data.length;if(params.hasOwnProperty("field")&&params.hasOwnProperty("values")){for(i=len-1;0<=i;i--)(row=this.options.data[i]).hasOwnProperty(params.field)&&-1!==$.inArray(row[params.field],params.values)&&(this.options.data.splice(i,1),"server"===this.options.sidePagination&&(this.options.totalRows-=1));len!==this.options.data.length&&(this.initSearch(),this.initPagination(),this.initSort(),this.initBody(!0))}},BootstrapTable.prototype.removeAll=function(){0<this.options.data.length&&(this.options.data.splice(0,this.options.data.length),this.initSearch(),this.initPagination(),this.initBody(!0))},BootstrapTable.prototype.getRowByUniqueId=function(id){var i,row,rowUniqueId,uniqueId=this.options.uniqueId,dataRow=null;for(i=this.options.data.length-1;0<=i;i--){if((row=this.options.data[i]).hasOwnProperty(uniqueId))rowUniqueId=row[uniqueId];else{if(!row._data.hasOwnProperty(uniqueId))continue;rowUniqueId=row._data[uniqueId]}if("string"==typeof rowUniqueId?id=id.toString():"number"==typeof rowUniqueId&&(Number(rowUniqueId)===rowUniqueId&&rowUniqueId%1==0?id=parseInt(id):rowUniqueId===Number(rowUniqueId)&&0!==rowUniqueId&&(id=parseFloat(id))),rowUniqueId===id){dataRow=row;break}}return dataRow},BootstrapTable.prototype.removeByUniqueId=function(id){var len=this.options.data.length,row=this.getRowByUniqueId(id);row&&this.options.data.splice(this.options.data.indexOf(row),1),len!==this.options.data.length&&(this.initSearch(),this.initPagination(),this.initBody(!0))},BootstrapTable.prototype.updateByUniqueId=function(params){var that=this,allParams=$.isArray(params)?params:[params];$.each(allParams,function(i,params){var rowId;params.hasOwnProperty("id")&&params.hasOwnProperty("row")&&-1!==(rowId=$.inArray(that.getRowByUniqueId(params.id),that.options.data))&&$.extend(that.options.data[rowId],params.row)}),this.initSearch(),this.initPagination(),this.initSort(),this.initBody(!0)},BootstrapTable.prototype.insertRow=function(params){params.hasOwnProperty("index")&&params.hasOwnProperty("row")&&(this.data.splice(params.index,0,params.row),this.initSearch(),this.initPagination(),this.initSort(),this.initBody(!0))},BootstrapTable.prototype.updateRow=function(params){var that=this,allParams=$.isArray(params)?params:[params];$.each(allParams,function(i,params){params.hasOwnProperty("index")&&params.hasOwnProperty("row")&&$.extend(that.options.data[params.index],params.row)}),this.initSearch(),this.initPagination(),this.initSort(),this.initBody(!0)},BootstrapTable.prototype.initHiddenRows=function(){this.hiddenRows=[]},BootstrapTable.prototype.showRow=function(params){this.toggleRow(params,!0)},BootstrapTable.prototype.hideRow=function(params){this.toggleRow(params,!1)},BootstrapTable.prototype.toggleRow=function(params,visible){var row,index;params.hasOwnProperty("index")?row=this.getData()[params.index]:params.hasOwnProperty("uniqueId")&&(row=this.getRowByUniqueId(params.uniqueId)),row&&(index=$.inArray(row,this.hiddenRows),visible||-1!==index?visible&&-1<index&&this.hiddenRows.splice(index,1):this.hiddenRows.push(row),this.initBody(!0))},BootstrapTable.prototype.getHiddenRows=function(show){var that=this,data=this.getData(),rows=[];return $.each(data,function(i,row){-1<$.inArray(row,that.hiddenRows)&&rows.push(row)}),this.hiddenRows=rows},BootstrapTable.prototype.mergeCells=function(options){var i,j,$td,row=options.index,col=$.inArray(options.field,this.getVisibleFields()),rowspan=options.rowspan||1,colspan=options.colspan||1,$tr=this.$body.find(">tr");if(this.options.detailView&&!this.options.cardView&&(col+=1),$td=$tr.eq(row).find(">td").eq(col),!(row<0||col<0||row>=this.data.length)){for(i=row;i<row+rowspan;i++)for(j=col;j<col+colspan;j++)$tr.eq(i).find(">td").eq(j).hide();$td.attr("rowspan",rowspan).attr("colspan",colspan).show()}},BootstrapTable.prototype.updateCell=function(params){params.hasOwnProperty("index")&&params.hasOwnProperty("field")&&params.hasOwnProperty("value")&&(this.data[params.index][params.field]=params.value,!1!==params.reinit&&(this.initSort(),this.initBody(!0)))},BootstrapTable.prototype.getOptions=function(){return this.options},BootstrapTable.prototype.getSelections=function(){var that=this;return $.grep(this.options.data,function(row){return!0===row[that.header.stateField]})},BootstrapTable.prototype.getAllSelections=function(){var that=this;return $.grep(this.options.data,function(row){return row[that.header.stateField]})},BootstrapTable.prototype.checkAll=function(){this.checkAll_(!0)},BootstrapTable.prototype.uncheckAll=function(){this.checkAll_(!1)},BootstrapTable.prototype.checkInvert=function(){var rows=this.$selectItem.filter(":enabled"),checked=rows.filter(":checked");rows.each(function(){$(this).prop("checked",!$(this).prop("checked"))}),this.updateRows(),this.updateSelected(),this.trigger("uncheck-some",checked),checked=this.getSelections(),this.trigger("check-some",checked)},BootstrapTable.prototype.checkAll_=function(checked){var rows;checked||(rows=this.getSelections()),this.$selectAll.add(this.$selectAll_).prop("checked",checked),this.$selectItem.filter(":enabled").prop("checked",checked),this.updateRows(),checked&&(rows=this.getSelections()),this.trigger(checked?"check-all":"uncheck-all",rows)},BootstrapTable.prototype.check=function(index){this.check_(!0,index)},BootstrapTable.prototype.uncheck=function(index){this.check_(!1,index)},BootstrapTable.prototype.check_=function(checked,index){var $el=this.$selectItem.filter(sprintf('[data-index="%s"]',index)).prop("checked",checked);this.data[index][this.header.stateField]=checked,this.updateSelected(),this.trigger(checked?"check":"uncheck",this.data[index],$el)},BootstrapTable.prototype.checkBy=function(obj){this.checkBy_(!0,obj)},BootstrapTable.prototype.uncheckBy=function(obj){this.checkBy_(!1,obj)},BootstrapTable.prototype.checkBy_=function(checked,obj){if(obj.hasOwnProperty("field")&&obj.hasOwnProperty("values")){var that=this,rows=[];$.each(this.options.data,function(index,row){if(!row.hasOwnProperty(obj.field))return!1;if(-1!==$.inArray(row[obj.field],obj.values)){var $el=that.$selectItem.filter(":enabled").filter(sprintf('[data-index="%s"]',index)).prop("checked",checked);row[that.header.stateField]=checked,rows.push(row),that.trigger(checked?"check":"uncheck",row,$el)}}),this.updateSelected(),this.trigger(checked?"check-some":"uncheck-some",rows)}},BootstrapTable.prototype.destroy=function(){this.$el.insertBefore(this.$container),$(this.options.toolbar).insertBefore(this.$el),this.$container.next().remove(),this.$container.remove(),this.$el.html(this.$el_.html()).css("margin-top","0").attr("class",this.$el_.attr("class")||"")},BootstrapTable.prototype.showLoading=function(){this.$tableLoading.show()},BootstrapTable.prototype.hideLoading=function(){this.$tableLoading.hide()},BootstrapTable.prototype.togglePagination=function(){this.options.pagination=!this.options.pagination;var button=this.$toolbar.find('button[name="paginationSwitch"] i');this.options.pagination?button.attr("class",this.options.iconsPrefix+" "+this.options.icons.paginationSwitchDown):button.attr("class",this.options.iconsPrefix+" "+this.options.icons.paginationSwitchUp),this.updatePagination()},BootstrapTable.prototype.refresh=function(params){params&&params.url&&(this.options.url=params.url),params&&params.pageNumber&&(this.options.pageNumber=params.pageNumber),params&&params.pageSize&&(this.options.pageSize=params.pageSize),this.initServer(params&&params.silent,params&&params.query,params&&params.url),this.trigger("refresh",params)},BootstrapTable.prototype.resetWidth=function(){this.options.showHeader&&this.options.height&&this.fitHeader(),this.options.showFooter&&this.fitFooter()},BootstrapTable.prototype.showColumn=function(field){this.toggleColumn(getFieldIndex(this.columns,field),!0,!0)},BootstrapTable.prototype.hideColumn=function(field){this.toggleColumn(getFieldIndex(this.columns,field),!1,!0)},BootstrapTable.prototype.getHiddenColumns=function(){return $.grep(this.columns,function(column){return!column.visible})},BootstrapTable.prototype.getVisibleColumns=function(){return $.grep(this.columns,function(column){return column.visible})},BootstrapTable.prototype.toggleAllColumns=function(visible){if($.each(this.columns,function(i,column){this.columns[i].visible=visible}),this.initHeader(),this.initSearch(),this.initPagination(),this.initBody(),this.options.showColumns){var $items=this.$toolbar.find(".keep-open input").prop("disabled",!1);$items.filter(":checked").length<=this.options.minimumCountColumns&&$items.filter(":checked").prop("disabled",!0)}},BootstrapTable.prototype.showAllColumns=function(){this.toggleAllColumns(!0)},BootstrapTable.prototype.hideAllColumns=function(){this.toggleAllColumns(!1)},BootstrapTable.prototype.filterBy=function(columns){this.filterColumns=$.isEmptyObject(columns)?{}:columns,this.options.pageNumber=1,this.initSearch(),this.updatePagination()},BootstrapTable.prototype.scrollTo=function(value){if("string"==typeof value&&(value="bottom"===value?this.$tableBody[0].scrollHeight:0),"number"==typeof value&&this.$tableBody.scrollTop(value),void 0===value)return this.$tableBody.scrollTop()},BootstrapTable.prototype.getScrollPosition=function(){return this.scrollTo()},BootstrapTable.prototype.selectPage=function(page){0<page&&page<=this.options.totalPages&&(this.options.pageNumber=page,this.updatePagination())},BootstrapTable.prototype.prevPage=function(){1<this.options.pageNumber&&(this.options.pageNumber--,this.updatePagination())},BootstrapTable.prototype.nextPage=function(){this.options.pageNumber<this.options.totalPages&&(this.options.pageNumber++,this.updatePagination())},BootstrapTable.prototype.toggleView=function(){this.options.cardView=!this.options.cardView,this.initHeader(),this.initBody(),this.trigger("toggle",this.options.cardView)},BootstrapTable.prototype.refreshOptions=function(options){compareObjects(this.options,options,!0)||(this.options=$.extend(this.options,options),this.trigger("refresh-options",this.options),this.destroy(),this.init())},BootstrapTable.prototype.resetSearch=function(text){var $search=this.$toolbar.find(".search input");$search.val(text||""),this.onSearch({currentTarget:$search})},BootstrapTable.prototype.expandRow_=function(expand,index){var $tr=this.$body.find(sprintf('> tr[data-index="%s"]',index));$tr.next().is("tr.detail-view")===!expand&&$tr.find("> td > .detail-icon").click()},BootstrapTable.prototype.expandRow=function(index){this.expandRow_(!0,index)},BootstrapTable.prototype.collapseRow=function(index){this.expandRow_(!1,index)},BootstrapTable.prototype.expandAllRows=function(isSubTable){if(isSubTable){var $tr=this.$body.find(sprintf('> tr[data-index="%s"]',0)),that=this,detailIcon=null,executeInterval=!1,idInterval=-1;if($tr.next().is("tr.detail-view")?$tr.next().next().is("tr.detail-view")||($tr.next().find(".detail-icon").click(),executeInterval=!0):($tr.find("> td > .detail-icon").click(),executeInterval=!0),executeInterval)try{idInterval=setInterval(function(){0<(detailIcon=that.$body.find("tr.detail-view").last().find(".detail-icon")).length?detailIcon.click():clearInterval(idInterval)},1)}catch(ex){clearInterval(idInterval)}}else for(var trs=this.$body.children(),i=0;i<trs.length;i++)this.expandRow_(!0,$(trs[i]).data("index"))},BootstrapTable.prototype.collapseAllRows=function(isSubTable){if(isSubTable)this.expandRow_(!1,0);else for(var trs=this.$body.children(),i=0;i<trs.length;i++)this.expandRow_(!1,$(trs[i]).data("index"))},BootstrapTable.prototype.updateFormatText=function(name,text){this.options[sprintf("format%s",name)]&&("string"==typeof text?this.options[sprintf("format%s",name)]=function(){return text}:"function"==typeof text&&(this.options[sprintf("format%s",name)]=text)),this.initToolbar(),this.initPagination(),this.initBody()};var allowedMethods=["getOptions","getSelections","getAllSelections","getData","load","append","prepend","remove","removeAll","insertRow","updateRow","updateCell","updateByUniqueId","removeByUniqueId","getRowByUniqueId","showRow","hideRow","getHiddenRows","mergeCells","checkAll","uncheckAll","checkInvert","check","uncheck","checkBy","uncheckBy","refresh","resetView","resetWidth","destroy","showLoading","hideLoading","showColumn","hideColumn","getHiddenColumns","getVisibleColumns","showAllColumns","hideAllColumns","filterBy","scrollTo","getScrollPosition","selectPage","prevPage","nextPage","togglePagination","toggleView","refreshOptions","resetSearch","expandRow","collapseRow","expandAllRows","collapseAllRows","updateFormatText"];$.fn.bootstrapTable=function(option){var value,args=Array.prototype.slice.call(arguments,1);return this.each(function(){var $this=$(this),data=$this.data("bootstrap.table"),options=$.extend({},BootstrapTable.DEFAULTS,$this.data(),"object"==typeof option&&option);if("string"==typeof option){if($.inArray(option,allowedMethods)<0)throw new Error("Unknown method: "+option);if(!data)return;value=data[option].apply(data,args),"destroy"===option&&$this.removeData("bootstrap.table")}data||$this.data("bootstrap.table",data=new BootstrapTable(this,options))}),void 0===value?this:value},$.fn.bootstrapTable.Constructor=BootstrapTable,$.fn.bootstrapTable.defaults=BootstrapTable.DEFAULTS,$.fn.bootstrapTable.columnDefaults=BootstrapTable.COLUMN_DEFAULTS,$.fn.bootstrapTable.locales=BootstrapTable.LOCALES,$.fn.bootstrapTable.methods=allowedMethods,$.fn.bootstrapTable.utils={sprintf:sprintf,getFieldIndex:getFieldIndex,compareObjects:compareObjects,calculateObjectValue:calculateObjectValue,getItemField:getItemField,objectKeys:function(){var hasOwnProperty,hasDontEnumBug,dontEnums,dontEnumsLength;Object.keys||(Object.keys=(hasOwnProperty=Object.prototype.hasOwnProperty,hasDontEnumBug=!{toString:null}.propertyIsEnumerable("toString"),dontEnumsLength=(dontEnums=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(obj){if("object"!=typeof obj&&("function"!=typeof obj||null===obj))throw new TypeError("Object.keys called on non-object");var prop,i,result=[];for(prop in obj)hasOwnProperty.call(obj,prop)&&result.push(prop);if(hasDontEnumBug)for(i=0;i<dontEnumsLength;i++)hasOwnProperty.call(obj,dontEnums[i])&&result.push(dontEnums[i]);return result}))},isIEBrowser:isIEBrowser},$(function(){$('[data-toggle="table"]').bootstrapTable()})}(jQuery);
/*
* bootstrap-table - v1.11.1 - 2017-02-22
* https://github.com/wenzhixin/bootstrap-table
* Copyright (c) 2017 zhixin wen
* Licensed MIT License
*/
!function(a){"use strict";a.fn.bootstrapTable.locales["en-US"]={formatLoadingMessage:function(){return"Loading, please wait..."},formatRecordsPerPage:function(a){return a+" rows per page"},formatShowingRows:function(a,b,c){return"Showing "+a+" to "+b+" of "+c+" rows"},formatSearch:function(){return"Search"},formatNoMatches:function(){return"No matching records found"},formatPaginationSwitch:function(){return"Hide/Show pagination"},formatRefresh:function(){return"Refresh"},formatToggle:function(){return"Toggle"},formatColumns:function(){return"Columns"},formatAllRows:function(){return"All"},formatExport:function(){return"Export data"},formatClearFilters:function(){return"Clear filters"}},a.extend(a.fn.bootstrapTable.defaults,a.fn.bootstrapTable.locales["en-US"])}(jQuery);!function(root,factory){"object"==typeof exports&&"object"==typeof module?module.exports=factory():"function"==typeof define&&define.amd?define([],factory):"object"==typeof exports?exports.Handlebars=factory():root.Handlebars=factory()}(this,function(){return function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.p="",__webpack_require__(0)}([function(module,exports,__webpack_require__){"use strict";var _interopRequireWildcard=__webpack_require__(1).default,_interopRequireDefault=__webpack_require__(2).default;exports.__esModule=!0;var base=_interopRequireWildcard(__webpack_require__(3)),_handlebarsSafeString2=_interopRequireDefault(__webpack_require__(20)),_handlebarsException2=_interopRequireDefault(__webpack_require__(5)),Utils=_interopRequireWildcard(__webpack_require__(4)),runtime=_interopRequireWildcard(__webpack_require__(21)),_handlebarsNoConflict2=_interopRequireDefault(__webpack_require__(33));function create(){var hb=new base.HandlebarsEnvironment;return Utils.extend(hb,base),hb.SafeString=_handlebarsSafeString2.default,hb.Exception=_handlebarsException2.default,hb.Utils=Utils,hb.escapeExpression=Utils.escapeExpression,hb.VM=runtime,hb.template=function(spec){return runtime.template(spec,hb)},hb}var inst=create();inst.create=create,_handlebarsNoConflict2.default(inst),inst.default=inst,exports.default=inst,module.exports=exports.default},function(module,exports){"use strict";exports.default=function(obj){if(obj&&obj.__esModule)return obj;var newObj={};if(null!=obj)for(var key in obj)Object.prototype.hasOwnProperty.call(obj,key)&&(newObj[key]=obj[key]);return newObj.default=obj,newObj},exports.__esModule=!0},function(module,exports){"use strict";exports.default=function(obj){return obj&&obj.__esModule?obj:{default:obj}},exports.__esModule=!0},function(module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(2).default;exports.__esModule=!0,exports.HandlebarsEnvironment=HandlebarsEnvironment;var _utils=__webpack_require__(4),_exception2=_interopRequireDefault(__webpack_require__(5)),_helpers=__webpack_require__(9),_decorators=__webpack_require__(17),_logger2=_interopRequireDefault(__webpack_require__(19));exports.VERSION="4.0.12";exports.COMPILER_REVISION=7;exports.REVISION_CHANGES={1:"<= 1.0.rc.2",2:"== 1.0.0-rc.3",3:"== 1.0.0-rc.4",4:"== 1.x.x",5:"== 2.0.0-alpha.x",6:">= 2.0.0-beta.1",7:">= 4.0.0"};function HandlebarsEnvironment(helpers,partials,decorators){this.helpers=helpers||{},this.partials=partials||{},this.decorators=decorators||{},_helpers.registerDefaultHelpers(this),_decorators.registerDefaultDecorators(this)}HandlebarsEnvironment.prototype={constructor:HandlebarsEnvironment,logger:_logger2.default,log:_logger2.default.log,registerHelper:function(name,fn){if("[object Object]"===_utils.toString.call(name)){if(fn)throw new _exception2.default("Arg not supported with multiple helpers");_utils.extend(this.helpers,name)}else this.helpers[name]=fn},unregisterHelper:function(name){delete this.helpers[name]},registerPartial:function(name,partial){if("[object Object]"===_utils.toString.call(name))_utils.extend(this.partials,name);else{if(void 0===partial)throw new _exception2.default('Attempting to register a partial called "'+name+'" as undefined');this.partials[name]=partial}},unregisterPartial:function(name){delete this.partials[name]},registerDecorator:function(name,fn){if("[object Object]"===_utils.toString.call(name)){if(fn)throw new _exception2.default("Arg not supported with multiple decorators");_utils.extend(this.decorators,name)}else this.decorators[name]=fn},unregisterDecorator:function(name){delete this.decorators[name]}};var log=_logger2.default.log;exports.log=log,exports.createFrame=_utils.createFrame,exports.logger=_logger2.default},function(module,exports){"use strict";exports.__esModule=!0,exports.extend=extend,exports.indexOf=function(array,value){for(var i=0,len=array.length;i<len;i++)if(array[i]===value)return i;return-1},exports.escapeExpression=function(string){if("string"!=typeof string){if(string&&string.toHTML)return string.toHTML();if(null==string)return"";if(!string)return string+"";string=""+string}return possible.test(string)?string.replace(badChars,escapeChar):string},exports.isEmpty=function(value){return!value&&0!==value||!(!isArray(value)||0!==value.length)},exports.createFrame=function(object){var frame=extend({},object);return frame._parent=object,frame},exports.blockParams=function(params,ids){return params.path=ids,params},exports.appendContextPath=function(contextPath,id){return(contextPath?contextPath+".":"")+id};var escape={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;","=":"&#x3D;"},badChars=/[&<>"'`=]/g,possible=/[&<>"'`=]/;function escapeChar(chr){return escape[chr]}function extend(obj){for(var i=1;i<arguments.length;i++)for(var key in arguments[i])Object.prototype.hasOwnProperty.call(arguments[i],key)&&(obj[key]=arguments[i][key]);return obj}var toString=Object.prototype.toString;exports.toString=toString;var isFunction=function(value){return"function"==typeof value};isFunction(/x/)&&(exports.isFunction=isFunction=function(value){return"function"==typeof value&&"[object Function]"===toString.call(value)}),exports.isFunction=isFunction;var isArray=Array.isArray||function(value){return!(!value||"object"!=typeof value)&&"[object Array]"===toString.call(value)};exports.isArray=isArray},function(module,exports,__webpack_require__){"use strict";var _Object$defineProperty=__webpack_require__(6).default;exports.__esModule=!0;var errorProps=["description","fileName","lineNumber","message","name","number","stack"];function Exception(message,node){var loc=node&&node.loc,line=void 0,column=void 0;loc&&(message+=" - "+(line=loc.start.line)+":"+(column=loc.start.column));for(var tmp=Error.prototype.constructor.call(this,message),idx=0;idx<errorProps.length;idx++)this[errorProps[idx]]=tmp[errorProps[idx]];Error.captureStackTrace&&Error.captureStackTrace(this,Exception);try{loc&&(this.lineNumber=line,_Object$defineProperty?Object.defineProperty(this,"column",{value:column,enumerable:!0}):this.column=column)}catch(nop){}}Exception.prototype=new Error,exports.default=Exception,module.exports=exports.default},function(module,exports,__webpack_require__){module.exports={default:__webpack_require__(7),__esModule:!0}},function(module,exports,__webpack_require__){var $=__webpack_require__(8);module.exports=function(it,key,desc){return $.setDesc(it,key,desc)}},function(module,exports){var $Object=Object;module.exports={create:$Object.create,getProto:$Object.getPrototypeOf,isEnum:{}.propertyIsEnumerable,getDesc:$Object.getOwnPropertyDescriptor,setDesc:$Object.defineProperty,setDescs:$Object.defineProperties,getKeys:$Object.keys,getNames:$Object.getOwnPropertyNames,getSymbols:$Object.getOwnPropertySymbols,each:[].forEach}},function(module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(2).default;exports.__esModule=!0,exports.registerDefaultHelpers=function(instance){_helpersBlockHelperMissing2.default(instance),_helpersEach2.default(instance),_helpersHelperMissing2.default(instance),_helpersIf2.default(instance),_helpersLog2.default(instance),_helpersLookup2.default(instance),_helpersWith2.default(instance)};var _helpersBlockHelperMissing2=_interopRequireDefault(__webpack_require__(10)),_helpersEach2=_interopRequireDefault(__webpack_require__(11)),_helpersHelperMissing2=_interopRequireDefault(__webpack_require__(12)),_helpersIf2=_interopRequireDefault(__webpack_require__(13)),_helpersLog2=_interopRequireDefault(__webpack_require__(14)),_helpersLookup2=_interopRequireDefault(__webpack_require__(15)),_helpersWith2=_interopRequireDefault(__webpack_require__(16))},function(module,exports,__webpack_require__){"use strict";exports.__esModule=!0;var _utils=__webpack_require__(4);exports.default=function(instance){instance.registerHelper("blockHelperMissing",function(context,options){var inverse=options.inverse,fn=options.fn;if(!0===context)return fn(this);if(!1===context||null==context)return inverse(this);if(_utils.isArray(context))return 0<context.length?(options.ids&&(options.ids=[options.name]),instance.helpers.each(context,options)):inverse(this);if(options.data&&options.ids){var data=_utils.createFrame(options.data);data.contextPath=_utils.appendContextPath(options.data.contextPath,options.name),options={data:data}}return fn(context,options)})},module.exports=exports.default},function(module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(2).default;exports.__esModule=!0;var _utils=__webpack_require__(4),_exception2=_interopRequireDefault(__webpack_require__(5));exports.default=function(instance){instance.registerHelper("each",function(context,options){if(!options)throw new _exception2.default("Must pass iterator to #each");var fn=options.fn,inverse=options.inverse,i=0,ret="",data=void 0,contextPath=void 0;function execIteration(field,index,last){data&&(data.key=field,data.index=index,data.first=0===index,data.last=!!last,contextPath&&(data.contextPath=contextPath+field)),ret+=fn(context[field],{data:data,blockParams:_utils.blockParams([context[field],field],[contextPath+field,null])})}if(options.data&&options.ids&&(contextPath=_utils.appendContextPath(options.data.contextPath,options.ids[0])+"."),_utils.isFunction(context)&&(context=context.call(this)),options.data&&(data=_utils.createFrame(options.data)),context&&"object"==typeof context)if(_utils.isArray(context))for(var j=context.length;i<j;i++)i in context&&execIteration(i,i,i===context.length-1);else{var priorKey=void 0;for(var key in context)context.hasOwnProperty(key)&&(void 0!==priorKey&&execIteration(priorKey,i-1),priorKey=key,i++);void 0!==priorKey&&execIteration(priorKey,i-1,!0)}return 0===i&&(ret=inverse(this)),ret})},module.exports=exports.default},function(module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(2).default;exports.__esModule=!0;var _exception2=_interopRequireDefault(__webpack_require__(5));exports.default=function(instance){instance.registerHelper("helperMissing",function(){if(1!==arguments.length)throw new _exception2.default('Missing helper: "'+arguments[arguments.length-1].name+'"')})},module.exports=exports.default},function(module,exports,__webpack_require__){"use strict";exports.__esModule=!0;var _utils=__webpack_require__(4);exports.default=function(instance){instance.registerHelper("if",function(conditional,options){return _utils.isFunction(conditional)&&(conditional=conditional.call(this)),!options.hash.includeZero&&!conditional||_utils.isEmpty(conditional)?options.inverse(this):options.fn(this)}),instance.registerHelper("unless",function(conditional,options){return instance.helpers.if.call(this,conditional,{fn:options.inverse,inverse:options.fn,hash:options.hash})})},module.exports=exports.default},function(module,exports){"use strict";exports.__esModule=!0,exports.default=function(instance){instance.registerHelper("log",function(){for(var args=[void 0],options=arguments[arguments.length-1],i=0;i<arguments.length-1;i++)args.push(arguments[i]);var level=1;null!=options.hash.level?level=options.hash.level:options.data&&null!=options.data.level&&(level=options.data.level),args[0]=level,instance.log.apply(instance,args)})},module.exports=exports.default},function(module,exports){"use strict";exports.__esModule=!0,exports.default=function(instance){instance.registerHelper("lookup",function(obj,field){return obj&&obj[field]})},module.exports=exports.default},function(module,exports,__webpack_require__){"use strict";exports.__esModule=!0;var _utils=__webpack_require__(4);exports.default=function(instance){instance.registerHelper("with",function(context,options){_utils.isFunction(context)&&(context=context.call(this));var fn=options.fn;if(_utils.isEmpty(context))return options.inverse(this);var data=options.data;return options.data&&options.ids&&((data=_utils.createFrame(options.data)).contextPath=_utils.appendContextPath(options.data.contextPath,options.ids[0])),fn(context,{data:data,blockParams:_utils.blockParams([context],[data&&data.contextPath])})})},module.exports=exports.default},function(module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(2).default;exports.__esModule=!0,exports.registerDefaultDecorators=function(instance){_decoratorsInline2.default(instance)};var _decoratorsInline2=_interopRequireDefault(__webpack_require__(18))},function(module,exports,__webpack_require__){"use strict";exports.__esModule=!0;var _utils=__webpack_require__(4);exports.default=function(instance){instance.registerDecorator("inline",function(fn,props,container,options){var ret=fn;return props.partials||(props.partials={},ret=function(context,options){var original=container.partials;container.partials=_utils.extend({},original,props.partials);var ret=fn(context,options);return container.partials=original,ret}),props.partials[options.args[0]]=options.fn,ret})},module.exports=exports.default},function(module,exports,__webpack_require__){"use strict";exports.__esModule=!0;var _utils=__webpack_require__(4),logger={methodMap:["debug","info","warn","error"],level:"info",lookupLevel:function(level){if("string"==typeof level){var levelMap=_utils.indexOf(logger.methodMap,level.toLowerCase());level=0<=levelMap?levelMap:parseInt(level,10)}return level},log:function(level){if(level=logger.lookupLevel(level),"undefined"!=typeof console&&logger.lookupLevel(logger.level)<=level){var method=logger.methodMap[level];console[method]||(method="log");for(var _len=arguments.length,message=Array(1<_len?_len-1:0),_key=1;_key<_len;_key++)message[_key-1]=arguments[_key];console[method].apply(console,message)}}};exports.default=logger,module.exports=exports.default},function(module,exports){"use strict";function SafeString(string){this.string=string}exports.__esModule=!0,SafeString.prototype.toString=SafeString.prototype.toHTML=function(){return""+this.string},exports.default=SafeString,module.exports=exports.default},function(module,exports,__webpack_require__){"use strict";var _Object$seal=__webpack_require__(22).default,_interopRequireWildcard=__webpack_require__(1).default,_interopRequireDefault=__webpack_require__(2).default;exports.__esModule=!0,exports.checkRevision=function(compilerInfo){var compilerRevision=compilerInfo&&compilerInfo[0]||1,currentRevision=_base.COMPILER_REVISION;if(compilerRevision!==currentRevision){if(compilerRevision<currentRevision){var runtimeVersions=_base.REVISION_CHANGES[currentRevision],compilerVersions=_base.REVISION_CHANGES[compilerRevision];throw new _exception2.default("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").")}throw new _exception2.default("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version ("+compilerInfo[1]+").")}},exports.template=function(templateSpec,env){if(!env)throw new _exception2.default("No environment passed to template");if(!templateSpec||!templateSpec.main)throw new _exception2.default("Unknown template object: "+typeof templateSpec);templateSpec.main.decorator=templateSpec.main_d,env.VM.checkRevision(templateSpec.compiler);var container={strict:function(obj,name){if(!(name in obj))throw new _exception2.default('"'+name+'" not defined in '+obj);return obj[name]},lookup:function(depths,name){for(var len=depths.length,i=0;i<len;i++)if(depths[i]&&null!=depths[i][name])return depths[i][name]},lambda:function(current,context){return"function"==typeof current?current.call(context):current},escapeExpression:Utils.escapeExpression,invokePartial:function(partial,context,options){options.hash&&(context=Utils.extend({},context,options.hash),options.ids&&(options.ids[0]=!0));partial=env.VM.resolvePartial.call(this,partial,context,options);var result=env.VM.invokePartial.call(this,partial,context,options);null==result&&env.compile&&(options.partials[options.name]=env.compile(partial,templateSpec.compilerOptions,env),result=options.partials[options.name](context,options));{if(null==result)throw new _exception2.default("The partial "+options.name+" could not be compiled when running in runtime-only mode");if(options.indent){for(var lines=result.split("\n"),i=0,l=lines.length;i<l&&(lines[i]||i+1!==l);i++)lines[i]=options.indent+lines[i];result=lines.join("\n")}return result}},fn:function(i){var ret=templateSpec[i];return ret.decorator=templateSpec[i+"_d"],ret},programs:[],program:function(i,data,declaredBlockParams,blockParams,depths){var programWrapper=this.programs[i],fn=this.fn(i);return data||depths||blockParams||declaredBlockParams?programWrapper=wrapProgram(this,i,fn,data,declaredBlockParams,blockParams,depths):programWrapper||(programWrapper=this.programs[i]=wrapProgram(this,i,fn)),programWrapper},data:function(value,depth){for(;value&&depth--;)value=value._parent;return value},merge:function(param,common){var obj=param||common;return param&&common&&param!==common&&(obj=Utils.extend({},common,param)),obj},nullContext:_Object$seal({}),noop:env.VM.noop,compilerInfo:templateSpec.compiler};function ret(context){var options=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],data=options.data;ret._setup(options),!options.partial&&templateSpec.useData&&(data=function(context,data){data&&"root"in data||((data=data?_base.createFrame(data):{}).root=context);return data}(context,data));var depths=void 0,blockParams=templateSpec.useBlockParams?[]:void 0;function main(context){return""+templateSpec.main(container,context,container.helpers,container.partials,data,blockParams,depths)}return templateSpec.useDepths&&(depths=options.depths?context!=options.depths[0]?[context].concat(options.depths):options.depths:[context]),(main=executeDecorators(templateSpec.main,main,container,options.depths||[],data,blockParams))(context,options)}return ret.isTop=!0,ret._setup=function(options){options.partial?(container.helpers=options.helpers,container.partials=options.partials,container.decorators=options.decorators):(container.helpers=container.merge(options.helpers,env.helpers),templateSpec.usePartial&&(container.partials=container.merge(options.partials,env.partials)),(templateSpec.usePartial||templateSpec.useDecorators)&&(container.decorators=container.merge(options.decorators,env.decorators)))},ret._child=function(i,data,blockParams,depths){if(templateSpec.useBlockParams&&!blockParams)throw new _exception2.default("must pass block params");if(templateSpec.useDepths&&!depths)throw new _exception2.default("must pass parent depths");return wrapProgram(container,i,templateSpec[i],data,0,blockParams,depths)},ret},exports.wrapProgram=wrapProgram,exports.resolvePartial=function(partial,context,options){partial?partial.call||options.name||(options.name=partial,partial=options.partials[partial]):partial="@partial-block"===options.name?options.data["partial-block"]:options.partials[options.name];return partial},exports.invokePartial=function(partial,context,options){var currentPartialBlock=options.data&&options.data["partial-block"];options.partial=!0,options.ids&&(options.data.contextPath=options.ids[0]||options.data.contextPath);var partialBlock=void 0;options.fn&&options.fn!==noop&&function(){options.data=_base.createFrame(options.data);var fn=options.fn;partialBlock=options.data["partial-block"]=function(context){var options=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];return options.data=_base.createFrame(options.data),options.data["partial-block"]=currentPartialBlock,fn(context,options)},fn.partials&&(options.partials=Utils.extend({},options.partials,fn.partials))}();void 0===partial&&partialBlock&&(partial=partialBlock);{if(void 0===partial)throw new _exception2.default("The partial "+options.name+" could not be found");if(partial instanceof Function)return partial(context,options)}},exports.noop=noop;var Utils=_interopRequireWildcard(__webpack_require__(4)),_exception2=_interopRequireDefault(__webpack_require__(5)),_base=__webpack_require__(3);function wrapProgram(container,i,fn,data,declaredBlockParams,blockParams,depths){function prog(context){var options=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],currentDepths=depths;return!depths||context==depths[0]||context===container.nullContext&&null===depths[0]||(currentDepths=[context].concat(depths)),fn(container,context,container.helpers,container.partials,options.data||data,blockParams&&[options.blockParams].concat(blockParams),currentDepths)}return(prog=executeDecorators(fn,prog,container,depths,data,blockParams)).program=i,prog.depth=depths?depths.length:0,prog.blockParams=declaredBlockParams||0,prog}function noop(){return""}function executeDecorators(fn,prog,container,depths,data,blockParams){if(fn.decorator){var props={};prog=fn.decorator(prog,props,container,depths&&depths[0],data,blockParams,depths),Utils.extend(prog,props)}return prog}},function(module,exports,__webpack_require__){module.exports={default:__webpack_require__(23),__esModule:!0}},function(module,exports,__webpack_require__){__webpack_require__(24),module.exports=__webpack_require__(29).Object.seal},function(module,exports,__webpack_require__){var isObject=__webpack_require__(25);__webpack_require__(26)("seal",function($seal){return function(it){return $seal&&isObject(it)?$seal(it):it}})},function(module,exports){module.exports=function(it){return"object"==typeof it?null!==it:"function"==typeof it}},function(module,exports,__webpack_require__){var $export=__webpack_require__(27),core=__webpack_require__(29),fails=__webpack_require__(32);module.exports=function(KEY,exec){var fn=(core.Object||{})[KEY]||Object[KEY],exp={};exp[KEY]=exec(fn),$export($export.S+$export.F*fails(function(){fn(1)}),"Object",exp)}},function(module,exports,__webpack_require__){var global=__webpack_require__(28),core=__webpack_require__(29),ctx=__webpack_require__(30),$export=function(type,name,source){var key,own,out,IS_FORCED=type&$export.F,IS_GLOBAL=type&$export.G,IS_STATIC=type&$export.S,IS_PROTO=type&$export.P,IS_BIND=type&$export.B,IS_WRAP=type&$export.W,exports=IS_GLOBAL?core:core[name]||(core[name]={}),target=IS_GLOBAL?global:IS_STATIC?global[name]:(global[name]||{}).prototype;for(key in IS_GLOBAL&&(source=name),source)(own=!IS_FORCED&&target&&key in target)&&key in exports||(out=own?target[key]:source[key],exports[key]=IS_GLOBAL&&"function"!=typeof target[key]?source[key]:IS_BIND&&own?ctx(out,global):IS_WRAP&&target[key]==out?function(C){var F=function(param){return this instanceof C?new C(param):C(param)};return F.prototype=C.prototype,F}(out):IS_PROTO&&"function"==typeof out?ctx(Function.call,out):out,IS_PROTO&&((exports.prototype||(exports.prototype={}))[key]=out))};$export.F=1,$export.G=2,$export.S=4,$export.P=8,$export.B=16,$export.W=32,module.exports=$export},function(module,exports){var global=module.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=global)},function(module,exports){var core=module.exports={version:"1.2.6"};"number"==typeof __e&&(__e=core)},function(module,exports,__webpack_require__){var aFunction=__webpack_require__(31);module.exports=function(fn,that,length){if(aFunction(fn),void 0===that)return fn;switch(length){case 1:return function(a){return fn.call(that,a)};case 2:return function(a,b){return fn.call(that,a,b)};case 3:return function(a,b,c){return fn.call(that,a,b,c)}}return function(){return fn.apply(that,arguments)}}},function(module,exports){module.exports=function(it){if("function"!=typeof it)throw TypeError(it+" is not a function!");return it}},function(module,exports){module.exports=function(exec){try{return!!exec()}catch(e){return!0}}},function(module,exports){(function(global){"use strict";exports.__esModule=!0,exports.default=function(Handlebars){var root=void 0!==global?global:window,$Handlebars=root.Handlebars;Handlebars.noConflict=function(){return root.Handlebars===Handlebars&&(root.Handlebars=$Handlebars),Handlebars}},module.exports=exports.default}).call(exports,function(){return this}())}])});/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 2.1.0
 * Copyright (C) 2017 Oliver Nightingale
 * @license MIT
 */

;(function(){

/**
 * A convenience function for configuring and constructing
 * a new lunr Index.
 *
 * A lunr.Builder instance is created and the pipeline setup
 * with a trimmer, stop word filter and stemmer.
 *
 * This builder object is yielded to the configuration function
 * that is passed as a parameter, allowing the list of fields
 * and other builder parameters to be customised.
 *
 * All documents _must_ be added within the passed config function.
 *
 * @example
 * var idx = lunr(function () {
 *   this.field('title')
 *   this.field('body')
 *   this.ref('id')
 *
 *   documents.forEach(function (doc) {
 *     this.add(doc)
 *   }, this)
 * })
 *
 * @see {@link lunr.Builder}
 * @see {@link lunr.Pipeline}
 * @see {@link lunr.trimmer}
 * @see {@link lunr.stopWordFilter}
 * @see {@link lunr.stemmer}
 * @namespace {function} lunr
 */
var lunr = function (config) {
  var builder = new lunr.Builder

  builder.pipeline.add(
    lunr.trimmer,
    lunr.stopWordFilter,
    lunr.stemmer
  )

  builder.searchPipeline.add(
    lunr.stemmer
  )

  config.call(builder, builder)
  return builder.build()
}

lunr.version = "2.1.0"
/*!
 * lunr.utils
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * A namespace containing utils for the rest of the lunr library
 */
lunr.utils = {}

/**
 * Print a warning message to the console.
 *
 * @param {String} message The message to be printed.
 * @memberOf Utils
 */
lunr.utils.warn = (function (global) {
  /* eslint-disable no-console */
  return function (message) {
    if (global.console && console.warn) {
      console.warn(message)
    }
  }
  /* eslint-enable no-console */
})(this)

/**
 * Convert an object to a string.
 *
 * In the case of `null` and `undefined` the function returns
 * the empty string, in all other cases the result of calling
 * `toString` on the passed object is returned.
 *
 * @param {Any} obj The object to convert to a string.
 * @return {String} string representation of the passed object.
 * @memberOf Utils
 */
lunr.utils.asString = function (obj) {
  if (obj === void 0 || obj === null) {
    return ""
  } else {
    return obj.toString()
  }
}
lunr.FieldRef = function (docRef, fieldName) {
  this.docRef = docRef
  this.fieldName = fieldName
  this._stringValue = fieldName + lunr.FieldRef.joiner + docRef
}

lunr.FieldRef.joiner = "/"

lunr.FieldRef.fromString = function (s) {
  var n = s.indexOf(lunr.FieldRef.joiner)

  if (n === -1) {
    throw "malformed field ref string"
  }

  var fieldRef = s.slice(0, n),
      docRef = s.slice(n + 1)

  return new lunr.FieldRef (docRef, fieldRef)
}

lunr.FieldRef.prototype.toString = function () {
  return this._stringValue
}
/**
 * A function to calculate the inverse document frequency for
 * a posting. This is shared between the builder and the index
 *
 * @private
 * @param {object} posting - The posting for a given term
 * @param {number} documentCount - The total number of documents.
 */
lunr.idf = function (posting, documentCount) {
  var documentsWithTerm = 0

  for (var fieldName in posting) {
    if (fieldName == '_index') continue // Ignore the term index, its not a field
    documentsWithTerm += Object.keys(posting[fieldName]).length
  }

  var x = (documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5)

  return Math.log(1 + Math.abs(x))
}

/**
 * A token wraps a string representation of a token
 * as it is passed through the text processing pipeline.
 *
 * @constructor
 * @param {string} [str=''] - The string token being wrapped.
 * @param {object} [metadata={}] - Metadata associated with this token.
 */
lunr.Token = function (str, metadata) {
  this.str = str || ""
  this.metadata = metadata || {}
}

/**
 * Returns the token string that is being wrapped by this object.
 *
 * @returns {string}
 */
lunr.Token.prototype.toString = function () {
  return this.str
}

/**
 * A token update function is used when updating or optionally
 * when cloning a token.
 *
 * @callback lunr.Token~updateFunction
 * @param {string} str - The string representation of the token.
 * @param {Object} metadata - All metadata associated with this token.
 */

/**
 * Applies the given function to the wrapped string token.
 *
 * @example
 * token.update(function (str, metadata) {
 *   return str.toUpperCase()
 * })
 *
 * @param {lunr.Token~updateFunction} fn - A function to apply to the token string.
 * @returns {lunr.Token}
 */
lunr.Token.prototype.update = function (fn) {
  this.str = fn(this.str, this.metadata)
  return this
}

/**
 * Creates a clone of this token. Optionally a function can be
 * applied to the cloned token.
 *
 * @param {lunr.Token~updateFunction} [fn] - An optional function to apply to the cloned token.
 * @returns {lunr.Token}
 */
lunr.Token.prototype.clone = function (fn) {
  fn = fn || function (s) { return s }
  return new lunr.Token (fn(this.str, this.metadata), this.metadata)
}
/*!
 * lunr.tokenizer
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index. Uses `lunr.tokenizer.separator` to split strings, change
 * the value of this property to change how strings are split into tokens.
 *
 * This tokenizer will convert its parameter to a string by calling `toString` and
 * then will split this string on the character in `lunr.tokenizer.separator`.
 * Arrays will have their elements converted to strings and wrapped in a lunr.Token.
 *
 * @static
 * @param {?(string|object|object[])} obj - The object to convert into tokens
 * @returns {lunr.Token[]}
 */
lunr.tokenizer = function (obj) {
  if (obj == null || obj == undefined) {
    return []
  }

  if (Array.isArray(obj)) {
    return obj.map(function (t) {
      return new lunr.Token(lunr.utils.asString(t).toLowerCase())
    })
  }

  var str = obj.toString().trim().toLowerCase(),
      len = str.length,
      tokens = []

  for (var sliceEnd = 0, sliceStart = 0; sliceEnd <= len; sliceEnd++) {
    var char = str.charAt(sliceEnd),
        sliceLength = sliceEnd - sliceStart

    if ((char.match(lunr.tokenizer.separator) || sliceEnd == len)) {

      if (sliceLength > 0) {
        tokens.push(
          new lunr.Token (str.slice(sliceStart, sliceEnd), {
            position: [sliceStart, sliceLength],
            index: tokens.length
          })
        )
      }

      sliceStart = sliceEnd + 1
    }

  }

  return tokens
}

/**
 * The separator used to split a string into tokens. Override this property to change the behaviour of
 * `lunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
 *
 * @static
 * @see lunr.tokenizer
 */
lunr.tokenizer.separator = /[\s\-]+/
/*!
 * lunr.Pipeline
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * lunr.Pipelines maintain an ordered list of functions to be applied to all
 * tokens in documents entering the search index and queries being ran against
 * the index.
 *
 * An instance of lunr.Index created with the lunr shortcut will contain a
 * pipeline with a stop word filter and an English language stemmer. Extra
 * functions can be added before or after either of these functions or these
 * default functions can be removed.
 *
 * When run the pipeline will call each function in turn, passing a token, the
 * index of that token in the original list of all tokens and finally a list of
 * all the original tokens.
 *
 * The output of functions in the pipeline will be passed to the next function
 * in the pipeline. To exclude a token from entering the index the function
 * should return undefined, the rest of the pipeline will not be called with
 * this token.
 *
 * For serialisation of pipelines to work, all functions used in an instance of
 * a pipeline should be registered with lunr.Pipeline. Registered functions can
 * then be loaded. If trying to load a serialised pipeline that uses functions
 * that are not registered an error will be thrown.
 *
 * If not planning on serialising the pipeline then registering pipeline functions
 * is not necessary.
 *
 * @constructor
 */
lunr.Pipeline = function () {
  this._stack = []
}

lunr.Pipeline.registeredFunctions = Object.create(null)

/**
 * A pipeline function maps lunr.Token to lunr.Token. A lunr.Token contains the token
 * string as well as all known metadata. A pipeline function can mutate the token string
 * or mutate (or add) metadata for a given token.
 *
 * A pipeline function can indicate that the passed token should be discarded by returning
 * null. This token will not be passed to any downstream pipeline functions and will not be
 * added to the index.
 *
 * Multiple tokens can be returned by returning an array of tokens. Each token will be passed
 * to any downstream pipeline functions and all will returned tokens will be added to the index.
 *
 * Any number of pipeline functions may be chained together using a lunr.Pipeline.
 *
 * @interface lunr.PipelineFunction
 * @param {lunr.Token} token - A token from the document being processed.
 * @param {number} i - The index of this token in the complete list of tokens for this document/field.
 * @param {lunr.Token[]} tokens - All tokens for this document/field.
 * @returns {(?lunr.Token|lunr.Token[])}
 */

/**
 * Register a function with the pipeline.
 *
 * Functions that are used in the pipeline should be registered if the pipeline
 * needs to be serialised, or a serialised pipeline needs to be loaded.
 *
 * Registering a function does not add it to a pipeline, functions must still be
 * added to instances of the pipeline for them to be used when running a pipeline.
 *
 * @param {lunr.PipelineFunction} fn - The function to check for.
 * @param {String} label - The label to register this function with
 */
lunr.Pipeline.registerFunction = function (fn, label) {
  if (label in this.registeredFunctions) {
    lunr.utils.warn('Overwriting existing registered function: ' + label)
  }

  fn.label = label
  lunr.Pipeline.registeredFunctions[fn.label] = fn
}

/**
 * Warns if the function is not registered as a Pipeline function.
 *
 * @param {lunr.PipelineFunction} fn - The function to check for.
 * @private
 */
lunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {
  var isRegistered = fn.label && (fn.label in this.registeredFunctions)

  if (!isRegistered) {
    lunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n', fn)
  }
}

/**
 * Loads a previously serialised pipeline.
 *
 * All functions to be loaded must already be registered with lunr.Pipeline.
 * If any function from the serialised data has not been registered then an
 * error will be thrown.
 *
 * @param {Object} serialised - The serialised pipeline to load.
 * @returns {lunr.Pipeline}
 */
lunr.Pipeline.load = function (serialised) {
  var pipeline = new lunr.Pipeline

  serialised.forEach(function (fnName) {
    var fn = lunr.Pipeline.registeredFunctions[fnName]

    if (fn) {
      pipeline.add(fn)
    } else {
      throw new Error('Cannot load unregistered function: ' + fnName)
    }
  })

  return pipeline
}

/**
 * Adds new functions to the end of the pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction[]} functions - Any number of functions to add to the pipeline.
 */
lunr.Pipeline.prototype.add = function () {
  var fns = Array.prototype.slice.call(arguments)

  fns.forEach(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)
    this._stack.push(fn)
  }, this)
}

/**
 * Adds a single function after a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
 * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
 */
lunr.Pipeline.prototype.after = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn)
  if (pos == -1) {
    throw new Error('Cannot find existingFn')
  }

  pos = pos + 1
  this._stack.splice(pos, 0, newFn)
}

/**
 * Adds a single function before a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
 * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
 */
lunr.Pipeline.prototype.before = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn)
  if (pos == -1) {
    throw new Error('Cannot find existingFn')
  }

  this._stack.splice(pos, 0, newFn)
}

/**
 * Removes a function from the pipeline.
 *
 * @param {lunr.PipelineFunction} fn The function to remove from the pipeline.
 */
lunr.Pipeline.prototype.remove = function (fn) {
  var pos = this._stack.indexOf(fn)
  if (pos == -1) {
    return
  }

  this._stack.splice(pos, 1)
}

/**
 * Runs the current list of functions that make up the pipeline against the
 * passed tokens.
 *
 * @param {Array} tokens The tokens to run through the pipeline.
 * @returns {Array}
 */
lunr.Pipeline.prototype.run = function (tokens) {
  var stackLength = this._stack.length

  for (var i = 0; i < stackLength; i++) {
    var fn = this._stack[i]

    tokens = tokens.reduce(function (memo, token, j) {
      var result = fn(token, j, tokens)

      if (result === void 0 || result === '') return memo

      return memo.concat(result)
    }, [])
  }

  return tokens
}

/**
 * Convenience method for passing a string through a pipeline and getting
 * strings out. This method takes care of wrapping the passed string in a
 * token and mapping the resulting tokens back to strings.
 *
 * @param {string} str - The string to pass through the pipeline.
 * @returns {string[]}
 */
lunr.Pipeline.prototype.runString = function (str) {
  var token = new lunr.Token (str)

  return this.run([token]).map(function (t) {
    return t.toString()
  })
}

/**
 * Resets the pipeline by removing any existing processors.
 *
 */
lunr.Pipeline.prototype.reset = function () {
  this._stack = []
}

/**
 * Returns a representation of the pipeline ready for serialisation.
 *
 * Logs a warning if the function has not been registered.
 *
 * @returns {Array}
 */
lunr.Pipeline.prototype.toJSON = function () {
  return this._stack.map(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)

    return fn.label
  })
}
/*!
 * lunr.Vector
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * A vector is used to construct the vector space of documents and queries. These
 * vectors support operations to determine the similarity between two documents or
 * a document and a query.
 *
 * Normally no parameters are required for initializing a vector, but in the case of
 * loading a previously dumped vector the raw elements can be provided to the constructor.
 *
 * For performance reasons vectors are implemented with a flat array, where an elements
 * index is immediately followed by its value. E.g. [index, value, index, value]. This
 * allows the underlying array to be as sparse as possible and still offer decent
 * performance when being used for vector calculations.
 *
 * @constructor
 * @param {Number[]} [elements] - The flat list of element index and element value pairs.
 */
lunr.Vector = function (elements) {
  this._magnitude = 0
  this.elements = elements || []
}


/**
 * Calculates the position within the vector to insert a given index.
 *
 * This is used internally by insert and upsert. If there are duplicate indexes then
 * the position is returned as if the value for that index were to be updated, but it
 * is the callers responsibility to check whether there is a duplicate at that index
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @returns {Number}
 */
lunr.Vector.prototype.positionForIndex = function (index) {
  // For an empty vector the tuple can be inserted at the beginning
  if (this.elements.length == 0) {
    return 0
  }

  var start = 0,
      end = this.elements.length / 2,
      sliceLength = end - start,
      pivotPoint = Math.floor(sliceLength / 2),
      pivotIndex = this.elements[pivotPoint * 2]

  while (sliceLength > 1) {
    if (pivotIndex < index) {
      start = pivotPoint
    }

    if (pivotIndex > index) {
      end = pivotPoint
    }

    if (pivotIndex == index) {
      break
    }

    sliceLength = end - start
    pivotPoint = start + Math.floor(sliceLength / 2)
    pivotIndex = this.elements[pivotPoint * 2]
  }

  if (pivotIndex == index) {
    return pivotPoint * 2
  }

  if (pivotIndex > index) {
    return pivotPoint * 2
  }

  if (pivotIndex < index) {
    return (pivotPoint + 1) * 2
  }
}

/**
 * Inserts an element at an index within the vector.
 *
 * Does not allow duplicates, will throw an error if there is already an entry
 * for this index.
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @param {Number} val - The value to be inserted into the vector.
 */
lunr.Vector.prototype.insert = function (insertIdx, val) {
  this.upsert(insertIdx, val, function () {
    throw "duplicate index"
  })
}

/**
 * Inserts or updates an existing index within the vector.
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @param {Number} val - The value to be inserted into the vector.
 * @param {function} fn - A function that is called for updates, the existing value and the
 * requested value are passed as arguments
 */
lunr.Vector.prototype.upsert = function (insertIdx, val, fn) {
  this._magnitude = 0
  var position = this.positionForIndex(insertIdx)

  if (this.elements[position] == insertIdx) {
    this.elements[position + 1] = fn(this.elements[position + 1], val)
  } else {
    this.elements.splice(position, 0, insertIdx, val)
  }
}

/**
 * Calculates the magnitude of this vector.
 *
 * @returns {Number}
 */
lunr.Vector.prototype.magnitude = function () {
  if (this._magnitude) return this._magnitude

  var sumOfSquares = 0,
      elementsLength = this.elements.length

  for (var i = 1; i < elementsLength; i += 2) {
    var val = this.elements[i]
    sumOfSquares += val * val
  }

  return this._magnitude = Math.sqrt(sumOfSquares)
}

/**
 * Calculates the dot product of this vector and another vector.
 *
 * @param {lunr.Vector} otherVector - The vector to compute the dot product with.
 * @returns {Number}
 */
lunr.Vector.prototype.dot = function (otherVector) {
  var dotProduct = 0,
      a = this.elements, b = otherVector.elements,
      aLen = a.length, bLen = b.length,
      aVal = 0, bVal = 0,
      i = 0, j = 0

  while (i < aLen && j < bLen) {
    aVal = a[i], bVal = b[j]
    if (aVal < bVal) {
      i += 2
    } else if (aVal > bVal) {
      j += 2
    } else if (aVal == bVal) {
      dotProduct += a[i + 1] * b[j + 1]
      i += 2
      j += 2
    }
  }

  return dotProduct
}

/**
 * Calculates the cosine similarity between this vector and another
 * vector.
 *
 * @param {lunr.Vector} otherVector - The other vector to calculate the
 * similarity with.
 * @returns {Number}
 */
lunr.Vector.prototype.similarity = function (otherVector) {
  return this.dot(otherVector) / (this.magnitude() * otherVector.magnitude())
}

/**
 * Converts the vector to an array of the elements within the vector.
 *
 * @returns {Number[]}
 */
lunr.Vector.prototype.toArray = function () {
  var output = new Array (this.elements.length / 2)

  for (var i = 1, j = 0; i < this.elements.length; i += 2, j++) {
    output[j] = this.elements[i]
  }

  return output
}

/**
 * A JSON serializable representation of the vector.
 *
 * @returns {Number[]}
 */
lunr.Vector.prototype.toJSON = function () {
  return this.elements
}
/* eslint-disable */
/*!
 * lunr.stemmer
 * Copyright (C) 2017 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * lunr.stemmer is an english language stemmer, this is a JavaScript
 * implementation of the PorterStemmer taken from http://tartarus.org/~martin
 *
 * @static
 * @implements {lunr.PipelineFunction}
 * @param {lunr.Token} token - The string to stem
 * @returns {lunr.Token}
 * @see {@link lunr.Pipeline}
 */
lunr.stemmer = (function(){
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    },

    step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  var re_mgr0 = new RegExp(mgr0);
  var re_mgr1 = new RegExp(mgr1);
  var re_meq1 = new RegExp(meq1);
  var re_s_v = new RegExp(s_v);

  var re_1a = /^(.+?)(ss|i)es$/;
  var re2_1a = /^(.+?)([^s])s$/;
  var re_1b = /^(.+?)eed$/;
  var re2_1b = /^(.+?)(ed|ing)$/;
  var re_1b_2 = /.$/;
  var re2_1b_2 = /(at|bl|iz)$/;
  var re3_1b_2 = new RegExp("([^aeiouylsz])\\1$");
  var re4_1b_2 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var re_1c = /^(.+?[^aeiou])y$/;
  var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;

  var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;

  var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
  var re2_4 = /^(.+?)(s|t)(ion)$/;

  var re_5 = /^(.+?)e$/;
  var re_5_1 = /ll$/;
  var re3_5 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var porterStemmer = function porterStemmer(w) {
    var stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4;

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = re_1a
    re2 = re2_1a;

    if (re.test(w)) { w = w.replace(re,"$1$2"); }
    else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }

    // Step 1b
    re = re_1b;
    re2 = re2_1b;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = re_mgr0;
      if (re.test(fp[1])) {
        re = re_1b_2;
        w = w.replace(re,"");
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = re_s_v;
      if (re2.test(stem)) {
        w = stem;
        re2 = re2_1b_2;
        re3 = re3_1b_2;
        re4 = re4_1b_2;
        if (re2.test(w)) { w = w + "e"; }
        else if (re3.test(w)) { re = re_1b_2; w = w.replace(re,""); }
        else if (re4.test(w)) { w = w + "e"; }
      }
    }

    // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)
    re = re_1c;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      w = stem + "i";
    }

    // Step 2
    re = re_2;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step2list[suffix];
      }
    }

    // Step 3
    re = re_3;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step3list[suffix];
      }
    }

    // Step 4
    re = re_4;
    re2 = re2_4;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      if (re.test(stem)) {
        w = stem;
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = re_mgr1;
      if (re2.test(stem)) {
        w = stem;
      }
    }

    // Step 5
    re = re_5;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      re2 = re_meq1;
      re3 = re3_5;
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
      }
    }

    re = re_5_1;
    re2 = re_mgr1;
    if (re.test(w) && re2.test(w)) {
      re = re_1b_2;
      w = w.replace(re,"");
    }

    // and turn initial Y back to y

    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }

    return w;
  };

  return function (token) {
    return token.update(porterStemmer);
  }
})();

lunr.Pipeline.registerFunction(lunr.stemmer, 'stemmer')
/*!
 * lunr.stopWordFilter
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * lunr.generateStopWordFilter builds a stopWordFilter function from the provided
 * list of stop words.
 *
 * The built in lunr.stopWordFilter is built using this generator and can be used
 * to generate custom stopWordFilters for applications or non English languages.
 *
 * @param {Array} token The token to pass through the filter
 * @returns {lunr.PipelineFunction}
 * @see lunr.Pipeline
 * @see lunr.stopWordFilter
 */
lunr.generateStopWordFilter = function (stopWords) {
  var words = stopWords.reduce(function (memo, stopWord) {
    memo[stopWord] = stopWord
    return memo
  }, {})

  return function (token) {
    if (token && words[token.toString()] !== token.toString()) return token
  }
}

/**
 * lunr.stopWordFilter is an English language stop word list filter, any words
 * contained in the list will not be passed through the filter.
 *
 * This is intended to be used in the Pipeline. If the token does not pass the
 * filter then undefined will be returned.
 *
 * @implements {lunr.PipelineFunction}
 * @params {lunr.Token} token - A token to check for being a stop word.
 * @returns {lunr.Token}
 * @see {@link lunr.Pipeline}
 */
lunr.stopWordFilter = lunr.generateStopWordFilter([
  'a',
  'able',
  'about',
  'across',
  'after',
  'all',
  'almost',
  'also',
  'am',
  'among',
  'an',
  'and',
  'any',
  'are',
  'as',
  'at',
  'be',
  'because',
  'been',
  'but',
  'by',
  'can',
  'cannot',
  'could',
  'dear',
  'did',
  'do',
  'does',
  'either',
  'else',
  'ever',
  'every',
  'for',
  'from',
  'get',
  'got',
  'had',
  'has',
  'have',
  'he',
  'her',
  'hers',
  'him',
  'his',
  'how',
  'however',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'just',
  'least',
  'let',
  'like',
  'likely',
  'may',
  'me',
  'might',
  'most',
  'must',
  'my',
  'neither',
  'no',
  'nor',
  'not',
  'of',
  'off',
  'often',
  'on',
  'only',
  'or',
  'other',
  'our',
  'own',
  'rather',
  'said',
  'say',
  'says',
  'she',
  'should',
  'since',
  'so',
  'some',
  'than',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'tis',
  'to',
  'too',
  'twas',
  'us',
  'wants',
  'was',
  'we',
  'were',
  'what',
  'when',
  'where',
  'which',
  'while',
  'who',
  'whom',
  'why',
  'will',
  'with',
  'would',
  'yet',
  'you',
  'your'
])

lunr.Pipeline.registerFunction(lunr.stopWordFilter, 'stopWordFilter')
/*!
 * lunr.trimmer
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * lunr.trimmer is a pipeline function for trimming non word
 * characters from the beginning and end of tokens before they
 * enter the index.
 *
 * This implementation may not work correctly for non latin
 * characters and should either be removed or adapted for use
 * with languages with non-latin characters.
 *
 * @static
 * @implements {lunr.PipelineFunction}
 * @param {lunr.Token} token The token to pass through the filter
 * @returns {lunr.Token}
 * @see lunr.Pipeline
 */
lunr.trimmer = function (token) {
  return token.update(function (s) {
    return s.replace(/^\W+/, '').replace(/\W+$/, '')
  })
}

lunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer')
/*!
 * lunr.TokenSet
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * A token set is used to store the unique list of all tokens
 * within an index. Token sets are also used to represent an
 * incoming query to the index, this query token set and index
 * token set are then intersected to find which tokens to look
 * up in the inverted index.
 *
 * A token set can hold multiple tokens, as in the case of the
 * index token set, or it can hold a single token as in the
 * case of a simple query token set.
 *
 * Additionally token sets are used to perform wildcard matching.
 * Leading, contained and trailing wildcards are supported, and
 * from this edit distance matching can also be provided.
 *
 * Token sets are implemented as a minimal finite state automata,
 * where both common prefixes and suffixes are shared between tokens.
 * This helps to reduce the space used for storing the token set.
 *
 * @constructor
 */
lunr.TokenSet = function () {
  this.final = false
  this.edges = {}
  this.id = lunr.TokenSet._nextId
  lunr.TokenSet._nextId += 1
}

/**
 * Keeps track of the next, auto increment, identifier to assign
 * to a new tokenSet.
 *
 * TokenSets require a unique identifier to be correctly minimised.
 *
 * @private
 */
lunr.TokenSet._nextId = 1

/**
 * Creates a TokenSet instance from the given sorted array of words.
 *
 * @param {String[]} arr - A sorted array of strings to create the set from.
 * @returns {lunr.TokenSet}
 * @throws Will throw an error if the input array is not sorted.
 */
lunr.TokenSet.fromArray = function (arr) {
  var builder = new lunr.TokenSet.Builder

  for (var i = 0, len = arr.length; i < len; i++) {
    builder.insert(arr[i])
  }

  builder.finish()
  return builder.root
}

/**
 * Creates a token set from a query clause.
 *
 * @private
 * @param {Object} clause - A single clause from lunr.Query.
 * @param {string} clause.term - The query clause term.
 * @param {number} [clause.editDistance] - The optional edit distance for the term.
 * @returns {lunr.TokenSet}
 */
lunr.TokenSet.fromClause = function (clause) {
  if ('editDistance' in clause) {
    return lunr.TokenSet.fromFuzzyString(clause.term, clause.editDistance)
  } else {
    return lunr.TokenSet.fromString(clause.term)
  }
}

/**
 * Creates a token set representing a single string with a specified
 * edit distance.
 *
 * Insertions, deletions, substitutions and transpositions are each
 * treated as an edit distance of 1.
 *
 * Increasing the allowed edit distance will have a dramatic impact
 * on the performance of both creating and intersecting these TokenSets.
 * It is advised to keep the edit distance less than 3.
 *
 * @param {string} str - The string to create the token set from.
 * @param {number} editDistance - The allowed edit distance to match.
 * @returns {lunr.Vector}
 */
lunr.TokenSet.fromFuzzyString = function (str, editDistance) {
  var root = new lunr.TokenSet

  var stack = [{
    node: root,
    editsRemaining: editDistance,
    str: str
  }]

  while (stack.length) {
    var frame = stack.pop()

    // no edit
    if (frame.str.length > 0) {
      var char = frame.str.charAt(0),
          noEditNode

      if (char in frame.node.edges) {
        noEditNode = frame.node.edges[char]
      } else {
        noEditNode = new lunr.TokenSet
        frame.node.edges[char] = noEditNode
      }

      if (frame.str.length == 1) {
        noEditNode.final = true
      } else {
        stack.push({
          node: noEditNode,
          editsRemaining: frame.editsRemaining,
          str: frame.str.slice(1)
        })
      }
    }

    // deletion
    // can only do a deletion if we have enough edits remaining
    // and if there are characters left to delete in the string
    if (frame.editsRemaining > 0 && frame.str.length > 1) {
      var char = frame.str.charAt(1),
          deletionNode

      if (char in frame.node.edges) {
        deletionNode = frame.node.edges[char]
      } else {
        deletionNode = new lunr.TokenSet
        frame.node.edges[char] = deletionNode
      }

      if (frame.str.length <= 2) {
        deletionNode.final = true
      } else {
        stack.push({
          node: deletionNode,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str.slice(2)
        })
      }
    }

    // deletion
    // just removing the last character from the str
    if (frame.editsRemaining > 0 && frame.str.length == 1) {
      frame.node.final = true
    }

    // substitution
    // can only do a substitution if we have enough edits remaining
    // and if there are characters left to substitute
    if (frame.editsRemaining > 0 && frame.str.length >= 1) {
      if ("*" in frame.node.edges) {
        var substitutionNode = frame.node.edges["*"]
      } else {
        var substitutionNode = new lunr.TokenSet
        frame.node.edges["*"] = substitutionNode
      }

      if (frame.str.length == 1) {
        substitutionNode.final = true
      } else {
        stack.push({
          node: substitutionNode,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str.slice(1)
        })
      }
    }

    // insertion
    // can only do insertion if there are edits remaining
    if (frame.editsRemaining > 0) {
      if ("*" in frame.node.edges) {
        var insertionNode = frame.node.edges["*"]
      } else {
        var insertionNode = new lunr.TokenSet
        frame.node.edges["*"] = insertionNode
      }

      if (frame.str.length == 0) {
        insertionNode.final = true
      } else {
        stack.push({
          node: insertionNode,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str
        })
      }
    }

    // transposition
    // can only do a transposition if there are edits remaining
    // and there are enough characters to transpose
    if (frame.editsRemaining > 0 && frame.str.length > 1) {
      var charA = frame.str.charAt(0),
          charB = frame.str.charAt(1),
          transposeNode

      if (charB in frame.node.edges) {
        transposeNode = frame.node.edges[charB]
      } else {
        transposeNode = new lunr.TokenSet
        frame.node.edges[charB] = transposeNode
      }

      if (frame.str.length == 1) {
        transposeNode.final = true
      } else {
        stack.push({
          node: transposeNode,
          editsRemaining: frame.editsRemaining - 1,
          str: charA + frame.str.slice(2)
        })
      }
    }
  }

  return root
}

/**
 * Creates a TokenSet from a string.
 *
 * The string may contain one or more wildcard characters (*)
 * that will allow wildcard matching when intersecting with
 * another TokenSet.
 *
 * @param {string} str - The string to create a TokenSet from.
 * @returns {lunr.TokenSet}
 */
lunr.TokenSet.fromString = function (str) {
  var node = new lunr.TokenSet,
      root = node,
      wildcardFound = false

  /*
   * Iterates through all characters within the passed string
   * appending a node for each character.
   *
   * As soon as a wildcard character is found then a self
   * referencing edge is introduced to continually match
   * any number of any characters.
   */
  for (var i = 0, len = str.length; i < len; i++) {
    var char = str[i],
        final = (i == len - 1)

    if (char == "*") {
      wildcardFound = true
      node.edges[char] = node
      node.final = final

    } else {
      var next = new lunr.TokenSet
      next.final = final

      node.edges[char] = next
      node = next

      // TODO: is this needed anymore?
      if (wildcardFound) {
        node.edges["*"] = root
      }
    }
  }

  return root
}

/**
 * Converts this TokenSet into an array of strings
 * contained within the TokenSet.
 *
 * @returns {string[]}
 */
lunr.TokenSet.prototype.toArray = function () {
  var words = []

  var stack = [{
    prefix: "",
    node: this
  }]

  while (stack.length) {
    var frame = stack.pop(),
        edges = Object.keys(frame.node.edges),
        len = edges.length

    if (frame.node.final) {
      words.push(frame.prefix)
    }

    for (var i = 0; i < len; i++) {
      var edge = edges[i]

      stack.push({
        prefix: frame.prefix.concat(edge),
        node: frame.node.edges[edge]
      })
    }
  }

  return words
}

/**
 * Generates a string representation of a TokenSet.
 *
 * This is intended to allow TokenSets to be used as keys
 * in objects, largely to aid the construction and minimisation
 * of a TokenSet. As such it is not designed to be a human
 * friendly representation of the TokenSet.
 *
 * @returns {string}
 */
lunr.TokenSet.prototype.toString = function () {
  // NOTE: Using Object.keys here as this.edges is very likely
  // to enter 'hash-mode' with many keys being added
  //
  // avoiding a for-in loop here as it leads to the function
  // being de-optimised (at least in V8). From some simple
  // benchmarks the performance is comparable, but allowing
  // V8 to optimize may mean easy performance wins in the future.

  if (this._str) {
    return this._str
  }

  var str = this.final ? '1' : '0',
      labels = Object.keys(this.edges).sort(),
      len = labels.length

  for (var i = 0; i < len; i++) {
    var label = labels[i],
        node = this.edges[label]

    str = str + label + node.id
  }

  return str
}

/**
 * Returns a new TokenSet that is the intersection of
 * this TokenSet and the passed TokenSet.
 *
 * This intersection will take into account any wildcards
 * contained within the TokenSet.
 *
 * @param {lunr.TokenSet} b - An other TokenSet to intersect with.
 * @returns {lunr.TokenSet}
 */
lunr.TokenSet.prototype.intersect = function (b) {
  var output = new lunr.TokenSet,
      frame = undefined

  var stack = [{
    qNode: b,
    output: output,
    node: this
  }]

  while (stack.length) {
    frame = stack.pop()

    // NOTE: As with the #toString method, we are using
    // Object.keys and a for loop instead of a for-in loop
    // as both of these objects enter 'hash' mode, causing
    // the function to be de-optimised in V8
    var qEdges = Object.keys(frame.qNode.edges),
        qLen = qEdges.length,
        nEdges = Object.keys(frame.node.edges),
        nLen = nEdges.length

    for (var q = 0; q < qLen; q++) {
      var qEdge = qEdges[q]

      for (var n = 0; n < nLen; n++) {
        var nEdge = nEdges[n]

        if (nEdge == qEdge || qEdge == '*') {
          var node = frame.node.edges[nEdge],
              qNode = frame.qNode.edges[qEdge],
              final = node.final && qNode.final,
              next = undefined

          if (nEdge in frame.output.edges) {
            // an edge already exists for this character
            // no need to create a new node, just set the finality
            // bit unless this node is already final
            next = frame.output.edges[nEdge]
            next.final = next.final || final

          } else {
            // no edge exists yet, must create one
            // set the finality bit and insert it
            // into the output
            next = new lunr.TokenSet
            next.final = final
            frame.output.edges[nEdge] = next
          }

          stack.push({
            qNode: qNode,
            output: next,
            node: node
          })
        }
      }
    }
  }

  return output
}
lunr.TokenSet.Builder = function () {
  this.previousWord = ""
  this.root = new lunr.TokenSet
  this.uncheckedNodes = []
  this.minimizedNodes = {}
}

lunr.TokenSet.Builder.prototype.insert = function (word) {
  var node,
      commonPrefix = 0

  if (word < this.previousWord) {
    throw new Error ("Out of order word insertion")
  }

  for (var i = 0; i < word.length && i < this.previousWord.length; i++) {
    if (word[i] != this.previousWord[i]) break
    commonPrefix++
  }

  this.minimize(commonPrefix)

  if (this.uncheckedNodes.length == 0) {
    node = this.root
  } else {
    node = this.uncheckedNodes[this.uncheckedNodes.length - 1].child
  }

  for (var i = commonPrefix; i < word.length; i++) {
    var nextNode = new lunr.TokenSet,
        char = word[i]

    node.edges[char] = nextNode

    this.uncheckedNodes.push({
      parent: node,
      char: char,
      child: nextNode
    })

    node = nextNode
  }

  node.final = true
  this.previousWord = word
}

lunr.TokenSet.Builder.prototype.finish = function () {
  this.minimize(0)
}

lunr.TokenSet.Builder.prototype.minimize = function (downTo) {
  for (var i = this.uncheckedNodes.length - 1; i >= downTo; i--) {
    var node = this.uncheckedNodes[i],
        childKey = node.child.toString()

    if (childKey in this.minimizedNodes) {
      node.parent.edges[node.char] = this.minimizedNodes[childKey]
    } else {
      // Cache the key for this node since
      // we know it can't change anymore
      node.child._str = childKey

      this.minimizedNodes[childKey] = node.child
    }

    this.uncheckedNodes.pop()
  }
}
/*!
 * lunr.Index
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * An index contains the built index of all documents and provides a query interface
 * to the index.
 *
 * Usually instances of lunr.Index will not be created using this constructor, instead
 * lunr.Builder should be used to construct new indexes, or lunr.Index.load should be
 * used to load previously built and serialized indexes.
 *
 * @constructor
 * @param {Object} attrs - The attributes of the built search index.
 * @param {Object} attrs.invertedIndex - An index of term/field to document reference.
 * @param {Object<string, lunr.Vector>} attrs.documentVectors - Document vectors keyed by document reference.
 * @param {lunr.TokenSet} attrs.tokenSet - An set of all corpus tokens.
 * @param {string[]} attrs.fields - The names of indexed document fields.
 * @param {lunr.Pipeline} attrs.pipeline - The pipeline to use for search terms.
 */
lunr.Index = function (attrs) {
  this.invertedIndex = attrs.invertedIndex
  this.fieldVectors = attrs.fieldVectors
  this.tokenSet = attrs.tokenSet
  this.fields = attrs.fields
  this.pipeline = attrs.pipeline
}

/**
 * A result contains details of a document matching a search query.
 * @typedef {Object} lunr.Index~Result
 * @property {string} ref - The reference of the document this result represents.
 * @property {number} score - A number between 0 and 1 representing how similar this document is to the query.
 * @property {lunr.MatchData} matchData - Contains metadata about this match including which term(s) caused the match.
 */

/**
 * Although lunr provides the ability to create queries using lunr.Query, it also provides a simple
 * query language which itself is parsed into an instance of lunr.Query.
 *
 * For programmatically building queries it is advised to directly use lunr.Query, the query language
 * is best used for human entered text rather than program generated text.
 *
 * At its simplest queries can just be a single term, e.g. `hello`, multiple terms are also supported
 * and will be combined with OR, e.g `hello world` will match documents that contain either 'hello'
 * or 'world', though those that contain both will rank higher in the results.
 *
 * Wildcards can be included in terms to match one or more unspecified characters, these wildcards can
 * be inserted anywhere within the term, and more than one wildcard can exist in a single term. Adding
 * wildcards will increase the number of documents that will be found but can also have a negative
 * impact on query performance, especially with wildcards at the beginning of a term.
 *
 * Terms can be restricted to specific fields, e.g. `title:hello`, only documents with the term
 * hello in the title field will match this query. Using a field not present in the index will lead
 * to an error being thrown.
 *
 * Modifiers can also be added to terms, lunr supports edit distance and boost modifiers on terms. A term
 * boost will make documents matching that term score higher, e.g. `foo^5`. Edit distance is also supported
 * to provide fuzzy matching, e.g. 'hello~2' will match documents with hello with an edit distance of 2.
 * Avoid large values for edit distance to improve query performance.
 *
 * To escape special characters the backslash character '\' can be used, this allows searches to include
 * characters that would normally be considered modifiers, e.g. `foo\~2` will search for a term "foo~2" instead
 * of attempting to apply a boost of 2 to the search term "foo".
 *
 * @typedef {string} lunr.Index~QueryString
 * @example <caption>Simple single term query</caption>
 * hello
 * @example <caption>Multiple term query</caption>
 * hello world
 * @example <caption>term scoped to a field</caption>
 * title:hello
 * @example <caption>term with a boost of 10</caption>
 * hello^10
 * @example <caption>term with an edit distance of 2</caption>
 * hello~2
 */

/**
 * Performs a search against the index using lunr query syntax.
 *
 * Results will be returned sorted by their score, the most relevant results
 * will be returned first.
 *
 * For more programmatic querying use lunr.Index#query.
 *
 * @param {lunr.Index~QueryString} queryString - A string containing a lunr query.
 * @throws {lunr.QueryParseError} If the passed query string cannot be parsed.
 * @returns {lunr.Index~Result[]}
 */
lunr.Index.prototype.search = function (queryString) {
  return this.query(function (query) {
    var parser = new lunr.QueryParser(queryString, query)
    parser.parse()
  })
}

/**
 * A query builder callback provides a query object to be used to express
 * the query to perform on the index.
 *
 * @callback lunr.Index~queryBuilder
 * @param {lunr.Query} query - The query object to build up.
 * @this lunr.Query
 */

/**
 * Performs a query against the index using the yielded lunr.Query object.
 *
 * If performing programmatic queries against the index, this method is preferred
 * over lunr.Index#search so as to avoid the additional query parsing overhead.
 *
 * A query object is yielded to the supplied function which should be used to
 * express the query to be run against the index.
 *
 * Note that although this function takes a callback parameter it is _not_ an
 * asynchronous operation, the callback is just yielded a query object to be
 * customized.
 *
 * @param {lunr.Index~queryBuilder} fn - A function that is used to build the query.
 * @returns {lunr.Index~Result[]}
 */
lunr.Index.prototype.query = function (fn) {
  // for each query clause
  // * process terms
  // * expand terms from token set
  // * find matching documents and metadata
  // * get document vectors
  // * score documents

  var query = new lunr.Query(this.fields),
      matchingFields = Object.create(null),
      queryVectors = Object.create(null)

  fn.call(query, query)

  for (var i = 0; i < query.clauses.length; i++) {
    /*
     * Unless the pipeline has been disabled for this term, which is
     * the case for terms with wildcards, we need to pass the clause
     * term through the search pipeline. A pipeline returns an array
     * of processed terms. Pipeline functions may expand the passed
     * term, which means we may end up performing multiple index lookups
     * for a single query term.
     */
    var clause = query.clauses[i],
        terms = null

    if (clause.usePipeline) {
      terms = this.pipeline.runString(clause.term)
    } else {
      terms = [clause.term]
    }

    for (var m = 0; m < terms.length; m++) {
      var term = terms[m]

      /*
       * Each term returned from the pipeline needs to use the same query
       * clause object, e.g. the same boost and or edit distance. The
       * simplest way to do this is to re-use the clause object but mutate
       * its term property.
       */
      clause.term = term

      /*
       * From the term in the clause we create a token set which will then
       * be used to intersect the indexes token set to get a list of terms
       * to lookup in the inverted index
       */
      var termTokenSet = lunr.TokenSet.fromClause(clause),
          expandedTerms = this.tokenSet.intersect(termTokenSet).toArray()

      for (var j = 0; j < expandedTerms.length; j++) {
        /*
         * For each term get the posting and termIndex, this is required for
         * building the query vector.
         */
        var expandedTerm = expandedTerms[j],
            posting = this.invertedIndex[expandedTerm],
            termIndex = posting._index

        for (var k = 0; k < clause.fields.length; k++) {
          /*
           * For each field that this query term is scoped by (by default
           * all fields are in scope) we need to get all the document refs
           * that have this term in that field.
           *
           * The posting is the entry in the invertedIndex for the matching
           * term from above.
           */
          var field = clause.fields[k],
              fieldPosting = posting[field],
              matchingDocumentRefs = Object.keys(fieldPosting)

          /*
           * To support field level boosts a query vector is created per
           * field. This vector is populated using the termIndex found for
           * the term and a unit value with the appropriate boost applied.
           *
           * If the query vector for this field does not exist yet it needs
           * to be created.
           */
          if (!(field in queryVectors)) {
            queryVectors[field] = new lunr.Vector
          }

          /*
           * Using upsert because there could already be an entry in the vector
           * for the term we are working with. In that case we just add the scores
           * together.
           */
          queryVectors[field].upsert(termIndex, 1 * clause.boost, function (a, b) { return a + b })

          for (var l = 0; l < matchingDocumentRefs.length; l++) {
            /*
             * All metadata for this term/field/document triple
             * are then extracted and collected into an instance
             * of lunr.MatchData ready to be returned in the query
             * results
             */
            var matchingDocumentRef = matchingDocumentRefs[l],
                matchingFieldRef = new lunr.FieldRef (matchingDocumentRef, field),
                documentMetadata, matchData

            documentMetadata = fieldPosting[matchingDocumentRef]
            matchData = new lunr.MatchData (expandedTerm, field, documentMetadata)

            if (matchingFieldRef in matchingFields) {
              matchingFields[matchingFieldRef].combine(matchData)
            } else {
              matchingFields[matchingFieldRef] = matchData
            }

          }
        }
      }
    }
  }

  var matchingFieldRefs = Object.keys(matchingFields),
      results = {}

  for (var i = 0; i < matchingFieldRefs.length; i++) {
    /*
     * Currently we have document fields that match the query, but we
     * need to return documents. The matchData and scores are combined
     * from multiple fields belonging to the same document.
     *
     * Scores are calculated by field, using the query vectors created
     * above, and combined into a final document score using addition.
     */
    var fieldRef = lunr.FieldRef.fromString(matchingFieldRefs[i]),
        docRef = fieldRef.docRef,
        fieldVector = this.fieldVectors[fieldRef],
        score = queryVectors[fieldRef.fieldName].similarity(fieldVector)

    if (docRef in results) {
      results[docRef].score += score
      results[docRef].matchData.combine(matchingFields[fieldRef])
    } else {
      results[docRef] = {
        ref: docRef,
        score: score,
        matchData: matchingFields[fieldRef]
      }
    }
  }

  /*
   * The results object needs to be converted into a list
   * of results, sorted by score before being returned.
   */
  return Object.keys(results)
    .map(function (key) {
      return results[key]
    })
    .sort(function (a, b) {
      return b.score - a.score
    })
}

/**
 * Prepares the index for JSON serialization.
 *
 * The schema for this JSON blob will be described in a
 * separate JSON schema file.
 *
 * @returns {Object}
 */
lunr.Index.prototype.toJSON = function () {
  var invertedIndex = Object.keys(this.invertedIndex)
    .sort()
    .map(function (term) {
      return [term, this.invertedIndex[term]]
    }, this)

  var fieldVectors = Object.keys(this.fieldVectors)
    .map(function (ref) {
      return [ref, this.fieldVectors[ref].toJSON()]
    }, this)

  return {
    version: lunr.version,
    fields: this.fields,
    fieldVectors: fieldVectors,
    invertedIndex: invertedIndex,
    pipeline: this.pipeline.toJSON()
  }
}

/**
 * Loads a previously serialized lunr.Index
 *
 * @param {Object} serializedIndex - A previously serialized lunr.Index
 * @returns {lunr.Index}
 */
lunr.Index.load = function (serializedIndex) {
  var attrs = {},
      fieldVectors = {},
      serializedVectors = serializedIndex.fieldVectors,
      invertedIndex = {},
      serializedInvertedIndex = serializedIndex.invertedIndex,
      tokenSetBuilder = new lunr.TokenSet.Builder,
      pipeline = lunr.Pipeline.load(serializedIndex.pipeline)

  if (serializedIndex.version != lunr.version) {
    lunr.utils.warn("Version mismatch when loading serialised index. Current version of lunr '" + lunr.version + "' does not match serialized index '" + serializedIndex.version + "'")
  }

  for (var i = 0; i < serializedVectors.length; i++) {
    var tuple = serializedVectors[i],
        ref = tuple[0],
        elements = tuple[1]

    fieldVectors[ref] = new lunr.Vector(elements)
  }

  for (var i = 0; i < serializedInvertedIndex.length; i++) {
    var tuple = serializedInvertedIndex[i],
        term = tuple[0],
        posting = tuple[1]

    tokenSetBuilder.insert(term)
    invertedIndex[term] = posting
  }

  tokenSetBuilder.finish()

  attrs.fields = serializedIndex.fields

  attrs.fieldVectors = fieldVectors
  attrs.invertedIndex = invertedIndex
  attrs.tokenSet = tokenSetBuilder.root
  attrs.pipeline = pipeline

  return new lunr.Index(attrs)
}
/*!
 * lunr.Builder
 * Copyright (C) 2017 Oliver Nightingale
 */

/**
 * lunr.Builder performs indexing on a set of documents and
 * returns instances of lunr.Index ready for querying.
 *
 * All configuration of the index is done via the builder, the
 * fields to index, the document reference, the text processing
 * pipeline and document scoring parameters are all set on the
 * builder before indexing.
 *
 * @constructor
 * @property {string} _ref - Internal reference to the document reference field.
 * @property {string[]} _fields - Internal reference to the document fields to index.
 * @property {object} invertedIndex - The inverted index maps terms to document fields.
 * @property {object} documentTermFrequencies - Keeps track of document term frequencies.
 * @property {object} documentLengths - Keeps track of the length of documents added to the index.
 * @property {lunr.tokenizer} tokenizer - Function for splitting strings into tokens for indexing.
 * @property {lunr.Pipeline} pipeline - The pipeline performs text processing on tokens before indexing.
 * @property {lunr.Pipeline} searchPipeline - A pipeline for processing search terms before querying the index.
 * @property {number} documentCount - Keeps track of the total number of documents indexed.
 * @property {number} _b - A parameter to control field length normalization, setting this to 0 disabled normalization, 1 fully normalizes field lengths, the default value is 0.75.
 * @property {number} _k1 - A parameter to control how quickly an increase in term frequency results in term frequency saturation, the default value is 1.2.
 * @property {number} termIndex - A counter incremented for each unique term, used to identify a terms position in the vector space.
 * @property {array} metadataWhitelist - A list of metadata keys that have been whitelisted for entry in the index.
 */
lunr.Builder = function () {
  this._ref = "id"
  this._fields = []
  this.invertedIndex = Object.create(null)
  this.fieldTermFrequencies = {}
  this.fieldLengths = {}
  this.tokenizer = lunr.tokenizer
  this.pipeline = new lunr.Pipeline
  this.searchPipeline = new lunr.Pipeline
  this.documentCount = 0
  this._b = 0.75
  this._k1 = 1.2
  this.termIndex = 0
  this.metadataWhitelist = []
}

/**
 * Sets the document field used as the document reference. Every document must have this field.
 * The type of this field in the document should be a string, if it is not a string it will be
 * coerced into a string by calling toString.
 *
 * The default ref is 'id'.
 *
 * The ref should _not_ be changed during indexing, it should be set before any documents are
 * added to the index. Changing it during indexing can lead to inconsistent results.
 *
 * @param {string} ref - The name of the reference field in the document.
 */
lunr.Builder.prototype.ref = function (ref) {
  this._ref = ref
}

/**
 * Adds a field to the list of document fields that will be indexed. Every document being
 * indexed should have this field. Null values for this field in indexed documents will
 * not cause errors but will limit the chance of that document being retrieved by searches.
 *
 * All fields should be added before adding documents to the index. Adding fields after
 * a document has been indexed will have no effect on already indexed documents.
 *
 * @param {string} field - The name of a field to index in all documents.
 */
lunr.Builder.prototype.field = function (field) {
  this._fields.push(field)
}

/**
 * A parameter to tune the amount of field length normalisation that is applied when
 * calculating relevance scores. A value of 0 will completely disable any normalisation
 * and a value of 1 will fully normalise field lengths. The default is 0.75. Values of b
 * will be clamped to the range 0 - 1.
 *
 * @param {number} number - The value to set for this tuning parameter.
 */
lunr.Builder.prototype.b = function (number) {
  if (number < 0) {
    this._b = 0
  } else if (number > 1) {
    this._b = 1
  } else {
    this._b = number
  }
}

/**
 * A parameter that controls the speed at which a rise in term frequency results in term
 * frequency saturation. The default value is 1.2. Setting this to a higher value will give
 * slower saturation levels, a lower value will result in quicker saturation.
 *
 * @param {number} number - The value to set for this tuning parameter.
 */
lunr.Builder.prototype.k1 = function (number) {
  this._k1 = number
}

/**
 * Adds a document to the index.
 *
 * Before adding fields to the index the index should have been fully setup, with the document
 * ref and all fields to index already having been specified.
 *
 * The document must have a field name as specified by the ref (by default this is 'id') and
 * it should have all fields defined for indexing, though null or undefined values will not
 * cause errors.
 *
 * @param {object} doc - The document to add to the index.
 */
lunr.Builder.prototype.add = function (doc) {
  var docRef = doc[this._ref]

  this.documentCount += 1

  for (var i = 0; i < this._fields.length; i++) {
    var fieldName = this._fields[i],
        field = doc[fieldName],
        tokens = this.tokenizer(field),
        terms = this.pipeline.run(tokens),
        fieldRef = new lunr.FieldRef (docRef, fieldName),
        fieldTerms = {}

    this.fieldTermFrequencies[fieldRef] = fieldTerms
    this.fieldLengths[fieldRef] = 0

    // store the length of this field for this document
    this.fieldLengths[fieldRef] += terms.length

    // calculate term frequencies for this field
    for (var j = 0; j < terms.length; j++) {
      var term = terms[j]

      if (fieldTerms[term] == undefined) {
        fieldTerms[term] = 0
      }

      fieldTerms[term] += 1

      // add to inverted index
      // create an initial posting if one doesn't exist
      if (this.invertedIndex[term] == undefined) {
        var posting = Object.create(null)
        posting["_index"] = this.termIndex
        this.termIndex += 1

        for (var k = 0; k < this._fields.length; k++) {
          posting[this._fields[k]] = Object.create(null)
        }

        this.invertedIndex[term] = posting
      }

      // add an entry for this term/fieldName/docRef to the invertedIndex
      if (this.invertedIndex[term][fieldName][docRef] == undefined) {
        this.invertedIndex[term][fieldName][docRef] = Object.create(null)
      }

      // store all whitelisted metadata about this token in the
      // inverted index
      for (var l = 0; l < this.metadataWhitelist.length; l++) {
        var metadataKey = this.metadataWhitelist[l],
            metadata = term.metadata[metadataKey]

        if (this.invertedIndex[term][fieldName][docRef][metadataKey] == undefined) {
          this.invertedIndex[term][fieldName][docRef][metadataKey] = []
        }

        this.invertedIndex[term][fieldName][docRef][metadataKey].push(metadata)
      }
    }

  }
}

/**
 * Calculates the average document length for this index
 *
 * @private
 */
lunr.Builder.prototype.calculateAverageFieldLengths = function () {

  var fieldRefs = Object.keys(this.fieldLengths),
      numberOfFields = fieldRefs.length,
      accumulator = {},
      documentsWithField = {}

  for (var i = 0; i < numberOfFields; i++) {
    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),
        field = fieldRef.fieldName

    documentsWithField[field] || (documentsWithField[field] = 0)
    documentsWithField[field] += 1

    accumulator[field] || (accumulator[field] = 0)
    accumulator[field] += this.fieldLengths[fieldRef]
  }

  for (var i = 0; i < this._fields.length; i++) {
    var field = this._fields[i]
    accumulator[field] = accumulator[field] / documentsWithField[field]
  }

  this.averageFieldLength = accumulator
}

/**
 * Builds a vector space model of every document using lunr.Vector
 *
 * @private
 */
lunr.Builder.prototype.createFieldVectors = function () {
  var fieldVectors = {},
      fieldRefs = Object.keys(this.fieldTermFrequencies),
      fieldRefsLength = fieldRefs.length

  for (var i = 0; i < fieldRefsLength; i++) {
    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),
        field = fieldRef.fieldName,
        fieldLength = this.fieldLengths[fieldRef],
        fieldVector = new lunr.Vector,
        termFrequencies = this.fieldTermFrequencies[fieldRef],
        terms = Object.keys(termFrequencies),
        termsLength = terms.length

    for (var j = 0; j < termsLength; j++) {
      var term = terms[j],
          tf = termFrequencies[term],
          termIndex = this.invertedIndex[term]._index,
          idf = lunr.idf(this.invertedIndex[term], this.documentCount),
          score = idf * ((this._k1 + 1) * tf) / (this._k1 * (1 - this._b + this._b * (fieldLength / this.averageFieldLength[field])) + tf),
          scoreWithPrecision = Math.round(score * 1000) / 1000
          // Converts 1.23456789 to 1.234.
          // Reducing the precision so that the vectors take up less
          // space when serialised. Doing it now so that they behave
          // the same before and after serialisation. Also, this is
          // the fastest approach to reducing a number's precision in
          // JavaScript.

      fieldVector.insert(termIndex, scoreWithPrecision)
    }

    fieldVectors[fieldRef] = fieldVector
  }

  this.fieldVectors = fieldVectors
}

/**
 * Creates a token set of all tokens in the index using lunr.TokenSet
 *
 * @private
 */
lunr.Builder.prototype.createTokenSet = function () {
  this.tokenSet = lunr.TokenSet.fromArray(
    Object.keys(this.invertedIndex).sort()
  )
}

/**
 * Builds the index, creating an instance of lunr.Index.
 *
 * This completes the indexing process and should only be called
 * once all documents have been added to the index.
 *
 * @private
 * @returns {lunr.Index}
 */
lunr.Builder.prototype.build = function () {
  this.calculateAverageFieldLengths()
  this.createFieldVectors()
  this.createTokenSet()

  return new lunr.Index({
    invertedIndex: this.invertedIndex,
    fieldVectors: this.fieldVectors,
    tokenSet: this.tokenSet,
    fields: this._fields,
    pipeline: this.searchPipeline
  })
}

/**
 * Applies a plugin to the index builder.
 *
 * A plugin is a function that is called with the index builder as its context.
 * Plugins can be used to customise or extend the behaviour of the index
 * in some way. A plugin is just a function, that encapsulated the custom
 * behaviour that should be applied when building the index.
 *
 * The plugin function will be called with the index builder as its argument, additional
 * arguments can also be passed when calling use. The function will be called
 * with the index builder as its context.
 *
 * @param {Function} plugin The plugin to apply.
 */
lunr.Builder.prototype.use = function (fn) {
  var args = Array.prototype.slice.call(arguments, 1)
  args.unshift(this)
  fn.apply(this, args)
}
/**
 * Contains and collects metadata about a matching document.
 * A single instance of lunr.MatchData is returned as part of every
 * lunr.Index~Result.
 *
 * @constructor
 * @property {object} metadata - A collection of metadata associated with this document.
 * @see {@link lunr.Index~Result}
 */
lunr.MatchData = function (term, field, metadata) {
  this.metadata = {}
  this.metadata[term] = {}
  this.metadata[term][field] = metadata
}

/**
 * An instance of lunr.MatchData will be created for every term that matches a
 * document. However only one instance is required in a lunr.Index~Result. This
 * method combines metadata from another instance of lunr.MatchData with this
 * objects metadata.
 *
 * @param {lunr.MatchData} otherMatchData - Another instance of match data to merge with this one.
 * @see {@link lunr.Index~Result}
 */
lunr.MatchData.prototype.combine = function (otherMatchData) {
  var terms = Object.keys(otherMatchData.metadata)

  for (var i = 0; i < terms.length; i++) {
    var term = terms[i],
        fields = Object.keys(otherMatchData.metadata[term])

    if (this.metadata[term] == undefined) {
      this.metadata[term] = {}
    }

    for (var j = 0; j < fields.length; j++) {
      var field = fields[j],
          keys = Object.keys(otherMatchData.metadata[term][field])

      if (this.metadata[term][field] == undefined) {
        this.metadata[term][field] = {}
      }

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k]

        if (this.metadata[term][field][key] == undefined) {
          this.metadata[term][field][key] = otherMatchData.metadata[term][field][key]
        } else {
          this.metadata[term][field][key] = this.metadata[term][field][key].concat(otherMatchData.metadata[term][field][key])
        }

      }
    }
  }
}
/**
 * A lunr.Query provides a programmatic way of defining queries to be performed
 * against a {@link lunr.Index}.
 *
 * Prefer constructing a lunr.Query using the {@link lunr.Index#query} method
 * so the query object is pre-initialized with the right index fields.
 *
 * @constructor
 * @property {lunr.Query~Clause[]} clauses - An array of query clauses.
 * @property {string[]} allFields - An array of all available fields in a lunr.Index.
 */
lunr.Query = function (allFields) {
  this.clauses = []
  this.allFields = allFields
}

/**
 * Constants for indicating what kind of automatic wildcard insertion will be used when constructing a query clause.
 *
 * This allows wildcards to be added to the beginning and end of a term without having to manually do any string
 * concatenation.
 *
 * The wildcard constants can be bitwise combined to select both leading and trailing wildcards.
 *
 * @constant
 * @default
 * @property {number} wildcard.NONE - The term will have no wildcards inserted, this is the default behaviour
 * @property {number} wildcard.LEADING - Prepend the term with a wildcard, unless a leading wildcard already exists
 * @property {number} wildcard.TRAILING - Append a wildcard to the term, unless a trailing wildcard already exists
 * @see lunr.Query~Clause
 * @see lunr.Query#clause
 * @see lunr.Query#term
 * @example <caption>query term with trailing wildcard</caption>
 * query.term('foo', { wildcard: lunr.Query.wildcard.TRAILING })
 * @example <caption>query term with leading and trailing wildcard</caption>
 * query.term('foo', {
 *   wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
 * })
 */
lunr.Query.wildcard = new String ("*")
lunr.Query.wildcard.NONE = 0
lunr.Query.wildcard.LEADING = 1
lunr.Query.wildcard.TRAILING = 2

/**
 * A single clause in a {@link lunr.Query} contains a term and details on how to
 * match that term against a {@link lunr.Index}.
 *
 * @typedef {Object} lunr.Query~Clause
 * @property {string[]} fields - The fields in an index this clause should be matched against.
 * @property {number} [boost=1] - Any boost that should be applied when matching this clause.
 * @property {number} [editDistance] - Whether the term should have fuzzy matching applied, and how fuzzy the match should be.
 * @property {boolean} [usePipeline] - Whether the term should be passed through the search pipeline.
 * @property {number} [wildcard=0] - Whether the term should have wildcards appended or prepended.
 */

/**
 * Adds a {@link lunr.Query~Clause} to this query.
 *
 * Unless the clause contains the fields to be matched all fields will be matched. In addition
 * a default boost of 1 is applied to the clause.
 *
 * @param {lunr.Query~Clause} clause - The clause to add to this query.
 * @see lunr.Query~Clause
 * @returns {lunr.Query}
 */
lunr.Query.prototype.clause = function (clause) {
  if (!('fields' in clause)) {
    clause.fields = this.allFields
  }

  if (!('boost' in clause)) {
    clause.boost = 1
  }

  if (!('usePipeline' in clause)) {
    clause.usePipeline = true
  }

  if (!('wildcard' in clause)) {
    clause.wildcard = lunr.Query.wildcard.NONE
  }

  if ((clause.wildcard & lunr.Query.wildcard.LEADING) && (clause.term.charAt(0) != lunr.Query.wildcard)) {
    clause.term = "*" + clause.term
  }

  if ((clause.wildcard & lunr.Query.wildcard.TRAILING) && (clause.term.slice(-1) != lunr.Query.wildcard)) {
    clause.term = "" + clause.term + "*"
  }

  this.clauses.push(clause)

  return this
}

/**
 * Adds a term to the current query, under the covers this will create a {@link lunr.Query~Clause}
 * to the list of clauses that make up this query.
 *
 * @param {string} term - The term to add to the query.
 * @param {Object} [options] - Any additional properties to add to the query clause.
 * @returns {lunr.Query}
 * @see lunr.Query#clause
 * @see lunr.Query~Clause
 * @example <caption>adding a single term to a query</caption>
 * query.term("foo")
 * @example <caption>adding a single term to a query and specifying search fields, term boost and automatic trailing wildcard</caption>
 * query.term("foo", {
 *   fields: ["title"],
 *   boost: 10,
 *   wildcard: lunr.Query.wildcard.TRAILING
 * })
 */
lunr.Query.prototype.term = function (term, options) {
  var clause = options || {}
  clause.term = term

  this.clause(clause)

  return this
}
lunr.QueryParseError = function (message, start, end) {
  this.name = "QueryParseError"
  this.message = message
  this.start = start
  this.end = end
}

lunr.QueryParseError.prototype = new Error
lunr.QueryLexer = function (str) {
  this.lexemes = []
  this.str = str
  this.length = str.length
  this.pos = 0
  this.start = 0
  this.escapeCharPositions = []
}

lunr.QueryLexer.prototype.run = function () {
  var state = lunr.QueryLexer.lexText

  while (state) {
    state = state(this)
  }
}

lunr.QueryLexer.prototype.sliceString = function () {
  var subSlices = [],
      sliceStart = this.start,
      sliceEnd = this.pos

  for (var i = 0; i < this.escapeCharPositions.length; i++) {
    sliceEnd = this.escapeCharPositions[i]
    subSlices.push(this.str.slice(sliceStart, sliceEnd))
    sliceStart = sliceEnd + 1
  }

  subSlices.push(this.str.slice(sliceStart, this.pos))
  this.escapeCharPositions.length = 0

  return subSlices.join('')
}

lunr.QueryLexer.prototype.emit = function (type) {
  this.lexemes.push({
    type: type,
    str: this.sliceString(),
    start: this.start,
    end: this.pos
  })

  this.start = this.pos
}

lunr.QueryLexer.prototype.escapeCharacter = function () {
  this.escapeCharPositions.push(this.pos - 1)
  this.pos += 1
}

lunr.QueryLexer.prototype.next = function () {
  if (this.pos >= this.length) {
    return lunr.QueryLexer.EOS
  }

  var char = this.str.charAt(this.pos)
  this.pos += 1
  return char
}

lunr.QueryLexer.prototype.width = function () {
  return this.pos - this.start
}

lunr.QueryLexer.prototype.ignore = function () {
  if (this.start == this.pos) {
    this.pos += 1
  }

  this.start = this.pos
}

lunr.QueryLexer.prototype.backup = function () {
  this.pos -= 1
}

lunr.QueryLexer.prototype.acceptDigitRun = function () {
  var char, charCode

  do {
    char = this.next()
    charCode = char.charCodeAt(0)
  } while (charCode > 47 && charCode < 58)

  if (char != lunr.QueryLexer.EOS) {
    this.backup()
  }
}

lunr.QueryLexer.prototype.more = function () {
  return this.pos < this.length
}

lunr.QueryLexer.EOS = 'EOS'
lunr.QueryLexer.FIELD = 'FIELD'
lunr.QueryLexer.TERM = 'TERM'
lunr.QueryLexer.EDIT_DISTANCE = 'EDIT_DISTANCE'
lunr.QueryLexer.BOOST = 'BOOST'

lunr.QueryLexer.lexField = function (lexer) {
  lexer.backup()
  lexer.emit(lunr.QueryLexer.FIELD)
  lexer.ignore()
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexTerm = function (lexer) {
  if (lexer.width() > 1) {
    lexer.backup()
    lexer.emit(lunr.QueryLexer.TERM)
  }

  lexer.ignore()

  if (lexer.more()) {
    return lunr.QueryLexer.lexText
  }
}

lunr.QueryLexer.lexEditDistance = function (lexer) {
  lexer.ignore()
  lexer.acceptDigitRun()
  lexer.emit(lunr.QueryLexer.EDIT_DISTANCE)
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexBoost = function (lexer) {
  lexer.ignore()
  lexer.acceptDigitRun()
  lexer.emit(lunr.QueryLexer.BOOST)
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexEOS = function (lexer) {
  if (lexer.width() > 0) {
    lexer.emit(lunr.QueryLexer.TERM)
  }
}

// This matches the separator used when tokenising fields
// within a document. These should match otherwise it is
// not possible to search for some tokens within a document.
//
// It is possible for the user to change the separator on the
// tokenizer so it _might_ clash with any other of the special
// characters already used within the search string, e.g. :.
//
// This means that it is possible to change the separator in
// such a way that makes some words unsearchable using a search
// string.
lunr.QueryLexer.termSeparator = lunr.tokenizer.separator

lunr.QueryLexer.lexText = function (lexer) {
  while (true) {
    var char = lexer.next()

    if (char == lunr.QueryLexer.EOS) {
      return lunr.QueryLexer.lexEOS
    }

    // Escape character is '\'
    if (char.charCodeAt(0) == 92) {
      lexer.escapeCharacter()
      continue
    }

    if (char == ":") {
      return lunr.QueryLexer.lexField
    }

    if (char == "~") {
      lexer.backup()
      if (lexer.width() > 0) {
        lexer.emit(lunr.QueryLexer.TERM)
      }
      return lunr.QueryLexer.lexEditDistance
    }

    if (char == "^") {
      lexer.backup()
      if (lexer.width() > 0) {
        lexer.emit(lunr.QueryLexer.TERM)
      }
      return lunr.QueryLexer.lexBoost
    }

    if (char.match(lunr.QueryLexer.termSeparator)) {
      return lunr.QueryLexer.lexTerm
    }
  }
}

lunr.QueryParser = function (str, query) {
  this.lexer = new lunr.QueryLexer (str)
  this.query = query
  this.currentClause = {}
  this.lexemeIdx = 0
}

lunr.QueryParser.prototype.parse = function () {
  this.lexer.run()
  this.lexemes = this.lexer.lexemes

  var state = lunr.QueryParser.parseFieldOrTerm

  while (state) {
    state = state(this)
  }

  return this.query
}

lunr.QueryParser.prototype.peekLexeme = function () {
  return this.lexemes[this.lexemeIdx]
}

lunr.QueryParser.prototype.consumeLexeme = function () {
  var lexeme = this.peekLexeme()
  this.lexemeIdx += 1
  return lexeme
}

lunr.QueryParser.prototype.nextClause = function () {
  var completedClause = this.currentClause
  this.query.clause(completedClause)
  this.currentClause = {}
}

lunr.QueryParser.parseFieldOrTerm = function (parser) {
  var lexeme = parser.peekLexeme()

  if (lexeme == undefined) {
    return
  }

  switch (lexeme.type) {
    case lunr.QueryLexer.FIELD:
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.TERM:
      return lunr.QueryParser.parseTerm
    default:
      var errorMessage = "expected either a field or a term, found " + lexeme.type

      if (lexeme.str.length >= 1) {
        errorMessage += " with value '" + lexeme.str + "'"
      }

      throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }
}

lunr.QueryParser.parseField = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  if (parser.query.allFields.indexOf(lexeme.str) == -1) {
    var possibleFields = parser.query.allFields.map(function (f) { return "'" + f + "'" }).join(', '),
        errorMessage = "unrecognised field '" + lexeme.str + "', possible fields: " + possibleFields

    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  parser.currentClause.fields = [lexeme.str]

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    var errorMessage = "expecting term, found nothing"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      return lunr.QueryParser.parseTerm
    default:
      var errorMessage = "expecting term, found '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseTerm = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  parser.currentClause.term = lexeme.str.toLowerCase()

  if (lexeme.str.indexOf("*") != -1) {
    parser.currentClause.usePipeline = false
  }

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    parser.nextClause()
    return
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      parser.nextClause()
      return lunr.QueryParser.parseTerm
    case lunr.QueryLexer.FIELD:
      parser.nextClause()
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.EDIT_DISTANCE:
      return lunr.QueryParser.parseEditDistance
    case lunr.QueryLexer.BOOST:
      return lunr.QueryParser.parseBoost
    default:
      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseEditDistance = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  var editDistance = parseInt(lexeme.str, 10)

  if (isNaN(editDistance)) {
    var errorMessage = "edit distance must be numeric"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  parser.currentClause.editDistance = editDistance

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    parser.nextClause()
    return
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      parser.nextClause()
      return lunr.QueryParser.parseTerm
    case lunr.QueryLexer.FIELD:
      parser.nextClause()
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.EDIT_DISTANCE:
      return lunr.QueryParser.parseEditDistance
    case lunr.QueryLexer.BOOST:
      return lunr.QueryParser.parseBoost
    default:
      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseBoost = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  var boost = parseInt(lexeme.str, 10)

  if (isNaN(boost)) {
    var errorMessage = "boost must be numeric"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  parser.currentClause.boost = boost

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    parser.nextClause()
    return
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      parser.nextClause()
      return lunr.QueryParser.parseTerm
    case lunr.QueryLexer.FIELD:
      parser.nextClause()
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.EDIT_DISTANCE:
      return lunr.QueryParser.parseEditDistance
    case lunr.QueryLexer.BOOST:
      return lunr.QueryParser.parseBoost
    default:
      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

  /**
   * export the module via AMD, CommonJS or as a browser global
   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
   */
  ;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory)
    } else if (typeof exports === 'object') {
      /**
       * Node. Does not work with strict CommonJS, but
       * only CommonJS-like enviroments that support module.exports,
       * like Node.
       */
      module.exports = factory()
    } else {
      // Browser globals (root is window)
      root.lunr = factory()
    }
  }(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return lunr
  }))
})();
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
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['jobdetails'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda;

  return "        <span class=\"detailFooter\"></span>\n        <div class=\"detailContent detailView\">\n            <div class=\"highlight row col-xs-12 col-sm-12 col-md-12\">\n                "
    + ((stack1 = alias1((depth0 != null ? depth0.content : depth0), depth0)) != null ? stack1 : "")
    + "\n            </div>\n        </div>\n\n        <table class=\"table table-hover\" style=\"display: table;\">\n            <tbody>\n                <tr>\n\n                    <td class=\"detail-td\">\n                        <a  data-postid=\""
    + ((stack1 = alias1((depth0 != null ? depth0.id : depth0), depth0)) != null ? stack1 : "")
    + "\" onclick=\"footerPlusMinusClick(event);\"\n                            class=\"detail-icon\"  >\n                            <i class=\"fa fa-2x fa-caret-up iconStyle\"></i>\n                        </a>\n                    </td>\n\n                    <td class=\"spanLink\">\n                        <a href=\""
    + ((stack1 = alias1((depth0 != null ? depth0.url : depth0), depth0)) != null ? stack1 : "")
    + "\" target=\"_blank\" rel=\"nofollow noopener\"\n                           class=\"btn btn-primary\" style=\"margin-top: 0px; margin-bottom: 4px;\">\n                            <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n                            View original job description / <strong>Apply</strong>\n                        </a>\n\n                        <!-- &nbsp; -->\n                        <div class=\"btn-group\" style=\"display: none; margin-top: 0px; margin-left: 0px;\n                                margin-right: 0px; margin-bottom: 4px;\" >\n                            <button class=\"btn btn-default dropdown-toggle\" type=\"button\"\n                                    data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                                        <span ><i class=\"fa fa-flag-o\" aria-hidden=\"true\"></i>\n                                        Report this job...</span>\n                                <span class=\"caret\"></span>\n                            </button>\n\n                            <ul class=\"dropdown-menu dropdown-menu-right\">\n                                <li>\n                                    <a href=\"javascript:void(0)\" data-toggle=\"modal\"\n                                       data-target=\".reportthisjob-modal\"\n                                       data-postid=\""
    + ((stack1 = alias1((depth0 != null ? depth0.id : depth0), depth0)) != null ? stack1 : "")
    + "\"\n                                       data-tagcurrent=\""
    + ((stack1 = alias1((depth0 != null ? depth0.tagCurrent : depth0), depth0)) != null ? stack1 : "")
    + "\"\n                                       data-title=\""
    + ((stack1 = alias1((depth0 != null ? depth0.title : depth0), depth0)) != null ? stack1 : "")
    + "\">I think this job is not remote</a>\n                                </li>\n                                <li>\n                                    <a href=\"javascript:void(0)\">I think this job belongs into different\n                                        category</a>\n                                </li>\n                            </ul>\n                        </div>\n\n                        <a href=\"#"
    + ((stack1 = alias1((depth0 != null ? depth0.id : depth0), depth0)) != null ? stack1 : "")
    + "\" class=\"btn btn-default\" style=\"margin-top: 0px; margin-bottom: 4px;\">\n                            <i class=\"fa fa-link\" aria-hidden=\"true\"></i>\n                            Get shareable link\n                        </a>\n                    </td>\n\n                    <td class=\"published\">\n                    </td>\n\n                </tr>\n            </tbody>\n        </table>\n\n\n";
},"useData":true});
})();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['jobtitle'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda;

  return "<h2  class=\"job-title\">\n    <a onClick=\"rowTitleClick(this);return false;\"\n       class=\"rowTitleClass\"\n       href=\"#"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.id : stack1), depth0)) != null ? stack1 : "")
    + "\" id=\""
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.id : stack1), depth0)) != null ? stack1 : "")
    + "\"><u>"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.title : stack1), depth0)) != null ? stack1 : "")
    + "</u></a>\n</h2>\n\n";
},"useData":true});
})();
