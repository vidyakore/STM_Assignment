const { Builder, By, Key } = require('selenium-webdriver');
const fs = require('fs');
const natural = require('natural');

function extractDomain(url) {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

function removeSameDomainUrls(urls) {
  let domains = {};
  let uniqueUrls = urls.filter(function (url) {
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

function getMostRelevantKeyword(sentence){
  const tokenizer = new natural.WordTokenizer();
  const sentenceTokens = tokenizer.tokenize(sentence);
  
  const stemmer = natural.PorterStemmer;
  const tfidf = new natural.TfIdf();

  // Add sentence tokens to the TfIdf instance
  tfidf.addDocument(sentenceTokens.join(' '));

  let mostRelevantKeyword = '';
  let maxTfidf = 0;

  // Find the most relevant keyword by calculating the highest TfIdf score
  tfidf.listTerms(0).forEach((item) => {
    if (item.tfidf > maxTfidf) {
      mostRelevantKeyword = stemmer.stem(item.term);
      maxTfidf = item.tfidf;
    }
  });
  return mostRelevantKeyword;
}

async function scrapeSearchResults(keywords) {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://www.google.com');
    await driver.manage().window().maximize();

    for (let i = 0; i < keywords.length; i++) {
      var keyword = keywords[i].trim();

      if (keyword.length === 0 || !keyword || keyword.length > 2048) {
        console.log("Test Case 1 Passed: skipped Invalid keyword!");
      } else {
        let searchBox = await driver.findElement(By.name('q'));
        await searchBox.clear();
        if(i == (keywords.length)-1 || i == (keywords.length)-2 || i == (keywords.length)-3){
          keyword = getMostRelevantKeyword(keyword);
        }
        await searchBox.sendKeys(keyword, Key.RETURN);
        await driver.sleep(2000); // Introduce a 2-second delay

        const searchResults = await driver.findElements(By.css('div.g'));

        const results = [];
        for (let i = 0; i < Math.min(searchResults.length, 10); i++) {
          const result = await searchResults[i].findElement(By.css('a'));
          const url = await result.getAttribute('href');
          results.push(url);
        }

        const resultsUniqueDomains = removeSameDomainUrls(results);

        const finalResults = [];
        for (let i = 0; i < Math.min(resultsUniqueDomains.length, 10); i++) {
          finalResults.push(resultsUniqueDomains[i]);
        }

        const data = JSON.stringify(finalResults, null, 2);
        const filename = `search_results${i + 1}.json`;
        fs.writeFileSync(filename, data);
        console.log(`Test Case ${i + 1} passed: results saved to ${filename}`);
      }
    }
  } catch (error) {
    console.log("Exception - No result found!", error);
  } finally {
    await driver.quit();
  }
}

// Keywords to search
const keywords = [
  ' ',
  'Cloud Computing',
  'Dinkachi chav kay aste',
  'NoSuchElementError: no such element: Unable to locate element: {"method":"xpath","selector":"//*[@id="input"]"}(Session info: chrome=113.0.5672.127)at Object.throwDecodedError (C:\Users\I527305\Desktop\Bits\\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\node_modules\selenium-webdriver\lib\error.js:524:15) at parseHttpResponse (C:\Users\I527305\Desktop\Bits\\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\node_modules\selenium-webdriver\lib\http.js:601:13) at Executor.execute (C:\Users\I527305\Desktop\Bits\\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\node_modules\selenium-webdriver\lib\http.js:529:28) at processTicksAndRejections (node:internal/process/task_queues:96:5) at async Driver.execute (C:\Users\I527305\Desktop\Bits\\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\node_modules\selenium-webdriver\lib\webdriver.js:745:17) at async scrapeSearchResults (C:\Users\I527305\Desktop\Bits\\2nd sem\Software Testing methodologies\STM Lab\Assignment1_WebScraping\top10WebScrape.js:12:23)',
  'is it raining today',
  'rain will be there tomorrow ?',
  'its raining today , shall I go for dinner ?'
];

// Call the webscraping function with keywords
scrapeSearchResults(keywords);
