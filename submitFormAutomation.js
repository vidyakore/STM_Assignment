const { Builder, By } = require('selenium-webdriver');

async function fillOutAndSubmitForm() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://boheco.com/pages/contact'); // Replace with the URL of the form
    await driver.manage().window().maximize();
    const reachUsElementPath = '//*[@id="shopify-section-template--16752723263701__164662798233395ede"]/div/div/div/div/div[1]/a/p';
    const reachUselement = await driver.findElement(By.xpath(reachUsElementPath));
    reachUselement.click();
    const nameElement = await driver.findElement(By.xpath('//*[@id="Form-template--16752723263701__contact-0"]')); // Replace with the actual element locator
    await nameElement.sendKeys('John Doe');

    const emailElement = await driver.findElement(By.xpath('//*[@id="Form-template--16752723263701__contact-1"]')); // Replace with the actual element locator
    await emailElement.sendKeys('johndoe@example.com');

    const phoneNoElement = await driver.findElement(By.xpath('//*[@id="Form-template--16752723263701__contact-2"]')); // Replace with the actual element locator
    await phoneNoElement.sendKeys('1234567890');

    const productQueryElement = await driver.findElement(By.xpath('//*[@id="Form-template--16752723263701__contact-3"]')); // Replace with the actual element locator
    productQueryElement.click();
    await driver.sleep(2000);
    driver.findElement(By.xpath('//*[@id="Form-template--16752723263701__contact-3"]/option[2]')).click();

    const messageElement = await driver.findElement(By.xpath('//*[@id="Form-template--16752723263701__contact-4"]')); // Replace with the actual element locator
    await messageElement.sendKeys('message from John Doe');

    // Scroll to the element
    // await driver.executeScript('arguments[0].scrollIntoView();', nameElement);
    // await driver.executeScript('window.scrollTo(1.5, document.body.scrollHeight);');
    // // Fill out form fields
    // await driver.findElement(By.xpath('//input[@type = \'text\' and @jsname=\'YPqjbf\' and @aria-labelledby=\'i1\']')).sendKeys('John Doe');
    // await driver.sleep(2000);
    // await driver.findElement(By.xpath('//input[@type = 'email']')).sendKeys('johndoe@example.com');
    // await driver.findElement(By.xpath('phone')).sendKeys('1234567890');
    // await driver.findElement(By.xpath('message')).sendKeys('Hello, this is my message.');
    // await driver.findElement(By.xpath('//textarea')).sendKeys('123 Main St');

    // // Submit the form
    // await driver.findElement(By.tagName('form')).submit();

    // console.log('Form submitted successfully!');
  } finally {
    // await driver.quit();
  }
}

// Usage
fillOutAndSubmitForm();
