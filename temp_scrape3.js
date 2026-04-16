const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('http://163.192.142.183/barberia/', { waitUntil: 'networkidle', timeout: 30000 });

  // Get the header element structure
  const headerStyles = await page.evaluate(() => {
    const header = document.querySelector('header');
    if (!header) return 'no header';
    const cs = getComputedStyle(header);
    return {
      position: cs.position,
      top: cs.top,
      left: cs.left,
      right: cs.right,
      background: cs.background,
      backdropFilter: cs.backdropFilter,
      zIndex: cs.zIndex,
      padding: cs.padding,
      borderBottom: cs.borderBottom,
    };
  });
  console.log('=== HEADER ===');
  console.log(JSON.stringify(headerStyles, null, 2));

  // Get logo div
  const logoStyles = await page.evaluate(() => {
    const logo = document.querySelector('nav > div:first-child');
    if (!logo) return 'no logo';
    const cs = getComputedStyle(logo);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      letterSpacing: cs.letterSpacing,
    };
  });
  console.log('\n=== LOGO ===');
  console.log(JSON.stringify(logoStyles, null, 2));

  // Get all a tags in nav with their styles
  const navLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('nav a');
    return Array.from(links).map(a => ({
      text: a.innerText,
      href: a.getAttribute('href'),
      styles: {
        color: getComputedStyle(a).color,
        fontSize: getComputedStyle(a).fontSize,
        fontWeight: getComputedStyle(a).fontWeight,
        textDecoration: getComputedStyle(a).textDecoration,
      }
    }));
  });
  console.log('\n=== NAV LINKS ===');
  console.log(JSON.stringify(navLinks, null, 2));

  // Get section backgrounds
  const sectionBgs = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    return Array.from(sections).map(s => ({
      id: s.id || 'no-id',
      bg: getComputedStyle(s).background,
    }));
  });
  console.log('\n=== SECTION BACKGROUNDS ===');
  console.log(JSON.stringify(sectionBgs, null, 2));

  // Check gallery images
  const galleryImages = await page.evaluate(() => {
    const gallery = document.querySelector('#galería');
    if (!gallery) return 'no gallery';
    const items = gallery.querySelectorAll('div > div > div');
    return Array.from(items).map(item => ({
      styles: {
        aspectRatio: getComputedStyle(item).aspectRatio,
        borderRadius: getComputedStyle(item).borderRadius,
        background: getComputedStyle(item).background,
      }
    }));
  });
  console.log('\n=== GALLERY ITEMS ===');
  console.log(JSON.stringify(galleryImages, null, 2));

  // Check the h1 in hero
  const heroH1 = await page.evaluate(() => {
    const h1 = document.querySelector('section h1');
    if (!h1) return 'no h1';
    return {
      fullText: h1.innerText,
      styles: {
        fontSize: getComputedStyle(h1).fontSize,
        fontWeight: getComputedStyle(h1).fontWeight,
        letterSpacing: getComputedStyle(h1).letterSpacing,
        lineHeight: getComputedStyle(h1).lineHeight,
        color: getComputedStyle(h1).color,
      }
    };
  });
  console.log('\n=== HERO H1 ===');
  console.log(JSON.stringify(heroH1, null, 2));

  await browser.close();
})();
