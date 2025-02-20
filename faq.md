---
layout: page
title: F.A.Q.s
description: Frequently Asked Questions (and Answers)
tagline: Frequently Asked Questions (and Answers)
redirect_to: https://docs.google.com/forms/d/e/1FAIpQLSdRZ6YDQMHFPAzX-Nd0EGcCWrA-X9yiZSj5vf1GteXjv9uX_g/viewform?usp=dialog
group: navigation
breadcrumb_title: Miscellaneous
breadcrumb_url: /misc/pages.html
last_modified_at: 2018-09-25T00:00:00+00:00
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
