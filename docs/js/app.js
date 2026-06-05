(function () {
  const HISTORY_KEY = 'scoutcipher_history';
  const MAX_HISTORY = 20;

  const elements = {
    cipherSelect: document.getElementById('cipherSelect'),
    cipherDescription: document.getElementById('cipherDescription'),
    referenceContainer: document.getElementById('referenceContainer'),
    keywordGroup: document.getElementById('keywordGroup'),
    keywordInput: document.getElementById('keywordInput'),
    inputText: document.getElementById('inputText'),
    encryptBtn: document.getElementById('encryptBtn'),
    decryptBtn: document.getElementById('decryptBtn'),
    resultText: document.getElementById('resultText'),
    resultContainer: document.getElementById('resultContainer'),
    copyBtn: document.getElementById('copyBtn'),
    historyList: document.getElementById('historyList'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    errorMsg: document.getElementById('errorMsg')
  };

  function getSelectedCipher() {
    return Ciphers[elements.cipherSelect.value];
  }

  function updateCipherInfo() {
    const cipher = getSelectedCipher();
    elements.cipherDescription.textContent = cipher.description;
    elements.referenceContainer.innerHTML = cipher.needsKeyword
      ? cipher.getReference(elements.keywordInput.value)
      : cipher.getReference();
    elements.keywordGroup.style.display = cipher.needsKeyword ? 'block' : 'none';
    elements.errorMsg.textContent = '';
    elements.errorMsg.style.display = 'none';
  }

  function updateKeywordReference() {
    const cipher = getSelectedCipher();
    if (cipher.needsKeyword) {
      elements.referenceContainer.innerHTML = cipher.getReference(elements.keywordInput.value);
    }
  }

  function showError(msg) {
    elements.errorMsg.textContent = msg;
    elements.errorMsg.style.display = 'block';
    elements.resultContainer.style.display = 'none';
  }

  function process(operation) {
    const cipher = getSelectedCipher();
    const text = elements.inputText.value.trim();
    if (!text) {
      showError('Por favor ingresá un mensaje.');
      return;
    }

    elements.errorMsg.style.display = 'none';

    try {
      let result;
      const label = operation === 'encrypt' ? 'Cifrar' : 'Descifrar';

      if (cipher.needsKeyword) {
        const keyword = elements.keywordInput.value.trim();
        if (!keyword) {
          showError('Este cifrado requiere una palabra clave.');
          return;
        }
        result = operation === 'encrypt'
          ? cipher.encrypt(text, keyword)
          : cipher.decrypt(text, keyword);
      } else {
        result = operation === 'encrypt'
          ? cipher.encrypt(text)
          : cipher.decrypt(text);
      }

      elements.resultText.value = result;
      elements.resultContainer.style.display = 'block';
      addHistory(cipher.name, label, text, result);
    } catch (e) {
      showError(e.message || 'Error al procesar el mensaje.');
    }
  }

  function addHistory(cipherName, operation, input, output) {
    const history = getHistory();
    history.unshift({
      timestamp: Date.now(),
      cipher: cipherName,
      operation: operation,
      input: input,
      output: output
    });
    if (history.length > MAX_HISTORY) history.pop();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
  }

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
      return [];
    }
  }

  function renderHistory() {
    const history = getHistory();
    if (history.length === 0) {
      elements.historyList.innerHTML = '<li class="history-empty">Todavía no hay conversiones.</li>';
      return;
    }
    elements.historyList.innerHTML = history.map(entry => {
      const time = new Date(entry.timestamp).toLocaleString('es-AR', {
        hour: '2-digit', minute: '2-digit'
      });
      return `<li class="history-item">
        <span class="history-meta">${time} · ${entry.cipher} · ${entry.operation}</span>
        <span class="history-input">"${escapeHtml(entry.input)}"</span>
        <span class="history-arrow">→</span>
        <span class="history-output">"${escapeHtml(entry.output)}"</span>
      </li>`;
    }).join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function copyResult() {
    const text = elements.resultText.value;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      elements.copyBtn.textContent = '✓ Copiado';
      setTimeout(() => { elements.copyBtn.textContent = '📋 Copiar'; }, 1500);
    }).catch(() => {
      elements.resultText.select();
      document.execCommand('copy');
    });
  }

  function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  }

  elements.cipherSelect.addEventListener('change', updateCipherInfo);
  elements.keywordInput.addEventListener('input', updateKeywordReference);
  elements.encryptBtn.addEventListener('click', function () { process('encrypt'); });
  elements.decryptBtn.addEventListener('click', function () { process('decrypt'); });
  elements.copyBtn.addEventListener('click', copyResult);
  elements.clearHistoryBtn.addEventListener('click', clearHistory);

  elements.inputText.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      process('encrypt');
    }
  });

  updateCipherInfo();
  renderHistory();
})();
