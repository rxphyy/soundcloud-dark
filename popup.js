function changeTabName() {
    _gaq.push(['_trackEvent', 'changeTabName', "popup"]);
    let title = tabNameElem.value;
    console.log(tabNameElem.value);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.runtime.sendMessage({tabId: tabs[0].id, title: 'yo', shouldPersist: shouldPersist});
    });
    window.close();
  }

changeTabName()