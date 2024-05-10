let thirdPartyDomains = new Set();

function updateBadge(tabId) {
  let thirdPartyRequests = 0;
  let cookiesCount = 0;
  let supercookiesCount = 0;

  browser.tabs.get(tabId, function(tab) {
    let currentTabUrl = new URL(tab.url);
    let currentTabDomain = currentTabUrl.hostname;

    browser.webRequest.onBeforeRequest.addListener(
      (details) => {
        if (!details.url.startsWith("http")) {
          return;
        }

        let url = new URL(details.url);
        let domain = url.hostname;
        if (domain !== currentTabDomain) { // Verifica se o domínio é diferente do domínio da página atual
          thirdPartyDomains.add(domain);
          thirdPartyRequests++;

          // Contagem de cookies
          browser.cookies.getAll({ domain: domain }, (cookies) => {
            cookiesCount += cookies.length;
          });

          // Lógica para detectar e contar supercookies

          // Atualize as informações no popup
          updatePopupInfo(tabId, thirdPartyRequests, cookiesCount, supercookiesCount);
        }
      },
      {urls: ["<all_urls>"], tabId: tabId},
      ["blocking"]
    );
  });
}

function updatePopupInfo(tabId, requests, cookies, supercookies) {
  // Enviar mensagem para o popup.html com as informações de cookies, supercookies e solicitações de terceiros
  browser.runtime.sendMessage({ cookies: cookies, supercookies: supercookies, thirdPartyRequests: requests });
}

// Listener para solicitações do popup.html para obter informações de cookies e supercookies
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.requestInfo) {
    sendResponse({
      cookies: cookiesCount, // Assuma que 'cookiesCount' é a contagem total de cookies
      supercookies: supercookiesCount, // Assuma que 'supercookiesCount' é a contagem total de supercookies
      thirdPartyRequests: thirdPartyDomains.size
    });
  }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    updateBadge(tabId);
  }
});
