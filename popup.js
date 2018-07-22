
const mode   = document.getElementById('mode');
const config = document.getElementById('config');

const defaultScript
      = "function FindProxyForURL(url, host) {\n"
      + "  const proxy = 'SOCKS5 127.0.0.1:1080';\n"
      + "  const use =\n"
      + "    [ /\\.?rutracker.org$/\n"
      + "    , /\\.?telegram.org$/\n"
      + "    , /^t.me$/\n"
      + "    ].some(function(rx) { return rx.test(host) });\n"
      + "  return use ? proxy : 'DIRECT';\n"
      + "}";


document.getElementById('cancel').onclick = function() { window.close() };


document.getElementById('save').onclick = function() {
  const proxy =  { mode: mode.value };

  if (mode.value === 'pac_script') {
    proxy.pacScript = {
      data: config.value,
      mandatory: true
    };
    // FIXME: do we need to wait for `storage.set()` to succeed?
    chrome.storage.local.set({ pac_script: config.value }, function() {});
  }

  chrome.proxy.settings.set(
    { scope: 'regular', value: proxy },
    function() { window.close() }
  );
};


chrome.proxy.settings.get({ incognito: false }, function(proxy) {
  mode.value = proxy.value.mode;

  if(proxy.value.mode === 'pac_script') {
    // Show current config
    config.value = proxy.value.pacScript.data;
  } else {
    // Load config from the storage
    chrome.storage.local.get(
      { pac_script: defaultScript },
      function (storage) { config.value = storage.pac_script; }
    );
  }
});
