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
});

const imageBtn = document.getElementById("image-alt-btn").addEventListener('click', clear);

const imageAltDiv = document.getElementById("image-alt");
function clear() {
  imageAltDiv.innerHTML = " ";
}
