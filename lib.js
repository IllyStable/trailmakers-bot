const puppeteer = require('puppeteer');

const scrapeLink = ['https://en.wikipedia.org/wiki/List_of_fighter_aircraft',
                    'https://en.wikipedia.org/wiki/List_of_bomber_aircraft',
                    'https://en.wikipedia.org/wiki/List_of_attack_aircraft']



module.exports = {
    fetch_data: async () => {
        const browser = await puppeteer.launch();

        const page = await browser.newPage();
        
        array = []

        for (link of scrapeLink) {
            await page.goto(link);

            const element = await page.evaluate(() => {
                const regex_a = /<a([^>]+)>(.+?)<\/a>/i;
                const regex_link = /href\s*=\s*(\"([^"]*\")|'[^']*'|([^'">\s]+))/i;

                array = Array.from(document.querySelectorAll("tr"))
                array = array.map(td => ({"text": td.textContent.split('\n'), "link": regex_link.exec(regex_a.exec(td.innerHTML))}))
                array = array.map(td => ({
                    "model": td["text"][1],
                    "country": td["text"][2],
                    "year": td["text"][4],
                    "status": td["text"][5],
                    "made": td["text"][6],
                    "link": td["link"]
                }))
                array = array.filter(td => td.made > 400)

                return array;
            })

            array.push(...element);
        }

        index = Math.floor(Math.random() * array.length)

        element = array[index]

        await page.goto("https://en.wikipedia.org" + element["link"][2].substring(0, element["link"][2].length - 1))

        const image = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("img")).map(img => img.src)
        })

        browser.close();
        return {element, image};
    }
}
