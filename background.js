let thirdPartyConnectionsCount = 0;
let firstPartyCookiesCount = 0;
let thirdPartyCookiesCount = 0;
let localStorageData = 0;
let sessionStorageData = 0;
let canvasFingerprint = null;
let hijackingDetected = false; // Variável para armazenar o resultado do teste de hijack

// Função para calcular a impressão digital de canvas
function calculateCanvasFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const txt = 'Canvas Fingerprint';

  ctx.textBaseline = 'top';
  ctx.font = "14px 'Arial'";
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125,1,62,20);
  ctx.fillStyle = '#069';
  ctx.fillText(txt, 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText(txt, 4, 17);

  const dataURL = canvas.toDataURL();
  const hash = window.btoa(dataURL);
  return hash;
}

// Função para verificar se há atividades suspeitas de sequestro de navegador
function checkForBrowserHijack(details) {
  // Obtém o número da porta da solicitação
  const requestPort = new URL(details.url).port;

  const hijackingPorts = ['8080', '8081', '8443', '8000'];
  if (hijackingPorts.includes(requestPort)) {
    hijackingDetected = true;
  }

  // Você pode adicionar mais verificações de comportamento suspeito aqui
}

// Listener para eventos de requisição antes de serem feitas
browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Verifica se o domínio da requisição não pertence ao domínio principal
    if (!details.originUrl || details.originUrl === details.url) {
      return;
    }

    // Incrementa o contador de solicitações de terceiros
    thirdPartyConnectionsCount++;

    // Verifica atividades suspeitas de sequestro de navegador
    checkForBrowserHijack(details);
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Listener para eventos de requisição completadas
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

// Envia as contagens e impressão digital de canvas para o popup quando solicitado
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getStats") {
    sendResponse({
      thirdPartyConnectionsCount: thirdPartyConnectionsCount,
      firstPartyCookiesCount: firstPartyCookiesCount,
      thirdPartyCookiesCount: thirdPartyCookiesCount,
      localStorageData: localStorageData,
      sessionStorageData: sessionStorageData,
      canvasFingerprint: canvasFingerprint,
      hijackingDetected: hijackingDetected // Envia o resultado do teste de hijack
    });
  }
});

// Listener para quando uma aba é atualizada
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
        canvasFingerprint = calculateCanvasFingerprint();
      }
    });
  }
});

// Listener para mensagens recebidas pelo background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.request === "getData") {
    sendResponse({
      thirdPartyConnectionsCount,
      firstPartyCookiesCount,
      thirdPartyCookiesCount,
      localStorageData,
      sessionStorageData,
      canvasFingerprint,
      hijackingDetected: hijackingDetected // Envia o resultado do teste de hijack
    });
  }

  if (message.type === "storageData") {
    localStorageData = message.localStorageCount;
    sessionStorageData = message.sessionStorageCount;
  }
});
