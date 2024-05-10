document.addEventListener("DOMContentLoaded", function () {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let tabId = tabs[0].id;
      browser.browserAction.getBadgeText({ tabId: tabId }, function (badgeText) {
        document.getElementById("cookies").textContent = "Loading..."; // Mostra "Carregando..." enquanto obtém a contagem de cookies
        document.getElementById("supercookies").textContent = "Loading..."; // Mostra "Carregando..." enquanto obtém a contagem de supercookies
  
        // Receber mensagem do background.js com informações de cookies e supercookies
        browser.runtime.onMessage.addListener((message) => {
          document.getElementById("cookies").textContent = message.cookies;
          document.getElementById("supercookies").textContent = message.supercookies;
          document.getElementById("thirdPartyRequests").textContent = message.thirdPartyRequests;
        });
  
        // Solicitar informações de cookies e supercookies do background.js
        browser.runtime.sendMessage({ requestInfo: true });
      });
    });
  });
  