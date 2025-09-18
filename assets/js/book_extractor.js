async function searchBooks() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        alert('Please enter a search query.');
        return;
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Loading...';

    try {
        const searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_name,first_publish_year,subject,edition_key&limit=10`;
        const response = await fetch(searchUrl);
        const data = await response.json();

        resultsDiv.innerHTML = '';
        if (data.numFound === 0) {
            resultsDiv.innerHTML = 'No results found.';
            return;
        }

        data.docs.forEach((book) => {
            const div = document.createElement('div');
            const author = book.author_name ? book.author_name.join(', ') : 'Unknown';
            const year = book.first_publish_year || 'Unknown';
            div.innerHTML = `${book.title} by ${author} (${year}) <button onclick="generateOutput('${book.key}', '${encodeURIComponent(JSON.stringify(book))}')">Select</button>`;
            resultsDiv.appendChild(div);
        });
    } catch (error) {
        resultsDiv.innerHTML = `Error: ${error.message}`;
    }
}

async function generateOutput(workKey, encodedBook) {
    const book = JSON.parse(decodeURIComponent(encodedBook));
    const output = document.getElementById('output');
    output.textContent = 'Generating...';

    try {
        // Fetch work details for description
        const workUrl = `https://openlibrary.org${workKey}.json`;
        const workResponse = await fetch(workUrl);
        const workDetails = await workResponse.json();

        // Description
        let description = '';
        if (workDetails.description) {
            description = typeof workDetails.description === 'string' ? workDetails.description : workDetails.description.value;
            description = description.trim().replace(/\s+/g, ' ').split('. ').slice(0, 3).join('. ') + '.'; // Brief
        } else if (workDetails.excerpts) {
            description = workDetails.excerpts[0].excerpt;
        }

        // OLID: Use first edition_key if available
        const olid = book.edition_key && book.edition_key.length > 0 ? book.edition_key[0] : '';

        // Categories
        const categories = book.subject ? book.subject.slice(0, 5).join(', ') : 'fiction';

        // Released
        const released = book.first_publish_year || '';

        // Author
        const author = book.author_name ? book.author_name.join(', ') : 'Unknown';

        // Title
        const title = book.title || 'Unknown';

        // Amazon buy link
        const amazonLink = `https://www.amazon.com/s?k=${encodeURIComponent(`${title} ${author}`)}`;

        // For the start and finished dates
        const today = new Date().toISOString().split('T')[0];

        // Formatted output
        const formattedOutput = `---
layout: book-review
title: ${title}
author: ${author}
olid: ${olid}
buy_link: ${amazonLink}
started: ${today}
finished: ${today}
released: ${released}
tags: ${categories}
categories: textbook
status: Finished
---
${description}`;

        output.textContent = formattedOutput;
    } catch (error) {
        output.textContent = `Error generating output: ${error.message}`;
    }
}