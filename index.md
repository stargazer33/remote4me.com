---
layout: page

title: Metajob - an aggregator for remote tech jobs

tagline: Only true remote jobs - filtered and categorized by position and technology stack.

undertagline: Job ads are posted on multiple job board. Some of these job ads are about a remote job. Some of them describes an onsite job. And they are written for humans, not for computers programs. Job ads are full of phrases like "remotely on Friday" or "occasional remote working" - which is not what we are searching for.  So it took time to teach a program recognizing a true remote job. A simple keyword search does not return you a list of remote jobs. But... with a little bit of <a href="http://lucene.apache.org/" >Lucene</a> full text search magic it is possible to get the desired results. See below.
---
{% include JB/setup %}

{% for node in site.data.jobnav %}
{% if node.title %} [{{ node.title }}]( {{ node.url }}), {% endif %}{{ node.tagline }}
{% for subnode in node.subnodes %}
* [{{ subnode.title }}]( {{ subnode.url }}); {{ subnode.tagline }}
{% endfor %}
{% endfor %}

