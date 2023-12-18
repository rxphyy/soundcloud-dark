async function fetchConfig() {
  try {
    const storedConfig = await new Promise((resolve, reject) => {
      chrome.storage.local.get('config', result => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.config);
        }
      });
    });


    return storedConfig || {};
  } catch (error) {
    throw error;
  }
}

async function refreshStylesheets() {
  try {
    const config = await fetchConfig();

    Object.entries(config).forEach(([propertyName, propertyValue]) => {
      document.documentElement.style.setProperty(`--${propertyName}`, propertyValue);
    });
  } catch (error) {
      console.error('Error applying config:', error);
  }
}

refreshStylesheets()  