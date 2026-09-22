const { puppeteer, chromeOptions, axios, apiHost } = require('./config');
const { userAgents } = require('./agents');
const { keywords } = require('./keywords');
const { wait, formatKeyword } = require('./functions');
const { scrollPage } = require('./scroll');
const processEndpoint = `${apiHost}/api/schools/process-search-results`;
const fs = require('fs');

let pageData = results = null;

async function start() {
    const browser = await puppeteer.launch(chromeOptions);
    console.log(`Browser agents loaded: ${userAgents.length}`);
    console.log(`Keywords found: ${keywords.length}`);

    for (const item of keywords) {
        const [page] = await browser.pages();
        let userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        let keyword = item.keyword;

        console.log(`Selected Keyword: ${keyword}`);
        console.log(`Selected Browser: ${userAgent}`);

        await page.setUserAgent(userAgent);
        
        const pageOrder = [0];

        for (const pageNumber of pageOrder) {
            let url = `https://www.google.com/search?q=${formatKeyword(keyword)}&num=200&start=${pageNumber}`;
            console.log(`URL: ${url}`);

            await page.goto(url, { waitUntil: "networkidle2" });

            try {
                await scrollPage(page);
                fs.writeFileSync('data/page.html', await page.content());

                results = await page.evaluate((currentQuery, currentPage) => {
                    const items = [];

                    // Helpers
                    const clean = text => (text || "").replace(/\s+/g, " ").trim();

                    function normalizeUrl(href) {
                        if (!href) return "";
                        if (href.startsWith("/url?")) {
                            try {
                                const url = new URL(href, location.origin);
                                return url.searchParams.get("url") || url.searchParams.get("q") || href;
                            } catch (e) {}
                        }
                        // Remove fragment starting with :~:text=
                        const hashIndex = href.indexOf('#:~:text=');
                        if (hashIndex !== -1) {
                            href = href.substring(0, hashIndex);
                        }
                        return href;
                    }

                    function isExternal(url) {
                        return url.startsWith("http") && !url.includes("google.");
                    }

                    // Find result cards
                    const cards = [];
                    const visited = new Set();
                    document.querySelectorAll("h3").forEach(h3 => {
                        let node = h3.parentElement;
                        while (node && node !== document.body) {
                            const headings = node.querySelectorAll("h3");
                            const links = [...node.querySelectorAll("a[href]")].filter(a =>
                                isExternal(normalizeUrl(a.getAttribute("href") || ""))
                            );
                            const textLength = clean(node.innerText).length;
                            if (headings.length === 1 && links.length >= 1 && textLength > 100) {
                                if (!visited.has(node)) {
                                    visited.add(node);
                                    cards.push(node);
                                }
                                break;
                            }
                            node = node.parentElement;
                        }
                    });

                    // Parse each card
                    cards.forEach((card, index) => {
                        const h3 = card.querySelector("h3");
                        if (!h3) return;
                        const title = clean(h3.innerText);

                        const anchor = [...card.querySelectorAll("a[href]")]
                            .find(a => isExternal(normalizeUrl(a.getAttribute("href"))));
                        if (!anchor) return;
                        const link = normalizeUrl(anchor.getAttribute("href"));

                        // ----- IMPROVED SNIPPET EXTRACTION -----
                        let snippet = "";

                        // 1) Find the "Read more" link by its fragment pattern
                        const readMore = card.querySelector('a[href*="#:~:text="]');
                        if (readMore) {
                            // The snippet container is often the parent of the link, or the grandparent
                            let container = readMore.parentElement;
                            // Sometimes the link is inside a <span> or <div>; we want the block that holds the text
                            // Move up until we find a block with enough text
                            while (container && container !== card) {
                                const text = clean(container.innerText);
                                if (text.length > 20 && container.children.length > 1) {
                                    break;
                                }
                                container = container.parentElement;
                            }
                            if (container) {
                                const clone = container.cloneNode(true);
                                // Remove all links inside (including the "Read more")
                                clone.querySelectorAll('a').forEach(a => a.remove());
                                snippet = clean(clone.innerText);
                                // Remove the title if it accidentally got included
                                if (snippet.startsWith(title)) {
                                    snippet = snippet.substring(title.length).trim();
                                }
                            }
                        }

                        // 2) Fallback: use the original scoring method
                        if (!snippet) {
                            const clone = card.cloneNode(true);
                            clone.querySelectorAll("h3,script,style,svg,img,button,noscript")
                                .forEach(el => el.remove());
                            clone.querySelectorAll("a").forEach(a => {
                                if (a.querySelector("h3")) return;
                                const text = clean(a.innerText);
                                if (text.length < 40 || text.includes("›") || text.startsWith("http")) {
                                    a.remove();
                                }
                            });

                            const seen = new Set();
                            let bestScore = -Infinity;
                            clone.querySelectorAll("*").forEach(el => {
                                if (el.children.length) return;
                                const text = clean(el.innerText);
                                if (!text || seen.has(text)) return;
                                seen.add(text);
                                let score = text.length;
                                // Positive signals
                                if (/@/.test(text)) score += 150;
                                if (/\bemail\b/i.test(text)) score += 80;
                                if (/\bcontact\b/i.test(text)) score += 80;
                                if (/\bphone\b/i.test(text)) score += 50;
                                if (/\bcall\b/i.test(text)) score += 40;
                                if (/\baddress\b/i.test(text)) score += 30;
                                if (/\bappointment\b/i.test(text)) score += 20;
                                if (text.length > 120) score += 40;
                                // Negative signals
                                if (text === title) score -= 500;
                                if (text.startsWith("http")) score -= 500;
                                if (text.includes("›")) score -= 300;
                                if (!text.includes(" ")) score -= 150;
                                if (text.length < 20) score -= 200;
                                if (/^[a-z0-9-_/]+$/i.test(text)) score -= 200;
                                if ((text.match(/[>|]/g) || []).length > 2) score -= 200;
                                if (score > bestScore) {
                                    bestScore = score;
                                    snippet = text;
                                }
                            });

                            if (!snippet) {
                                snippet = clean(clone.innerText).replace(title, "").substring(0, 300);
                            }
                        }

                        items.push({
                            position: index + 1,
                            title,
                            link,
                            snippet,
                            query: currentQuery,
                            page: currentPage,
                        });
                    });

                    return items;
                }, keyword, pageNumber);

                results = results.filter(item => !item.link.startsWith('https://www.google.com'));

                const payload = {
                    search_results: results,
                    limit: 250,
                    no_ai: false,
                };

                console.log(`Extracted ${results.length} results for: ${keyword}`);
                console.log('Payload:', JSON.stringify(payload, null, 2));

                if (results.length > 0) {
                    fs.writeFileSync('data/results.json', JSON.stringify(payload, null, 2));
                }

                await axios.post(processEndpoint, payload)
                    .then(response => console.log('API response:', response.status, response.data))
                    .catch(error => console.log('API error:', error.message));

            } catch (error) {
                console.log('Error: ', error.toString());
            }

            const random = Math.floor(Math.random() * 20) + 10;
            console.log(`Waiting for ${random} seconds...`);
            await wait(random);
        }

        const random = Math.floor(Math.random() * 30) + 1;
        console.log(`Waiting for ${random} seconds...`);
        await wait(random);
    }

    await browser.close();
    process.exit();
}

start();