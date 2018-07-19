---
layout: post
title: Address parsing and Gazetteer4j 
tagline: 
category: Blog
tags: [this site, job aggregator]
breadcrumb_title: Miscellaneous
breadcrumb_url: /misc/pages.html
---


I'm developing a new functionality: all jobs having office/company address somewhere in job ad text 
will be shown on remote4me with the address straight in the job title.

The idea is to convert all the ambiguous addresses to the `<city>,[state,]<country>` format.

A few examples of address resolving:

|Ambiguous &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Address in proper &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Comment             |
|address           | format &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;          |
|------------------|----------------------------|--------------------|
|Santa Cruz        |  Santa Cruz, CA, USA       |not the Santa Cruz in Spain/Chile/Bolivia|
|Paris             | Paris, France              |not Paris in Texas|
|NYC               | New York City, NY, USA     ||
|FL                | FL, USA                    ||
|Odessa            | Odessa, Ukraine            |not Odessa in Texas|
|Odessa, USA       | Odessa, TX, USA            ||
 
&nbsp;

The key element of this feature is the Java library i'm building: [Gazetteer4j](https://github.com/stargazer33/gazetteer4j)

**By the way, it would be great if maintainers of Open Source Project Repository Hosting at sonatype.org would approve the "Group Id" for this library. The group id is: `com.remote4me`**
 

