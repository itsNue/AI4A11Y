// altText.js

console.log("Content script injected"); 

function getImagesWithAltText() {
  const images = document.querySelectorAll("img");
  const imageList = [];

  images.forEach((image) => {
    const altText = image.alt || "No alt text provided";
    imageList.push({ src: image.src, alt: altText });
  });

  return imageList;
}
function checkColorContrast() {
  console.log("Color contrast check initiated.");
  const elements = document.querySelectorAll("*");

  const colorContrastList = [];

  elements.forEach((element) => {
    const computedStyle = getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;

    const contrastRatio = getContrastRatio(backgroundColor, color);
    console.log(`Element: ${element.tagName}`);
    console.log(`Background Color: ${backgroundColor}`);
    console.log(`Text Color: ${color}`);
    console.log(`Contrast Ratio: ${contrastRatio}`);

    colorContrastList.push({
      element: element.tagName,
      backgroundColor: backgroundColor,
      textColor: color,
      contrastRatio: contrastRatio,
    });
  });

  console.log("Color contrast check completed.");
  return colorContrastList;
}
function getContrastRatio(color1, color2) {
  const rgb1 = getRGBArray(color1);
  const rgb2 = getRGBArray(color2);

  const luminance1 = getLuminance(rgb1);
  const luminance2 = getLuminance(rgb2);

  const lighterLuminance = Math.max(luminance1, luminance2);
  const darkerLuminance = Math.min(luminance1, luminance2);

  return (lighterLuminance + 0.05) / (darkerLuminance + 0.05);
}

function getRGBArray(color) {
  const match = color.match(/(\d+), (\d+), (\d+)/);
  return match
    ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
    : null;
}

function getLuminance(rgb) {
  const [r, g, b] = rgb.map((value) => {
    value /= 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scanImages") {
    const imagesWithAltText = getImagesWithAltText();
    sendResponse({ action: "scanImages", result: imagesWithAltText });
  } else if (request.action === "scanColorContrast") {
    const colorContrastList = checkColorContrast();
    sendResponse({ action: "scanColorContrast", result: colorContrastList });
  }
});
