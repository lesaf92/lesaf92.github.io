---
layout: page-with-script
title: Book Extractor tool
description: A tool to easily add books in this website.
img: https://openlibrary.org/static/images/openlibrary-logo-tighter.svg
importance: 1
category: webapp
related_publications: false
giscus_comments: true
_scripts: assets/js/book_extractor.js
_styles: >
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    input { width: 100%; padding: 10px; margin-bottom: 10px; }
    button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
    button:hover { background: #0056b3; }
    pre { background: #f8f9fa; padding: 15px; border: 1px solid #dee2e6; white-space: pre-wrap; overflow: auto; }
    #results div { margin-bottom: 10px; border-bottom: 1px solid #eee; padding: 10px 0; }
    #results button { margin-left: 10px; padding: 5px 10px; font-size: 0.9em; }
---
{% include figure.liquid loading="eager" path="https://openlibrary.org/static/images/openlibrary-logo-tighter.svg" title="openlibrary" class="img-fluid rounded z-depth-1" zoomable=true %}

Enter a book title or author into the search box below. Select the correct book from the results (here hardcoded to 20 entries) to generate the formatted output at the bottom of the page.
If the cover is not placed after the book is added to the website, check another entry, you probably chose the one the bots added to the database without a cover 😕.

<input type="text" id="searchInput" placeholder="Enter book title or author">
<button onclick="searchBooks()">Search</button>
<div id="results"></div>
<pre id="output"></pre>
