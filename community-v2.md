---
layout: page
title: Community
permalink: /community-v2/
---



<div class="row">

    {% assign mostrecentnode = site.data.communitynav[0] %}
    <div class="col-md-6">
        {% include community/node1_in_list.html node=mostrecentnode %}                                                              
        {% for i in mostrecentnode.subnodes %}        
            {% include community/article_in_list.html node=i %}
        {% endfor %}
    </div>

    <div class="col-md-6">

        {% for node1 in site.data.communitynav %}
            {% if node1.title == 'Most Recent' %}
                {% continue %}
            {% endif %}
        
            {% include community/node1_in_list.html node=node1 %}                                                              
            {% for i in node1.subnodes %}
                {% include community/article_in_list.html node = i %}
            {% endfor %}

            {% for node2 in node1.subnodes %}
                {% for node3 in node2.subnodes %}
                {% endfor %}
            {% endfor %}
            
        {% endfor %}
    </div>
</div>
    
