const { Builder, By, Key } = require('selenium-webdriver');
const fs = require('fs');

function extractDomain(url) {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

function removeSameDomainUrls(urls) {
  let domains = {};
  let uniqueUrls = urls.filter(function(url) {
    // whatever function you're using to parse URLs
    var domain = extractDomain(url);
    if (domains[domain]) {
      // we have seen this domain before, so ignore the URL
      return false;
    }
    // mark domain, retain URL
    domains[domain] = true;
    return true;
  });

  return uniqueUrls;
}

async function scrapeSearchResults() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://www.google.com');
    await driver.manage().window().maximize();

    //Test case 1 : 10 links are found for given keyword
    try {
      let searchBox = await driver.findElement(By.name('q'));
      let keyword = 'sap';
      keyword = keyword.trim();
      if(keyword.length === 0 || !keyword || keyword.length > 2048){
        console.log("Please enter some valid keyword to search");
      }else{
        await searchBox.sendKeys(keyword, Key.RETURN);
        await driver.sleep(2000); // Introduce a 2-second delay

        const searchResults = await driver.findElements(By.css('div.g'));

        const results = [];
        for (let i = 0; i <searchResults.length; i++) {
          const result = await searchResults[i].findElement(By.css('a'));
          const url = await result.getAttribute('href');
          results.push(url);
        }

        resultsUniqueDomains = removeSameDomainUrls(results);

        const finalResults = [];
        for (let i = 0; i < Math.min(resultsUniqueDomains.length, 10); i++) {
          finalResults.push(resultsUniqueDomains[i]);
        }

        const data = JSON.stringify(finalResults, null, 2);
        fs.writeFileSync('search_results.json', data);
        console.log('Test Case1 passed : results saved to search_results.json');
      }
    } catch(error) {
      console.log("Error Occured")
    }

    //Test Case 2 : 1 link is found for given keyword
    try {
      let searchBox2 = await driver.findElement(By.name('q'));
      await searchBox2.clear();
      keyword = "dinkachi chav kay aste"
      await searchBox2.sendKeys(keyword, Key.RETURN);
      await driver.sleep(2000); // Introduce a 2-second delay

      const searchResults = await driver.findElements(By.css('div.g'));

      const results = [];
      for (let i = 0; i < Math.min(searchResults.length, 10); i++) {
        const result = await searchResults[i].findElement(By.css('a'));
        const url = await result.getAttribute('href');
        results.push(url);
      }

      resultsUniqueDomains = removeSameDomainUrls(results);

      const finalResults = [];
      for (let i = 0; i < Math.min(resultsUniqueDomains.length, 10); i++) {
        finalResults.push(resultsUniqueDomains[i]);
      }

      const data = JSON.stringify(finalResults, null, 2);
      fs.writeFileSync('search_results2.json', data);
      console.log('Test Case2 passed : result saved to search_results2.json');
    } catch(error) {
      console.log(error,"Error Occured")
    }

    //Test Case 3 : no found any link for given keyword

    try {
      let searchBox3 = await driver.findElement(By.name('q'));
      await searchBox3.clear();
      keyword = 'NoSuchElementError: no such element: Unable to locate element: {"method":"xpath","selector":"//*[@id="input"]"}(Session info: chrome=113.0.5672.127)at Object.throwDecodedError (C:\Users\I527305\Desktop\Bits\\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\node_modules\selenium-webdriver\lib\error.js:524:15) at parseHttpResponse (C:\Users\I527305\Desktop\Bits\\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\node_modules\selenium-webdriver\lib\http.js:601:13) at Executor.execute (C:\Users\I527305\Desktop\Bits\\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\node_modules\selenium-webdriver\lib\http.js:529:28) at processTicksAndRejections (node:internal/process/task_queues:96:5) at async Driver.execute (C:\Users\I527305\Desktop\Bits\\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\node_modules\selenium-webdriver\lib\webdriver.js:745:17) at async scrapeSearchResults (C:\Users\I527305\Desktop\Bits\\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\top10WebScrape.js:12:23)';
      await searchBox3.sendKeys(keyword, Key.RETURN);
      await driver.sleep(2000); // Introduce a 2-second delay

      const searchResults = await driver.findElements(By.css('div.g'));

      const results = [];
      for (let i = 0; i < Math.min(searchResults.length, 10); i++) {
        const result = await searchResults[i].findElement(By.css('a'));
        const url = await result.getAttribute('href');
        results.push(url);
      }

      const data = JSON.stringify(results, null, 2);
      fs.writeFileSync('search_results3.json', data);
      console.log('Test Case3 passed : results saved to search_results3.json');
    } catch(error) {
      console.log(error,"Error Occured")
    }

  } catch(error) {
    console.log(error,"Exception - No result found!");
  }
  finally {
    await driver.quit();
  }
}


//call the webscraping function
scrapeSearchResults();
