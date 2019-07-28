#!/bin/bash
set -o errexit
set -o pipefail
#set -o nounset

#
# Syntax: combine.sh [debug]
#

JSP=assets/themes/restart/js
CSP=_includes/themes/restart/assets

# pre-compiling *.handlebars
_bin/compile-handl.sh

# merge results of handlebars compilation with render_jobad_list_filter.js
cat $JSP/render_jobad_list_filter.js _tmp/jobdetails.js _tmp/jobtitle.js >_tmp/render_jobad_list_filter.js

# write $JSP/default.js
uglifyjs --compress unused,dead_code -- $JSP/jquery-1.12.4.min.js $JSP/bootstrap.js $JSP/modernizr.custom.48287.min.js $JSP/jquery.ui.totop.min.js $JSP/easing.min.js $JSP/wow.min.js $JSP/restart_theme.min.js $JSP/collapser.min.js > $JSP/default.js

# Write $JSP/jobad-list.js
FILES_JOBAD="$JSP/bootstrap-table.min.js $JSP/bootstrap-table-en-US.min.js $JSP/handlebars.runtime-v4.0.12.min.js $JSP/lunr.js _tmp/render_jobad_list_filter.js"
if [ -n "$1" ]; then
    # DEBUG mode
    echo DEBUG JS
    cat $FILES_JOBAD > $JSP/jobad-list.js
else
    # NORMAL mode
    echo NORMAL JS
    uglifyjs --compress unused,dead_code -- $FILES_JOBAD > $JSP/jobad-list.js
fi

# write $CSP/default.css
# NOTE: default.css -> included into _includes/themes/restart/default.html
#
FILES_CSS="$CSP/style.css $CSP/userstyle.css $CSP/userstyle-joblist.css $CSP/userstyle-dropdown-filter.css"
if [ -n "$1" ]; then
    # DEBUG mode
    echo DEBUG CSS
    cat $FILES_CSS > $CSP/default.css
else
    # NORMAL mode
    echo NORMAL CSS
    cleancss -O2 -o $CSP/default.css $FILES_CSS
fi


# FONT
# 1.
# base64 -w 0 assets/themes/restart/fonts/FontAwesome.woff2 >assets/themes/restart/fonts/FontAwesome.woff2.txt
#
# 2.
# Edit assets/themes/restart/css/font-awesome.base64.css
# insert contents of FontAwesome.woff2.txt
# insert new .fa classes below "Font Awesome uses the Unicode Private Use Area (PUA)"
#
# 3.
# cleancss -O2 -o _includes/themes/restart/assets/font-awesome.base64.min.css  assets/themes/restart/css/font-awesome.base64.css
#   font-awesome.base64.min.css -> included into _includes/themes/restart/default.html


