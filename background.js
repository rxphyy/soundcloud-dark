chrome.runtime.onInstalled.addListener(function(details) {
    // Check if the reason is 'install' or 'update'
    if (details.reason === 'install' || details.reason === 'update') {
      // Initialize local storage with default values
      console.log("Initializing or updating local extension storage.");
      initializeLocalStorage();
    }
  });
  
  function initializeLocalStorage() {
    const defaultConfig = {
      "accent": "#8C31ED",
      "accent-secondary": "#9F54F0",
      "accent-tint": "#590FA9",

      "dark": "#171716",
      "dark-secondary": "#282828",

      "light": "#CACACA",
      "light-secondary": "#FFFFFF"
    };
  
    chrome.storage.local.set({ 'config': defaultConfig }, function() {
      if (chrome.runtime.lastError) {
        console.error('Error initializing local storage:', chrome.runtime.lastError);
      } else {
        console.log('Local storage initialized with default values.');
      }
    });
  }