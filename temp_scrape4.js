const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('http://163.192.142.183/barberia/', { waitUntil: 'networkidle', timeout: 30000 });

  // Get gallery container styles
  const galleryContainer = await page.evaluate(() => {
    const gallery = document.querySelector('#galería > div');
    if (!gallery) return 'no gallery';
    const cs = getComputedStyle(gallery);
    return {
      maxWidth: cs.maxWidth,
      margin: cs.margin,
    };
  });
  console.log('=== GALLERY CONTAINER ===');
  console.log(JSON.stringify(galleryContainer, null, 2));

  // Footer
  const footer = await page.evaluate(() => {
    const f = document.querySelector('footer');
    if (!f) return 'no footer';
    return {
      text: f.innerText,
      styles: {
        background: getComputedStyle(f).background,
        padding: getComputedStyle(f).padding,
        textAlign: getComputedStyle(f).textAlign,
        color: getComputedStyle(f).color,
        fontSize: getComputedStyle(f).fontSize,
      }
    };
  });
  console.log('\n=== FOOTER ===');
  console.log(JSON.stringify(footer, null, 2));

  // Get service h3 and p
  const serviceText = await page.evaluate(() => {
    const card = document.querySelector('#servicios [style*="background: rgb(10, 10, 10)"]');
    if (!card) return 'no card';
    const h3 = card.querySelector('h3');
    const p = card.querySelector('p');
    return {
      h3: h3 ? { text: h3.innerText, fontWeight: getComputedStyle(h3).fontWeight } : null,
      p: p ? { text: p.innerText, color: getComputedStyle(p).color } : null,
    };
  });
  console.log('\n=== SERVICE TEXT ===');
  console.log(JSON.stringify(serviceText, null, 2));

  // Get all images in gallery
  const galleryImgs = await page.evaluate(() => {
    const gallery = document.querySelector('#galería');
    if (!gallery) return 'no gallery';
    const imgs = gallery.querySelectorAll('img');
    return Array.from(imgs).map(img => ({
      src: img.src,
      alt: img.alt,
      styles: {
        width: getComputedStyle(img).width,
        height: getComputedStyle(img).height,
        objectFit: getComputedStyle(img).objectFit,
      }
    }));
  });
  console.log('\n=== GALLERY IMAGES ===');
  console.log(JSON.stringify(galleryImgs, null, 2));

  // Location section structure
  const locationSection = await page.evaluate(() => {
    const loc = document.querySelector('#ubicación > div');
    if (!loc) return 'no loc';
    return {
      text: loc.innerText.substring(0, 500),
    };
  });
  console.log('\n=== LOCATION CONTENT ===');
  console.log(JSON.stringify(locationSection, null, 2));

  await browser.close();
})();
