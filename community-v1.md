---
layout: page
title: Community
permalink: /community-v1/
---



{% for row in (1..2) %}
    
<div class="row">

    {% for node1 in site.data.communitynav %}
        {% if node1.row != row %}
            {% continue %}
        {% endif %}
        
        
    
        <div class="col-md-4">
        {% include community/node1_in_list.html node=node1 %}                                                              

        {% if node1.title == 'Most Recent' %}        
            {% for i in node1.subnodes %}        
                {% include community/article_in_list.html node=i %}
            {% endfor %}            
        {% else %}        
            {% for node2 in node1.subnodes %}
                {% include community/node2_in_list.html node=node2 %}                               
                {% for node3 in node2.subnodes %}
                    {% include community/node3_in_list.html node=node3 %}                                              
                {% endfor %}                
            {% endfor %}
        {% endif %}
        
        </div>
    {% endfor %}
</div>
    
{% endfor %}
