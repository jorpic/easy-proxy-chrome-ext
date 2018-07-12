
const mode   = document.getElementById('mode');
const config = document.getElementById('config');

document.getElementById('save').onclick = function() {
  const proxy =  {
    mode: 'pac_script',
    pacScript: {
      data: config.value,
      mandatory: true
    }
  };
  chrome.proxy.settings.set(
    { scope: 'regular', value: proxy },
    function() { window.close() }
  );
};

chrome.proxy.settings.get({ incognito: false }, function(proxy) {
  mode.textContent = proxy.value.mode;
  if(proxy.value.mode == 'pac_script') {
    config.value = proxy.value.pacScript.data;
  } else {
    config.value
      = "function FindProxyForURL(url, host) {\n"
      + "  const proxy = 'SOCKS5 127.0.0.1:1080';\n"
      + "  const use\n"
      + "      =  /\.?rutracker.org$/.test(host)\n"
      + "      || /\.?telegram.org$/.test(host);\n"
      + "  return use ? proxy : 'DIRECT';\n"
      + "}";
  }
});
