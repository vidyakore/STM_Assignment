const { Builder, By, Key } = require('selenium-webdriver');
const fs = require('fs');

async function scrapeSearchResults(keyword) {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://www.google.com');
    await driver.manage().window().maximize();

    // const searchBox = await driver.findElement(By.className('gLFyf'));
    const searchBox = await driver.findElement(By.xpath('//*[@id="input"]'));
    await searchBox.sendKeys(keyword, Key.RETURN);
    await driver.sleep(2000); // Introduce a 2-second delay

    const searchResults = await driver.findElements(By.css('div.g'));

    const results = [];
    for (let i = 0; i < Math.min(searchResults.length, 10); i++) {
      const result = await searchResults[i].findElement(By.css('a'));
      const url = await result.getAttribute('href');
      results.push(url);
    }

    const data = JSON.stringify(results, null, 2);
    fs.writeFileSync('search_results.json', data);
    console.log('Search results saved to search_results.json');
  } catch(error) {
    console.log("Exception - No result found!");
  }
  finally {
    await driver.quit();
  }
}

// Usage
const keyword = 'NoSuchElementError: no such element: Unable to locate element: {"method":"xpath","selector":"//*[@id="input"]"}(Session info: chrome=113.0.5672.127)at Object.throwDecodedError (C:\Users\I527305\Desktop\Bits\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\node_modules\selenium-webdriver\lib\error.js:524:15) at parseHttpResponse (C:\Users\I527305\Desktop\Bits\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\node_modules\selenium-webdriver\lib\http.js:601:13) at Executor.execute (C:\Users\I527305\Desktop\Bits\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\node_modules\selenium-webdriver\lib\http.js:529:28) at processTicksAndRejections (node:internal/process/task_queues:96:5) at async Driver.execute (C:\Users\I527305\Desktop\Bits\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\node_modules\selenium-webdriver\lib\webdriver.js:745:17) at async scrapeSearchResults (C:\Users\I527305\Desktop\Bits\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\top10WebScrape.js:12:23)';
scrapeSearchResults(keyword);
