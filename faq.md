---
layout: page
title: F.A.Q.s
tagline: Frequently Asked Questions (and Answers)
permalink: /faq/
group: navigation
breadcrumb_title: Miscellaneous
breadcrumb_url: /misc/pages.html
---
{% assign show_category = 'FAQ' %}

{% for category in site.categories %} 
  {% if category[0] == show_category %}
  <ul>
    {% assign pages_list = category[1] %}  
    {% include JB/pages_list %}
  </ul>
  {% endif %}  
{% endfor %}
