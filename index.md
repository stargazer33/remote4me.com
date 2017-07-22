---
layout: index
title: Metajob - an aggregator for remote tech jobs
tagline: Only true remote jobs - filtered and categorized by position and technology stack.
undertagline: Job ads are posted on multiple job boards. Some of these job ads are about a remote job. Some of them describe an onsite job. And all of them are written for humans, not for computer programs. Job ads are full of phrases like "remotely on Friday" or "occasional remote working" - which is not what we are searching for. So, the author has taken the time to teach a program how to recognize a true remote job. A simple keyword search does not return you a list of remote jobs. But... with a little bit of <a href="http://lucene.apache.org/" >Lucene</a> full text search magic it is possible to get the desired results. See below.
---
{% include JB/setup %}

{% for node in site.data.jobnav %}
{% if node.title %} [{{ node.title }}]( {{ node.url }}), {% endif %}{{ node.tagline }}
{% for subnode in node.subnodes %}
* [{{ subnode.title }}]( {{ subnode.url }}); {{ subnode.tagline }}
{% endfor %}
{% endfor %}

