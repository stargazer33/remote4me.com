#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

JSP=assets/themes/restart/js
CSP=assets/themes/restart/css

# write $JSP/default.js
cat $JSP/jquery-1.12.4.min.js $JSP/bootstrap.min.js $JSP/modernizr.custom.48287.min.js $JSP/jquery.ui.totop.min.js $JSP/easing.min.js $JSP/wow.min.js $JSP/restart_theme.min.js $JSP/collapser.min.js > $JSP/default.js

# write $JSP/jobad-list.js
cat $JSP/bootstrap-table.min.js $JSP/bootstrap-table-en-US.min.js $JSP/handlebars-v4.0.11.min.js $JSP/lunr.min.js > $JSP/jobad-list.js
uglifyjs --compress -- $JSP/render_jobad_list_filter.js >> $JSP/jobad-list.js


# cat $JSP/firebase-app.js $JSP/firebase-auth.js $JSP/firebase-firestore.js $JSP/firebaseui.js > $JSP/firebase.js

# write $CSP/default.css
cat $CSP/font-open-sans.css $CSP/animate.min.css $CSP/style.min.css $CSP/font-awesome.min.css $CSP/userstyle.css > $CSP/default.css


