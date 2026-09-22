const { puppeteer, username, password, chromeOptions, apiHost, axios, useProxy, userAgents } = require('./config');
const { wait, extractNumber} = require('./functions');
const { getReviewData } = require('./reviews');
const { updateViews } = require('./update');
const { scrollPage } = require('./scroll');

let numReviews, pages, dbData, reviews = null;

const endpoint = `${apiHost}/reviews/process`;

async function start() {
    // get dbData
    await axios.post(endpoint, { limit: 10 })
        .then(function (response) {
            dbData = response.data;
        }).catch(function (error) {
            console.log(error);
        });

    // data rows found
    console.log(`Product views found: ${dbData.length}`);

    for (let i = 0; i < dbData.length; i++) {

        const browser = await puppeteer.launch(chromeOptions);
        const page = (await browser.pages())[0];
        page.setDefaultTimeout(0);

        // set user agent
        await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);

        if (useProxy) {
            await page.authenticate({ username: username, password: password });
        }

        let url = dbData[i].product.url;

        // url = 'https://www.takealot.com/getup-balance-board-black/PLID49378144';

        console.log(`product: ${url}`);

        await page.goto(`${url}`, { waitUntil: "networkidle2" });

        let productReviews = [];

        // scroll page
        await scrollPage(page);

        // get total number of reviews
        try {
            numReviews = await page.evaluate(() => {
            let elements = document.querySelector('div.reviews.cell.shrink a');
            return elements ? elements.innerText : null;
            }
        );

        } catch (error) {
            console.log('** Failed to get number of reviews **');
        }

        // format number of reviews
        if (numReviews) {
            numReviews = extractNumber(numReviews);
            pages = Math.ceil(numReviews / 10);
        }

        console.log(`Reviews found: ${numReviews}`);

        // skip if no reviews
        if (!numReviews) { 
            await updateViews(dbData[i].product.id, 0);
            console.log('Skipping ...');
            continue;
        }

        console.log(`Pages: ${pages}`);

        // get reviews
        for (let j = 1; j <= pages; j++) {

            let pageNum = j;

            reviews = await getReviewData(page, pageNum);

            console.log(`Getting reviews for page ... ${pageNum}`);

            productReviews.push(reviews);
        }

        // console.log(productReviews);

        // process.exit();

        // Insert into DB
        if (reviews) {
            await axios.post(`${apiHost}/reviews/create`, { product_id: dbData[i].product.id, reviews: productReviews })
                .then(function (response) {
                    console.log(response.data)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        // Update product views table
        await updateViews(dbData[i].product.id, numReviews);

        // process.exit();

        // Wait for a few seconds
        if (i < dbData.length - 1) {
            const random = Math.floor(Math.random() * 30) + 1;
            console.log(`Waiting for ${random} seconds...`);
            await wait(random);
        }

        await page.close();
        await browser.close();
    }
}

start().then(() => {
    process.exit();
});
