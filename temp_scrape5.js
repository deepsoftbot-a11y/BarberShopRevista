const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('http://163.192.142.183/barberia/', { waitUntil: 'networkidle', timeout: 30000 });

  // Get scroll indicator if exists
  const scrollIndicator = await page.evaluate(() => {
    const allElements = document.querySelectorAll('body *');
    for (const el of allElements) {
      const text = el.innerText?.trim();
      if (text === 'scroll' || text === '↓' || text === 'SCROLL') {
        return {
          text: text,
          parent: el.parentElement?.tagName,
          styles: {
            color: getComputedStyle(el).color,
            fontSize: getComputedStyle(el).fontSize,
            letterSpacing: getComputedStyle(el).letterSpacing,
          }
        };
      }
    }
    return 'no scroll indicator found';
  });
  console.log('=== SCROLL INDICATOR ===');
  console.log(JSON.stringify(scrollIndicator, null, 2));

  // Get the p text in hero section
  const heroP = await page.evaluate(() => {
    const section = document.querySelector('section');
    if (!section) return 'no section';
    const p = section.querySelector('p');
    return p ? { text: p.innerText } : 'no p';
  });
  console.log('\n=== HERO P ===');
  console.log(JSON.stringify(heroP, null, 2));

  // Get location WhatsApp button style
  const whatsAppBtn = await page.evaluate(() => {
    const loc = document.querySelector('#ubicación');
    if (!loc) return 'no loc';
    const links = loc.querySelectorAll('a');
    for (const a of links) {
      if (a.innerText.includes('WhatsApp')) {
        return {
          styles: {
            background: getComputedStyle(a).background,
            color: getComputedStyle(a).color,
            padding: getComputedStyle(a).padding,
            borderRadius: getComputedStyle(a).borderRadius,
            fontSize: getComputedStyle(a).fontSize,
            fontWeight: getComputedStyle(a).fontWeight,
          }
        };
      }
    }
    return 'no whatsapp btn';
  });
  console.log('\n=== WHATSAPP BTN ===');
  console.log(JSON.stringify(whatsAppBtn, null, 2));

  // Check if location section has h2
  const locationH2 = await page.evaluate(() => {
    const loc = document.querySelector('#ubicación');
    if (!loc) return 'no loc';
    const h2 = loc.querySelector('h2');
    return h2 ? { text: h2.innerText, fontSize: getComputedStyle(h2).fontSize, fontWeight: getComputedStyle(h2).fontWeight } : 'no h2';
  });
  console.log('\n=== LOCATION H2 ===');
  console.log(JSON.stringify(locationH2, null, 2));

  // Get service price div
  const servicePrice = await page.evaluate(() => {
    const cards = document.querySelectorAll('#servicios [style*="background: rgb(10, 10, 10)"]');
    if (cards.length === 0) return 'no cards';
    const card = cards[0];
    const priceDiv = card.querySelector('div:nth-child(4)');
    return priceDiv ? {
      text: priceDiv.innerText,
      styles: {
        fontSize: getComputedStyle(priceDiv).fontSize,
        fontWeight: getComputedStyle(priceDiv).fontWeight,
        color: getComputedStyle(priceDiv).color,
        paddingTop: getComputedStyle(priceDiv).paddingTop,
        borderTop: getComputedStyle(priceDiv).borderTop,
      }
    } : 'no price div';
  });
  console.log('\n=== SERVICE PRICE ===');
  console.log(JSON.stringify(servicePrice, null, 2));

  // Get service button
  const serviceBtn = await page.evaluate(() => {
    const cards = document.querySelectorAll('#servicios [style*="background: rgb(10, 10, 10)"]');
    if (cards.length === 0) return 'no cards';
    const card = cards[0];
    const btn = card.querySelector('a[href*="reservar"]');
    return btn ? {
      text: btn.innerText,
      styles: {
        background: getComputedStyle(btn).background,
        color: getComputedStyle(btn).color,
        padding: getComputedStyle(btn).padding,
        border: getComputedStyle(btn).border,
        borderRadius: getComputedStyle(btn).borderRadius,
        fontSize: getComputedStyle(btn).fontSize,
        fontWeight: getComputedStyle(btn).fontWeight,
        display: getComputedStyle(btn).display,
      }
    } : 'no btn';
  });
  console.log('\n=== SERVICE BUTTON ===');
  console.log(JSON.stringify(serviceBtn, null, 2));

  await browser.close();
})();
