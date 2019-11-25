---
layout: page
title: remote4me community
undertagline: "Where remote workers and distributed companies share ideas. It is an online 
community for sharing and discovering great ideas about remote work, having debates, and making friends. 
<ul>
<li>Remote workers can share their experience.</li> 
<li>Remote (or distributed) companies can tell their stories.</li>
<li>Journalists, coaches can publish analytics and reviews related to remote work.</li>
<li>Digital nomads can share their stories about traveling and working remotely.</li> 
</ul>
Cross-posting from your own blog is welcome."
permalink: /community/
---
{% for row in (1..3) %}
<div class="row">

    {% for node1 in site.data.communitynav %}
        {% if node1.row != row %}
            {% continue %}
        {% endif %}

    
        <div class="col-md-4">
            {% include community/node1_in_list.html node=node1 %}                                                              

            {% for l in node1.subnodes %}
                {% include community/link_in_list.html link=l %}
            {% endfor %}                                 

            {% assign node1_stories=site[node1.collection] %}               
            {% if node1_stories == nil %}
                {% continue %}
            {% endif %}            
            {% assign node1_stories_sorted=node1_stories | sort: 'order' | reverse %}               
            {% for s in node1_stories_sorted limit:site.num_stories_small_list %}
                {% include community/story_in_list.html page=s %}
            {% endfor %}                                    
        </div>
    {% endfor %}
</div>   
{% endfor %}
