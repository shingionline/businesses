const { puppeteer, chromeOptions, axios, apiHost } = require('./config');
const { userAgents } = require('./agents');
const { keywords } = require('./keywords');
const { wait, formatKeyword } = require('./functions');
const { scrollPage } = require('./scroll');
const processEndpoint = `${apiHost}/api/schools/process-search-results`;
const fs = require('fs');

let pageData = results = null;

async function start() {

    // launch browser
    const browser = await puppeteer.launch(chromeOptions);

    console.log(`Browser agents loaded: ${userAgents.length}`);
    console.log(`Keywords found: ${keywords.length}`);

    for (const item of keywords) {

        const [page] = await browser.pages()

        // set browser agent
        let userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        console.log(`Using: ${userAgent}`);
        await page.setUserAgent(userAgent);

        let keyword = item.keyword;

        const pageOrder = [0];

        for (const pageNumber of pageOrder) {
            
            let url = `https://www.google.com/search?q=${formatKeyword(keyword)}&num=200&start=${pageNumber}`;

            console.log(`URL: ${url}`);

            await page.goto(url, { waitUntil: "networkidle2" });

            try {
                // scroll page
                await scrollPage(page);

                // dump raw HTML so we can inspect what Google actually returned
                fs.writeFileSync('data/page.html', await page.content());

                results = await page.evaluate((currentQuery, currentPage) => {

                    const items = [];

                    //--------------------------------------------------
                    // Helpers
                    //--------------------------------------------------

                    const clean = text =>
                        (text || "").replace(/\s+/g, " ").trim();

                    function normalizeUrl(href) {
                        if (!href) return "";
                        if (href.startsWith("/url?")) {
                            try {
                                const url = new URL(href, location.origin);
                                return (
                                    url.searchParams.get("url") ||
                                    url.searchParams.get("q") ||
                                    href
                                );
                            } catch (e) { }
                        }
                        return href;
                    }

                    function isExternal(url) {
                        return url.startsWith("http") && !url.includes("google.");
                    }

                    //--------------------------------------------------
                    // Discover result cards
                    //--------------------------------------------------

                    const cards = [];
                    const visited = new Set();

                    document.querySelectorAll("h3").forEach(h3 => {
                        
                        // Find the true parent container of the result
                        // .MjjYud / .g = Standard organic wrappers
                        // .tF2Cxc = Inner content wrapper
                        // .wQiwMc = PAA (People Also Ask) container
                        let card = h3.closest('.MjjYud, .g, .tF2Cxc, .wQiwMc');

                        // If Google completely rewrites classes, walk up 4 levels to be safe
                        if (!card) {
                            let node = h3.parentElement;
                            let levels = 0;
                            while (node && node !== document.body && levels < 4) {
                                card = node;
                                node = node.parentElement;
                                levels++;
                            }
                        }

                        if (card && !visited.has(card)) {
                            // Verify it's a valid external link
                            const anchor = [...card.querySelectorAll("a[href]")].find(a =>
                                isExternal(normalizeUrl(a.getAttribute("href")))
                            );

                            if (anchor) {
                                visited.add(card);
                                cards.push(card);
                            }
                        }
                    });

                    //--------------------------------------------------
                    // Parse cards
                    //--------------------------------------------------

                    cards.forEach((card, index) => {

                        const h3 = card.querySelector("h3");
                        if (!h3) return;

                        const title = clean(h3.innerText);

                        const anchor = [...card.querySelectorAll("a[href]")]
                            .find(a => isExternal(normalizeUrl(a.getAttribute("href"))));

                        if (!anchor) return;

                        const link = normalizeUrl(anchor.getAttribute("href"));

                        //--------------------------------------------------
                        // Find snippet
                        //--------------------------------------------------

                        let snippet = "";

                        // 1. Direct CSS Selectors (Google's most common snippet containers)
                        const snippetSelectors = [
                            '.VwiC3b',                           // Standard organic snippet
                            '.hgKElc',                           // Featured snippet / PAA answer
                            '.LGOjhe',                           // PAA wrapper
                            '[data-attrid="wa:/description"]',   // Explicit description attribute
                            '.IsZvec',                           // Alternate snippet class
                            '.aCOpRe',                           // Older snippet class
                            '[style*="-webkit-line-clamp:2"]',   // Truncated text (2 lines)
                            '[style*="-webkit-line-clamp:3"]'    // Truncated text (3 lines)
                        ];

                        for (const selector of snippetSelectors) {
                            const el = card.querySelector(selector);
                            if (el && clean(el.innerText).length > 20) {
                                snippet = clean(el.innerText);
                                break;
                            }
                        }

                        // 2. Fallback heuristic
                        if (!snippet) {
                            const clone = card.cloneNode(true);

                            // Aggressively remove junk: headings, icons, breadcrumbs (<cite>), site names (.VuuXrf)
                            clone.querySelectorAll(
                                "h3, script, style, svg, img, button, noscript, cite, .VuuXrf, [role='button'], nav, header"
                            ).forEach(el => el.remove());

                            // Remove remaining links that look like breadcrumbs
                            clone.querySelectorAll("a").forEach(a => {
                                const text = clean(a.innerText);
                                if (text.includes("›") || text.startsWith("http")) {
                                    a.remove();
                                }
                            });

                            let bestScore = -Infinity;

                            clone.querySelectorAll("*").forEach(el => {
                                // Only process leaf nodes or nodes with minimal nesting
                                if (el.children.length > 2) return;

                                const text = clean(el.innerText);
                                if (!text || text === title) return;

                                let score = text.length;

                                if (/@/.test(text)) score += 100;
                                if (/\b(email|contact|phone|call)\b/i.test(text)) score += 50;

                                if (text.includes("›")) score -= 200;
                                if (text.startsWith("http")) score -= 200;
                                if (!text.includes(" ")) score -= 200;
                                if (text.length < 30) score -= 100;

                                if (score > bestScore) {
                                    bestScore = score;
                                    snippet = text;
                                }
                            });

                            // Ultimate fallback: Just grab whatever text is left
                            if (!snippet) {
                                snippet = clean(clone.innerText).replace(title, "").substring(0, 300);
                            }
                        }

                        // Clean up inline "Read more" links that Google frequently appends to the text
                        snippet = snippet.replace(/^(Read more|View details)\s*/i, "");
                        snippet = snippet.replace(/\s*Read more$/i, "");
                        snippet = snippet.trim();

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

                // exclude Google's own internal links
                results = results.filter(item => !item.link.startsWith('https://www.google.com'));

                const payload = {
                    search_results: results,
                    limit: 250,
                    no_ai: false,
                };

                console.log(`Extracted ${results.length} results for: ${keyword}`);

                console.log('Payload:', JSON.stringify(payload, null, 2));

                // process.exit();

                // save payload locally
                if (results.length > 0) {
                    fs.writeFileSync('data/results.json', JSON.stringify(payload, null, 2));
                }

                // send to backend
                await axios.post(processEndpoint, payload)
                    .then(function (response) {
                        console.log('API response:', response.status, response.data);
                    })
                    .catch(function (error) {
                        console.log('API error:', error.message);
                    });

            } catch (error) {
                let errorMsg = error.toString();
                console.log('Error: ', errorMsg);
            }

            // wait for a random of seconds between 10 and 30
            const random = Math.floor(Math.random() * 20) + 10;
            console.log(`Waiting for ${random} seconds...`);
            await wait(random);
        }

        // wait for a few seconds
        const random = Math.floor(Math.random() * 30) + 1;
        console.log(`Waiting for ${random} seconds...`);
        await wait(random);

    }

    await browser.close();
    process.exit();

}

start();
