const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const allResponses = [];
  let apiResponse = null;

  await page.setRequestInterception(true);

  page.on('request', req => {
    req.continue();
  });

  page.on('response', async res => {
    try {
      const url = res.url();
      try {
        allResponses.push({ url, status: res.status(), headers: res.headers() });
      } catch (e) {}
      if (url.includes('/api/distributors')) {
        const status = res.status();
        let text = null;
        try {
          text = await res.text();
        } catch (e) {
          text = null;
        }
        apiResponse = { url, status, bodyText: text };
      }
    } catch (e) {
      // ignore
    }
  });

  const target = process.argv[2] || 'https://domainvast.xyz/distribuidores';
  console.log('Visiting', target);

  // collect console logs for diagnostics (attach before navigation)
  const logs = [];
  page.on('console', msg => {
    try {
      logs.push({ type: msg.type(), text: msg.text() });
      // also print to our runner stdout for live feedback
      console.log('[page.console]', msg.type(), msg.text());
    } catch (e) {}
  });

  try {
    await page.goto(target, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (e) {
    console.error('Page navigation failed:', e.message);
  }

  // Wait extra time for React to mount and for async fetches; then try clicking "Mostrar Mapa" if present
  await new Promise((r) => setTimeout(r, 1000));

  try {
    // Dump button texts to help diagnose why the toggle isn't found
    const buttonList = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(b => (b.innerText || b.textContent || '').trim()).filter(Boolean));
    console.log('Buttons found on page:', JSON.stringify(buttonList));

    // Try multiple strategies to toggle the map: exact text match or includes 'Mapa' (case-insensitive)
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      for (const b of buttons) {
        const text = (b.innerText || b.textContent || '').trim();
        if (!text) continue;
        const t = text.toLowerCase();
        if (t === 'mostrar mapa' || (t.includes('mostrar') && t.includes('mapa')) || t.includes('mapa')) {
          b.click();
          return text;
        }
      }
      return null;
    });
    if (clicked) console.log('Clicked map toggle button with text:', clicked);
    else console.log('No map toggle button clicked');
  } catch (e) {
    console.error('Error while attempting to click map toggle:', e && e.message);
  }

  // wait for XHRs and UI to settle
  await new Promise((r) => setTimeout(r, 6000));

  // Evaluate marker / cluster counts and some diagnostics
  const result = await page.evaluate(() => {
    const markers = document.querySelectorAll('.leaflet-marker-icon').length;
    const clusters = document.querySelectorAll('.marker-cluster').length;
    const hasMap = !!document.querySelector('.leaflet-container');
    const distributorCount = (window.__INITIAL_DISTRIBUTORS__ && window.__INITIAL_DISTRIBUTORS__.length) || null;
    return { markers, clusters, hasMap, distributorCount };
  });

  // Grab HTML snippet for diagnostics
  let htmlSnippet = '';
  try {
    const fullHtml = await page.content();
    htmlSnippet = fullHtml.slice(0, 12000);
  } catch (e) {
    htmlSnippet = '';
  }

  let apiJson = null;
  if (apiResponse && apiResponse.bodyText) {
    try {
      apiJson = JSON.parse(apiResponse.bodyText);
    } catch (e) {
      apiJson = null;
    }
  }

  const out = {
    visited: target,
    apiResponseCaptured: !!apiResponse,
    apiMeta: apiResponse ? { url: apiResponse.url, status: apiResponse.status } : null,
    apiJsonSampleCount: Array.isArray(apiJson) ? apiJson.length : null,
    apiFirstRowSample: Array.isArray(apiJson) && apiJson.length ? apiJson[0] : apiJson,
    markerInfo: result,
    consoleLogs: logs.slice(0,50),
    htmlSnippet: htmlSnippet,
    recentResponses: allResponses.slice(-80)
  };

  console.log(JSON.stringify(out, null, 2));

  try {
    await page.screenshot({ path: './scripts/headless-screenshot-extended.png', fullPage: false });
  } catch (e) {}

  await browser.close();
})();
