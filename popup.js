//this shit works
function setupTabs() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      const buttonContainer = button.parentElement;
      const tabContainer = buttonContainer.parentElement;
      const tabName = button.dataset.forTab;
      const tabToActivate = tabContainer.querySelector(
        `.tab-content[data-tab="${tabName}"]`
      );

      buttonContainer.querySelectorAll(".tab-button").forEach((button) => {
        button.classList.remove("tab-button-active");
      });

      tabContainer.querySelectorAll(".tab-content").forEach((button) => {
        button.classList.remove("tab-content-active");
      });

      button.classList.add("tab-button-active");
      tabToActivate.classList.add("tab-content-active");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  const altButton = document.getElementById("altButton");
  const contrastButton = document.getElementById("contrastButton");

  altButton.addEventListener("click", () => {
    sendMessageToContentScript("scanImages");
  });

  contrastButton.addEventListener("click", () => {
    sendMessageToContentScript("scanColorContrast");
  });
});

function sendMessageToContentScript(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTabId = tabs[0].id;

    chrome.tabs.sendMessage(activeTabId, { action }, (response) => {
      console.log(`Received response from content script:`, response);
      console.log(response.result);
      // Handle the response and update the UI
      if (response && response.result) {
        updatePopup(response);
      }
    });
  });
}

function updatePopup(data) {
  console.log("arrived here");
  const imageList = document.getElementById("image-list");
  const contrastList = document.getElementById("contrast-list");

  // Clear previous content
  imageList.innerHTML = "";
  contrastList.innerHTML = "";

  if ((data.action = "scanImages")) {
    console.log("masamoto");
    updatePopupWithImages(data.result);
  }

  if ((data.action = "scanColorContrast")) {
    updatePopupWithColorContrast(data.result);
  }
}

function updatePopupWithImages(images) {
  const imageList = document.getElementById("image-list");

  imageList.innerHTML = "";

  images.forEach((image) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<strong>Alt Text:</strong> ${image.alt}<br><img src="${image.src}" alt="${image.alt}" width="100">`;
    imageList.appendChild(listItem);
  });
}

function updatePopupWithColorContrast(colorContrast) {
  const contrastList = document.getElementById("contrast-list");

  colorContrast.forEach((contrastInfo) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<strong>Element:</strong> ${contrastInfo.element}<br>
                          <strong>Background Color:</strong> ${
                            contrastInfo.backgroundColor
                          }<br>
                          <strong>Text Color:</strong> ${
                            contrastInfo.textColor
                          }<br>
                          <strong>Contrast Ratio:</strong> ${contrastInfo.contrastRatio.toFixed(
                            2
                          )}`;
    contrastList.appendChild(listItem);
  });
}
