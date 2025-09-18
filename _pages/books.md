---
layout: book-shelf
title: bookshelf
permalink: /books/
nav: false
_styles: >
    .input { width: 100%; padding: 10px; margin-bottom: 10px; }
    .button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
    .button:hover { background: #0056b3; }
    .pre { background: #f8f9fa; padding: 15px; border: 1px solid #dee2e6; white-space: pre-wrap; overflow: auto; }
---

> What an astonishing thing a book is. It's a flat object made from a tree with flexible parts on which are imprinted lots of funny dark squiggles. But one glance at it and you're inside the mind of another person, maybe somebody dead for thousands of years. Across the millennia, an author is speaking clearly and silently inside your head, directly to you. Writing is perhaps the greatest of human inventions, binding together people who never knew each other, citizens of distant epochs. Books break the shackles of time. A book is proof that humans are capable of working magic.
>
> -- Carl Sagan, Cosmos, Part 11: The Persistence of Memory (1980)

I created this tool to easily add books to the shelf:

```html
<h1>Goodreads Book Info Extractor</h1>
    <p>Paste a Goodreads book URL (e.g., https://www.goodreads.com/book/show/12345.Book-Title) into the box below and click the button to generate the formatted output.</p>
    <input type="text" id="urlInput" placeholder="https://www.goodreads.com/book/show/...">
    <button onclick="extractBookInfo()">Extract Info</button>
    <pre id="output"></pre>

    <script>
        async function extractBookInfo() {
            const urlInput = document.getElementById('urlInput');
            const output = document.getElementById('output');
            const url = urlInput.value.trim();

            if (!url) {
                alert('Please enter a Goodreads URL.');
                return;
            }

            // Extract book ID from URL
            const bookIdMatch = url.match(/book\/show\/(\d+)/);
            if (!bookIdMatch) {
                alert('Invalid Goodreads URL. Please use a URL like https://www.goodreads.com/book/show/12345.Book-Title');
                return;
            }
            const bookId = bookIdMatch[1];

            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const goodreadsUrl = `https://www.goodreads.com/book/show/${bookId}`;

            try {
                output.textContent = 'Loading...';

                // Fetch Goodreads page via proxy
                const proxyResponse = await fetch(proxyUrl + encodeURIComponent(goodreadsUrl));
                const html = await proxyResponse.text();

                // Parse HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Extract title
                let title = doc.querySelector('#bookTitle')?.textContent.trim() || 
                           doc.querySelector('h1[itemprop="name"]')?.textContent.trim() || 
                           'Unknown Title';

                // Extract author
                let author = doc.querySelector('.authorName')?.textContent.trim() || 
                            doc.querySelector('a[itemprop="author"] span')?.textContent.trim() || 
                            'Unknown Author';

                // Extract description (brief, first paragraph-ish)
                let description = '';
                const descSection = doc.querySelector('#description');
                if (descSection) {
                    // Remove spoiler if present
                    const spoiler = descSection.querySelector && descSection.querySelector('.SpoilerControl');
                    if (spoiler) spoiler.remove();
                    // Get text and take first block
                    const fullDesc = descSection.textContent.trim();
                    description = fullDesc.split('\n\n')[0].trim().replace(/\s+/g, ' ');
                    if (description.includes('See top shelves')) {
                        description = description.split('See top shelves')[0].trim();
                    }
                }

                // Extract genres/categories
                let categories = '';
                const genreLinks = doc.querySelectorAll('a[href^="/genre/"], .bookPageGenreLink');
                if (genreLinks.length > 0) {
                    categories = Array.from(genreLinks).slice(0, 10).map(link => link.textContent.trim()).join(', ');
                } else {
                    categories = 'fiction'; // default
                }

                // Extract release year
                let released = '';
                const yearMatch = html.match(/First published.*?(\d{4})/i);
                if (yearMatch) {
                    released = yearMatch[1];
                }

                // Extract average rating
                let avgRating = doc.querySelector('[itemprop="ratingValue"]')?.textContent.trim() || 
                               doc.querySelector('.average')?.textContent.trim() || 
                               '';
                const stars = avgRating ? Math.round(parseFloat(avgRating)) : 5;

                // Extract number of ratings/reviews
                let goodreadsReview = doc.querySelector('[itemprop="ratingCount"]')?.textContent.trim().replace(/[^\d,]/g, '') || 
                                     html.match(/(\d+(?:,\d+)+)\s*(ratings|reviews)/)?.[1] || 
                                     '';

                // Fetch Open Library ID
                let olid = '';
                try {
                    const searchQuery = `${encodeURIComponent(title)} ${encodeURIComponent(author)}`;
                    const olSearchUrl = `https://openlibrary.org/search.json?q=${searchQuery}&limit=1`;
                    const olResponse = await fetch(olSearchUrl);
                    const olData = await olResponse.json();
                    if (olData.docs && olData.docs.length > 0) {
                        olid = olData.docs[0].key.replace('/books/', '');
                    }
                } catch (olError) {
                    console.warn('Open Library fetch failed:', olError);
                }

                // Amazon buy link (search)
                const amazonLink = `https://www.amazon.com/s?k=${encodeURIComponent(`${title} ${author}`)}`;

                // Generate output
                const formattedOutput = `---
layout: book-review
title: ${title}
author: ${author}
olid: ${olid}
categories: ${categories}
tags: textbook
buy_link: ${amazonLink}
started: 2024-08-23
finished: 2024-09-07
released: ${released}
stars: ${stars}
goodreads_review: ${goodreadsReview}
status: Finished
---
${description}`;

                output.textContent = formattedOutput;

            } catch (error) {
                console.error('Error:', error);
                output.textContent = `Error fetching data: ${error.message}\n\nNote: This tool uses a free proxy which may have limits or occasional issues. Try again or check the console for details.`;
            }
        }
    </script>
```

## Books

