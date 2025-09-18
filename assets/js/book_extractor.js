async function searchBooks() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        alert('Please enter a search query.');
        return;
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Loading...';

    try {
        const searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_name,first_publish_year,subject,edition_key,ratings_average,ratings_count,want_to_read_count&limit=10`;
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
            div.innerHTML = `<strong>${book.title}</strong> by ${author} (${year}) <button onclick="generateOutput('${book.key}', '${encodeURIComponent(JSON.stringify(book))}')">Select</button>`;
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

        // Stars
        const stars = book.ratings_average ? book.ratings_average.toFixed(1) : '4.0';

        // Review count: Use ratings_count if available, else want_to_read_count
        const reviewCount = book.ratings_count || book.want_to_read_count || 0;

        // Author
        const author = book.author_name ? book.author_name.join(', ') : 'Unknown';

        // Title
        const title = book.title || 'Unknown';

        // Amazon buy link
        // const workUrl = `https://openlibrary.org${workKey}.json`;
        // const editionUrl = `https://openlibrary.org/books/${editionKey}.json`;

        // For scraping the Amazon link, we need a proxy to avoid browser CORS errors
        // const proxyUrl = 'https://api.allorigins.win/raw?url=';
        // const bookPageUrl = `https://openlibrary.org/books/${editionKey}`;
        //
        // const [workResponse, editionResponse, pageResponse] = await Promise.all([
        //     fetch(workUrl),
        //     fetch(editionUrl),
        //     fetch(proxyUrl + encodeURIComponent(bookPageUrl))
        // ]);
        //
        // if (!workResponse.ok || !editionResponse.ok) throw new Error('Could not fetch book data from API.');
        // if (!pageResponse.ok) console.warn('Could not fetch book page for scraping, Amazon link may be a fallback.');
        //
        // const workData = await workResponse.json();
        // const editionData = await editionResponse.json();
        // const pageHtml = await pageResponse.text();
        //
        // const parser = new DOMParser();
        // const doc = parser.parseFromString(pageHtml, 'text/html');
        // const amazonLinkEl = doc.querySelector('.prices-amazon a');
        // let amazonLink = `https://www.amazon.com/s?k=${encodeURIComponent(`${title} ${author}`)}`; // Fallback
        // if(amazonLinkEl && amazonLinkEl.href) {
        //     amazonLink = amazonLinkEl.href;
        // }
        const amazonLink = `https://www.amazon.com/s?k=${encodeURIComponent(`${title} ${author}`)}`;

        // For the start and finished dates
        const today = new Date().toISOString().split('T')[0];

        // Formatted output
        const formattedOutput = `---
    layout: book-review
    title: ${title}
    author: ${author}
    olid: ${olid}
    categories: ${categories}
    buy_link: ${amazonLink}
    started: ${today}
    finished: ${today}
    released: ${released}
    stars: ${stars}
    tags: textbook
    status: Finished
    ---
    ${description}`;

        output.textContent = formattedOutput;
    } catch (error) {
        output.textContent = `Error generating output: ${error.message}`;
    }
}