wow = new WOW(
    {
        animateClass: 'animated',
        offset: 100
    }
);

jQuery(document).ready(function () {

/*
//Flickr feed snippet by css-tricks.com			   
    jQuery.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?id=37321137@N03&format=json&jsoncallback=?", function (data) {
        var target = "#latest-flickr-images ul"; // Where is it going?
        for (i = 0; i <= 9; i = i + 1) { // Loop through the 10 most recent, [0-9]
            var pic = data.items[i];
            var liNumber = i + 1; // Add class to each LI (1-12)
            jQuery(target).append("<li class='flickr-image no-" + liNumber + "'><a rel='prettyPhoto' title='" + pic.title + "' href='" + pic.link + "'><img src='" + pic.media.m + "' /></a></li>");
        }
    });
*/

//PrettyPhoto
/* hack
    jQuery("a.prettyPhoto").prettyPhoto();
    jQuery("a[rel^='prettyPhoto']").prettyPhoto();
*/

//Collapsing Header Effect

    var header_height = jQuery('header').outerHeight();
    var full_page_photo_height = jQuery('.full_page_photo').outerHeight();
    var total_height = header_height + full_page_photo_height;
    var nav = jQuery('.collapsing_header header');

    jQuery(window).scroll(function () {
        if (jQuery(this).scrollTop() > full_page_photo_height) {
            nav.addClass("absolute");
            nav.css("top", full_page_photo_height);
        } else {
            nav.removeClass("absolute");
            nav.css("top", "0px");
        }
    });

    var window_top = jQuery(window).scrollTop();

    if (window_top > full_page_photo_height) {
        nav.addClass("absolute");
        nav.css("top", full_page_photo_height);
    } else {
        nav.removeClass("absolute");
        nav.css("top", "0px");
    }

    jQuery('.collapsing_header .full_page_photo').css("top", header_height);
    jQuery('.collapsing_header .main').css("top", total_height);


//UI to Top
    jQuery().UItoTop({easingType: 'easeOutQuart'});


    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        // Yep, it's Safari =)
        jQuery('.portfolio_item figcaption p').addClass('safari');
    } else {
        // Nope, it's another browser =(
    }


});


//=================== PARALLAX ===================================================

(function ($) {

    $('.parallax-window').each(function () {

        var bg_image = $(this).css("background-image").replace('url(', '').replace(')', '').replace(/\"/g, '').replace(/\'/g, '');
        $(this).css("background-image", "none").attr("data-parallax", "scroll").attr("data-image-src", bg_image).attr("data-position", "center top");

    });

}(jQuery));

//=================== SECTION SEPARATORS ===================================================

(function ($) {

    var $separator_top = $(".separator_top");
    var $separator_bottom = $(".separator_bottom");

    if ($separator_top.length) {
        $separator_top.each(function () {
            $(this).prepend("<div class='separator_top'><div>");
        });
    }
    if ($separator_bottom.length) {
        $separator_bottom.each(function () {
            $(this).append("<div class='separator_bottom'><div>");
        });
    }

}(jQuery));

//END=================== SECTION SEPERATORS ===================================================
