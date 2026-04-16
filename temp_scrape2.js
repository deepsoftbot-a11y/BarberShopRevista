const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('http://163.192.142.183/barberia/', { waitUntil: 'networkidle', timeout: 30000 });

  // Get full computed styles for hero section
  const heroStyles = await page.evaluate(() => {
    const hero = document.querySelector('section');
    if (!hero) return 'no hero found';
    const cs = getComputedStyle(hero);
    return {
      background: cs.background,
      minHeight: cs.minHeight,
      display: cs.display,
      alignItems: cs.alignItems,
      justifyContent: cs.justifyContent,
      position: cs.position,
      overflow: cs.overflow,
      padding: cs.padding,
    };
  });
  console.log('=== HERO SECTION ===');
  console.log(JSON.stringify(heroStyles, null, 2));

  // Get nav styles
  const navStyles = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    if (!nav) return 'no nav found';
    const cs = getComputedStyle(nav);
    return {
      maxWidth: cs.maxWidth,
      margin: cs.margin,
      padding: cs.padding,
      display: cs.display,
      justifyContent: cs.justifyContent,
      alignItems: cs.alignItems,
    };
  });
  console.log('\n=== NAV ===');
  console.log(JSON.stringify(navStyles, null, 2));

  // Get all service card styles
  const serviceStyles = await page.evaluate(() => {
    const cards = document.querySelectorAll('#servicios > div > div > div');
    return Array.from(cards).slice(0, 1).map(card => {
      const cs = getComputedStyle(card);
      return {
        background: cs.background,
        padding: cs.padding,
        borderRadius: cs.borderRadius,
        textAlign: cs.textAlign,
        border: cs.border,
      };
    });
  });
  console.log('\n=== SERVICE CARD ===');
  console.log(JSON.stringify(serviceStyles, null, 2));

  // Get the button styles in hero
  const buttonStyles = await page.evaluate(() => {
    const btn = document.querySelector('section a');
    if (!btn) return 'no button found';
    const cs = getComputedStyle(btn);
    return {
      padding: cs.padding,
      background: cs.background,
      color: cs.color,
      fontWeight: cs.fontWeight,
      borderRadius: cs.borderRadius,
      fontSize: cs.fontSize,
      textTransform: cs.textTransform,
      display: cs.display,
    };
  });
  console.log('\n=== BUTTON ===');
  console.log(JSON.stringify(buttonStyles, null, 2));

  // Get font info
  const fontInfo = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return 'no h1';
    const cs = getComputedStyle(h1);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      letterSpacing: cs.letterSpacing,
      lineHeight: cs.lineHeight,
      fontFamily: cs.fontFamily,
    };
  });
  console.log('\n=== H1 ===');
  console.log(JSON.stringify(fontInfo, null, 2));

  // Get gallery grid
  const galleryInfo = await page.evaluate(() => {
    const gallery = document.querySelector('#galería');
    if (!gallery) return 'no gallery';
    const grid = gallery.querySelector('div > div');
    if (!grid) return 'no grid';
    const cs = getComputedStyle(grid);
    return {
      display: cs.display,
      gridTemplateColumns: cs.gridTemplateColumns,
      gap: cs.gap,
    };
  });
  console.log('\n=== GALLERY GRID ===');
  console.log(JSON.stringify(galleryInfo, null, 2));

  // Get body background
  const bodyStyles = await page.evaluate(() => {
    const body = document.body;
    return {
      background: getComputedStyle(body).background,
    };
  });
  console.log('\n=== BODY ===');
  console.log(JSON.stringify(bodyStyles, null, 2));

  await browser.close();
})();
