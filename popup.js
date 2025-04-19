document.addEventListener('DOMContentLoaded', async function () {
    var applyButton = document.getElementById('applyBtn');
    var colorInput = document.getElementById('color-picker');

    var initialColor = await fetchAccent();
    colorInput.value = initialColor;

    // Add a click event listener to the button
    applyButton.addEventListener('click', async function () {
        await processColorChange();
    });


    async function processColorChange() {
        // Get the value of the color input
        var colorInput = document.getElementById('color-picker');
        var colorValue = colorInput.value;

        colorInput.value = colorValue;

        console.log(colorValue);
        

        const hueRotate = hexToHueRotate(colorValue)

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
                "accent-hue-rotate": hueRotate,

                "dark": "#171716",
                "dark-secondary": "#282828",

                "light": "#CACACA",
                "light-secondary": "#FFFFFF"
            }
        });

        const scTabs = await chrome.tabs.query({ url: 'https://soundcloud.com/*' });
        if (scTabs && scTabs.length > 0) {
            scTabs.forEach(tab => {
                chrome.tabs.reload(tab.id, {}, () => { });
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

    }

    // Function to fade out an element
    function fadeOut(element) {
        element.style.display = "none"; // Set opacity to 0 for a fading effect
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

    // Function to convert hex color to hue-rotate value
    function hexToHueRotate(hexColor) {
        console.log('Original hex color:', hexColor);
        
        // Remove # if present
        hexColor = hexColor.replace('#', '');
        console.log('Hex without #:', hexColor);
    
        // Parse r, g, b values
        let r = parseInt(hexColor.substring(0, 2), 16) / 255;
        let g = parseInt(hexColor.substring(2, 4), 16) / 255;
        let b = parseInt(hexColor.substring(4, 6), 16) / 255;
        console.log('Normalized RGB:', {r, g, b});
    
        // Find max and min values
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let delta = max - min;
        console.log('Max, min, delta:', {max, min, delta});
    
        let hue = 0;
        if (delta !== 0) {
            if (max === r) {
                hue = ((g - b) / delta) % 6;
            } else if (max === g) {
                hue = (b - r) / delta + 2;
            } else {
                hue = (r - g) / delta + 4;
            }
            hue = Math.round(hue * 60);
            if (hue < 0) hue += 360;
        }
        
        console.log('Calculated hue:', hue);
        const result = hue + 'deg';
        console.log('Final hue-rotate value:', result);
        return result;
    }
});