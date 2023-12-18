document.addEventListener('DOMContentLoaded', async function () {
    var applyButton = document.getElementById('applyBtn');
    var colorInput = document.getElementById('color-picker');

    var initialColor = await fetchAccent();
    colorInput.value = initialColor;

    // Add a change event listener to the color input
    colorInput.addEventListener('input', function () {
        if (colorInput.value !== initialColor) {
            fadeIn(applyButton);
        } else {
            fadeOut(applyButton);
        }
    });
  
    // Add a click event listener to the button
    applyButton.addEventListener('click', async function () {
        await processColorChange();
    });
  

    async function processColorChange() {
        // Get the value of the color input
        var colorInput = document.getElementById('color-picker');
        var colorValue = colorInput.value;

        colorInput.value = colorValue;

        var accent_secondary = hexToRgb(colorValue);
        accent_secondary.r -= 51;
        accent_secondary.g -= 34;
        accent_secondary.b -= 69;

        accent_secondary = rgbToHex(
            accent_secondary.r,
            accent_secondary.g,
            accent_secondary.b);
            

        var accent_tint = hexToRgb(colorValue);
        accent_tint.r += 19;
        accent_tint.g += 34;
        accent_tint.b += 3;

        accent_tint = rgbToHex(
            accent_tint.r,
            accent_tint.g,
            accent_tint.b);

        chrome.storage.local.set({
            "config": {
                "accent": colorValue,
                "accent-secondary": accent_secondary,
                "accent-tint": accent_tint,
          
                "dark": "#171716",
                "dark-secondary": "#282828",
          
                "light": "#CACACA",
                "light-secondary": "#FFFFFF"
              }
        });

        const scTabs = await chrome.tabs.query({ url: 'https://soundcloud.com/*' });
        if (scTabs && scTabs.length > 0) {
            scTabs.forEach(tab => {
                chrome.tabs.reload(tab.id, {}, () => {});
            });
        }
    }
  
    // Function to convert hex to RGB
    function hexToRgb(hex) {
      // Remove the hash character if present
      hex = hex.replace(/^#/, '');
  
      // Parse the hex values for red, green, and blue
      var bigint = parseInt(hex, 16);
      var r = (bigint >> 16) & 255;
      var g = (bigint >> 8) & 255;
      var b = bigint & 255;
  
      // Return an object with the RGB values
      return { r: r, g: g, b: b };
    }
  
    // Function to convert RGB to hex
    function rgbToHex(r, g, b) {
      // Ensure that each component is in the valid range [0, 255]
      r = Math.min(255, Math.max(0, r));
      g = Math.min(255, Math.max(0, g));
      b = Math.min(255, Math.max(0, b));
  
      // Convert the RGB values to hex
      var hex = ((r << 16) | (g << 8) | b).toString(16);
  
      // Pad with zeros if needed
      while (hex.length < 6) {
        hex = '0' + hex;
      }
  
      // Add the hash character
      return '#' + hex;
    }

    function fadeIn(element) {
        element.style.display = "block"; // Make the element visible

        // Trigger a reflow before changing opacity to ensure transition occurs
        element.offsetHeight;

        element.style.opacity = 1; // Set opacity to 1 for a fading effect
    }

    // Function to fade out an element
    function fadeOut(element) {
        element.style.opacity = 0; // Set opacity to 0 for a fading effect

        // After the transition, set display to none
        setTimeout(function() {
            element.style.display = "none";
        }, 500); // Adjust the duration to match the transition duration
    }

    async function fetchAccent() {
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
    
            // Return only the "accent" property
            return storedConfig ? storedConfig.accent : null;
        } catch (error) {
            throw error;
        }
    }
  });
  