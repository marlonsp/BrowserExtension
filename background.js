let thirdPartyConnectionsCount = 0;
let firstPartyCookiesCount = 0;
let thirdPartyCookiesCount = 0;
let localStorageData = 0;
let sessionStorageData = 0;

browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Verifica se o domínio da requisição não pertence ao domínio principal
    if (!details.originUrl || details.originUrl === details.url) {
      return;
    }

    // Incrementa o contador de solicitações de terceiros
    thirdPartyConnectionsCount++;
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

browser.webRequest.onCompleted.addListener(
  function(details) {
    if (details.type === "main_frame") {
      browser.cookies.getAll({ url: details.url }, function(cookies) {
        cookies.forEach(function(cookie) {
          if (cookie.firstPartyDomain === cookie.domain) {
            firstPartyCookiesCount++;
          } else {
            thirdPartyCookiesCount++;
          }
        });
      });
    }
  },
  { urls: ["<all_urls>"] }
);

// Envia as contagens para o popup quando solicitado
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getStats") {
    sendResponse({
      thirdPartyConnectionsCount: thirdPartyConnectionsCount,
      firstPartyCookiesCount: firstPartyCookiesCount,
      thirdPartyCookiesCount: thirdPartyCookiesCount,
      localStorageData: localStorageData,
      sessionStorageData: sessionStorageData
    });
  }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      if (tabs.length > 0 && tabs[0].id) {
        const code_injection = `
          browser.runtime.sendMessage({
            type: 'storageData',
            localStorageCount: localStorage.length,
            sessionStorageCount: sessionStorage.length
          });
        `;
        browser.tabs.executeScript(tabs[0].id, {code: code_injection});
      }
    });
  }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.request === "getData") {
    sendResponse({
      thirdPartyConnectionsCount,
      firstPartyCookiesCount,
      thirdPartyCookiesCount,
      localStorageData,
      sessionStorageData
    });
  }

  if (message.type === "storageData") {
    localStorageData = message.localStorageCount;
    sessionStorageData = message.sessionStorageCount;
  }
});
