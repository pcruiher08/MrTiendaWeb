const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  let apiResponse = null;
  const allResponses = [];

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

  try {
    await page.goto('https://domainvast.xyz', { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (e) {
    console.error('Page navigation failed:', e.message);
  }

  // wait a moment to let frontend JS run and render markers
  await new Promise((r) => setTimeout(r, 4000));

  // collect console logs for diagnostics
  const logs = [];
  page.on('console', msg => {
    try {
      logs.push({ type: msg.type(), text: msg.text() });
    } catch (e) {}
  });

  // Evaluate marker / cluster counts and some diagnostics
  const result = await page.evaluate(() => {
    const markers = document.querySelectorAll('.leaflet-marker-icon').length;
    const clusters = document.querySelectorAll('.marker-cluster').length;
    const hasMap = !!document.querySelector('.leaflet-container');
    return { markers, clusters, hasMap };
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
    apiResponseCaptured: !!apiResponse,
    apiMeta: apiResponse ? { url: apiResponse.url, status: apiResponse.status } : null,
    apiJsonSampleCount: Array.isArray(apiJson) ? apiJson.length : null,
    apiFirstRowSample: Array.isArray(apiJson) && apiJson.length ? apiJson[0] : apiJson,
    markerInfo: result,
    consoleLogs: logs.slice(0,50),
    htmlSnippet: htmlSnippet,
    recentResponses: allResponses.slice(-40)
  };

  console.log(JSON.stringify(out, null, 2));

  try {
    await page.screenshot({ path: './scripts/headless-screenshot.png', fullPage: false });
  } catch (e) {}

  await browser.close();
})();
