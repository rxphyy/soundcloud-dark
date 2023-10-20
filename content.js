// Content script code

// Function to set your custom title
function setCustomTitle() {
    document.title = 'SoundCloud';
  }
  
  // Function to monitor changes in the title and revert to your custom title
  function monitorTitleChanges() {
    setCustomTitle(); // Set the initial custom title
  
    // Create a MutationObserver to watch for changes in the title
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.target === document.head) {
          // Title has changed, so revert it to your custom title
          setCustomTitle();
        }
      }
    });
  
    // Configure and start the observer to watch for changes in the head element
    observer.observe(document.head, { childList: true });
  }
  
  function modifySoundCloudCSS() {
    document.body.style.backgroundColor = "#171716"
    document.body.style.color = "white"
    document.querySelectorAll('.sc-input').forEach(x => {
        x.style.backgroundColor = '#171716'
        x.color = "white"
    })
    document.getElementById('app').style.backgroundColor = "#171716";
    // Select the body element and change its background color to red
    document.getElementsByClassName('l-container l-content')[0].style.backgroundColor = "#212121";
    document.querySelectorAll('a.sc-link-dark, a:hover').forEach(x => {
        x.style.color = 'rgb(137 43 237)'
        x.style.fontWeight = 'bold'
    })

    document.querySelectorAll('a.sc-link-light:hover').forEach(x => {
        x.style.color = '#ffff'
    })

    document.querySelectorAll('.sc-artwork').forEach(x => {
        x.style.borderRadius = '4%';
    })
    document.getElementsByClassName('playControls__inner')[0].style.backgroundColor = '#383838'
    document.getElementsByClassName('playControls__inner')[0].style.borderTop = "2px solid #734ecc"
    document.getElementsByClassName('playControls__bg')[0].style.backgroundColor = '#383838'
    document.getElementsByClassName('playControls__bg')[0].style.borderTop = "2px solid #734ecc"
    document.querySelectorAll('.sc-classic .g-tabs-link').forEach(link => {
      link.style.color = 'white';
    })
    document.querySelector('.sc-classic .g-tabs-link.active').style.color = '#734ecc'
    document.querySelector('.sc-classic .g-tabs-link.active').style.border = 'none'

    document.querySelector('.sc-classic .header__link.header__proUpsell_side_by_side_experience').style.color = '#6a41cc'
    document.querySelector('.sc-classic .header__link.header__goUpsell_side_by_side_experience').style.color = '#6a41cc'

    //document.querySelector('.sc-classic .playControl').style.backgroundImage = `url("${chrome.extension.getURL('images/play.png')}")`;
  }
  
// Apply the CSS when the content changes (URL hash change) and when the page loads
function applyCSS() {
    modifySoundCloudCSS();
  }
  
  // Call the function to monitor changes in the title
  monitorTitleChanges();
  
  // Call the applyCSS function when the page loads and when the URL hash changes
  document.addEventListener("DOMContentLoaded", function () {
    applyCSS();
  });
 // Use the popstate event to detect changes in the URL and apply CSS modifications
window.addEventListener('popstate', applyCSS);
  
  // Call the function to monitor changes in the title
  monitorTitleChanges();
  