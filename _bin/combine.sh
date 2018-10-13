#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

JSP=assets/themes/restart/js
CSP=assets/themes/restart/css

# write $JSP/default.js
cat $JSP/jquery-1.12.4.min.js $JSP/bootstrap.min.js $JSP/modernizr.custom.48287.min.js $JSP/jquery.ui.totop.min.js $JSP/easing.min.js $JSP/wow.min.js $JSP/restart_theme.min.js $JSP/collapser.min.js > $JSP/default.js

# handlebars _includes/themes/restart/jobdetails.handlebars >> assets/themes/restart/js/render_jobad_list_filter.js

# write $JSP/jobad-list.js
cat $JSP/default.js $JSP/bootstrap-table.min.js $JSP/bootstrap-table-en-US.min.js $JSP/handlebars.runtime-v4.0.12.min.js $JSP/lunr.min.js > $JSP/jobad-list.js
uglifyjs --compress -- $JSP/render_jobad_list_filter.js >> $JSP/jobad-list.js

# write $CSP/default.css
cleancss -O2 -o $CSP/default.css $CSP/style.css $CSP/userstyle.css



