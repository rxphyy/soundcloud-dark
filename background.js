// background.js (Service Worker)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: changeTabTitle,
      });
    }
  });
  
  function changeTabTitle() {
    chrome.scripting.executeScript({
      target: { tabId: 1 },
      function: () => {
        document.title = "New Title";
      },
    });
  }
  