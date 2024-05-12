browser.runtime.sendMessage({ action: "getStats" }, function(response) {
    document.getElementById("connectionsCount").innerText = "Conexões de Terceiros: " + response.thirdPartyConnectionsCount;
    document.getElementById("cookiesCount").innerText = "Cookies de Primeira Parte: " + response.firstPartyCookiesCount +
                                                          "\nCookies de Terceira Parte: " + response.thirdPartyCookiesCount;
    document.getElementById("storageCount").innerText = "Itens de Local Storage: " + response.localStorageData +
                                                            "\nItens de Session Storage: " + response.sessionStorageData;
  });
  