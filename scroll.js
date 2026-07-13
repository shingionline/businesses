async function scrollPage(page) {

    // scroll to bottom of page
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 1;
            var scrollSeconds = 5;
            var timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;
            });

            setTimeout(() => {
                clearInterval(timer);
                resolve();
            }, scrollSeconds * 1000);

        });
    });

}

module.exports = { scrollPage };

