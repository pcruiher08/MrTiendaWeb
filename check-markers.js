import puppeteer from 'puppeteer';

async function checkMarkers() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const errors = [];
  const consoleMessages = [];

  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  const requests = [];

  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      timestamp: Date.now()
    });
  });

  page.on('response', response => {
    const matchingRequest = requests.find(r => r.url === response.url());
    if (matchingRequest) {
      matchingRequest.status = response.status();
      matchingRequest.responseTime = Date.now() - matchingRequest.timestamp;
    }
  });

  try {
    console.log('Navigating to app...');
    await page.goto('https://mrtienda-web.blackdune-7cf95843.eastus2.azurecontainerapps.io', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Page loaded, checking content...');
    const title = await page.title();
    console.log('Page title:', title);

    // Wait a bit more for JS to load
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Checking for map container...');
    const mapExists = await page.evaluate(() => {
      return !!document.querySelector('.leaflet-container');
    });
    console.log('Map container exists:', mapExists);

    if (!mapExists) {
      console.log('Checking for JavaScript errors...');
      if (errors.length > 0) {
        console.log('Page errors:', errors);
      }
      if (consoleMessages.length > 0) {
        console.log('Console messages:', consoleMessages.slice(-10)); // Last 10 messages
      }

      // Check if the distribuidores page is accessible
      console.log('Trying to navigate to distribuidores page...');
      await page.goto('https://mrtienda-web.blackdune-7cf95843.eastus2.azurecontainerapps.io/distribuidores', {
        waitUntil: 'networkidle2',
        timeout: 10000
      });

      // Wait longer for React to load and API to complete
      console.log('Waiting for page to fully load...');
      await new Promise(resolve => setTimeout(resolve, 10000));

      console.log('API requests made:', requests.filter(r => r.url.includes('/api/')));
      console.log('JS/CSS requests:', requests.filter(r => r.url.includes('.js') || r.url.includes('.css')).length);

      const pageContent = await page.evaluate(() => {
        const mapDiv = document.querySelector('[class*="h-96"]'); // The DistributorMap div
        const leafletContainer = document.querySelector('.leaflet-container');
        const leafletTiles = document.querySelector('.leaflet-tile-pane');
        
        return {
          title: document.title,
          hasMapContainer: !!leafletContainer,
          hasMapDiv: !!mapDiv,
          hasTiles: !!leafletTiles,
          hasDistributorsText: document.body.innerText.includes('Distribuidores'),
          bodyLength: document.body.innerText.length,
          distributorsCount: window.distributorsCount || 0,
          apiCalls: window.apiCalls || [],
          mapDivClasses: mapDiv ? mapDiv.className : null,
          leafletContainerExists: !!leafletContainer
        };
      });

      await page.screenshot({ path: 'distribuidores-page.png', fullPage: true });
      console.log('Screenshot saved as distribuidores-page.png');
    }

    console.log('Checking for markers...');
    const markerCount = await page.evaluate(() => {
      // Look for Leaflet markers
      const markers = document.querySelectorAll('.leaflet-marker-icon');
      console.log('Found marker elements:', markers.length);

      // Also check for marker clusters
      const clusters = document.querySelectorAll('.marker-cluster');
      console.log('Found cluster elements:', clusters.length);

      return markers.length + clusters.length;
    });

    console.log(`Total markers/clusters found: ${markerCount}`);

    if (markerCount > 0) {
      console.log('✅ SUCCESS: Markers are rendering!');
    } else {
      console.log('❌ FAILURE: No markers found');
    }

    return markerCount > 0;

  } catch (error) {
    console.error('Error during check:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

checkMarkers().then(success => {
  process.exit(success ? 0 : 1);
});