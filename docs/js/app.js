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
    errorMsg: document.getElementById('errorMsg'),
    cajonSection: document.getElementById('cajonSection'),
    cajonOutput: document.getElementById('cajonOutput')
  };

  function getSelectedCipher() {
    return Ciphers[elements.cipherSelect.value];
  }

  function updateCipherInfo() {
    const cipher = getSelectedCipher();
    const isCajon = cipher.id === 'cajon';
    elements.cipherDescription.textContent = cipher.description;
    elements.referenceContainer.innerHTML = cipher.needsKeyword
      ? cipher.getReference(elements.keywordInput.value)
      : cipher.getReference();
    elements.keywordGroup.style.display = cipher.needsKeyword ? 'block' : 'none';
    elements.cajonSection.style.display = isCajon ? 'block' : 'none';
    if (isCajon) {
      elements.resultContainer.style.display = 'none';
    }
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

    if (cipher.id === 'cajon') {
      if (operation === 'decrypt') {
        showError('Usá la grilla de botones para escribir el mensaje manualmente.');
        return;
      }
      elements.errorMsg.style.display = 'none';
      elements.resultContainer.style.display = 'none';
      try {
        const result = cipher.encrypt(text);
        elements.cajonOutput.innerHTML = result;
        addHistory(cipher.name, 'Cifrar', text, '[Imágenes]');
      } catch (e) {
        showError(e.message || 'Error al procesar el mensaje.');
      }
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

  function drawFallback(ctx, x, y, letter) {
    const CELL = 40;
    ctx.fillStyle = '#f5f0e6';
    ctx.fillRect(x, y, CELL, CELL);
    ctx.strokeStyle = '#d5c8b0';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, CELL, CELL);
    ctx.fillStyle = '#6C464F';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, x + CELL / 2, y + CELL / 2);
  }

  function generatePng() {
    const outputEl = elements.cajonOutput;
    if (!outputEl.innerHTML.trim()) {
      showError('Primero cifrá un mensaje para generar el PNG.');
      return;
    }

    const children = outputEl.children;
    const CELL = 40;
    const GAP = 4;
    const PAD = 24;
    const COLS = 16;
    const STEP = CELL + GAP;

    const total = children.length;
    if (!total) {
      showError('No hay imágenes para generar.');
      return;
    }

    const cols = Math.min(total, COLS);
    const rows = Math.ceil(total / COLS);
    const canvasW = PAD * 2 + cols * STEP - GAP;
    const canvasH = PAD * 2 + rows * STEP - GAP;

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasW, canvasH);

    let idx = 0;

    function drawNext() {
      if (idx >= total) {
        downloadCanvas(canvas);
        return;
      }

      const col = idx % COLS;
      const row = Math.floor(idx / COLS);
      const x = PAD + col * STEP;
      const y = PAD + row * STEP;
      const child = children[idx];

      idx++;

      if (child.classList.contains('cajon-space')) {
        drawNext();
        return;
      }

      const letter = child.getAttribute('alt') || '?';
      const svgContent = SVG_DATA[letter];

      if (!svgContent) {
        drawFallback(ctx, x, y, letter);
        drawNext();
        return;
      }

      const img = new Image();
      img.onload = function () {
        ctx.drawImage(img, x, y, CELL, CELL);
        drawNext();
      };
      img.onerror = function () {
        drawFallback(ctx, x, y, letter);
        drawNext();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgContent);
    }

    drawNext();
  }

  function downloadCanvas(canvas) {
    const link = document.createElement('a');
    link.download = 'cifrado-cajon.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  function buildCajonGrid() {
    const grid = document.getElementById('cajonGrid');
    for (const row of GRID_3x9) {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'cg-row';
      for (let ci = 0; ci < row.length; ci++) {
        if (ci === 3 || ci === 6) {
          const sep = document.createElement('span');
          sep.className = 'cg-sep';
          rowDiv.appendChild(sep);
        }
        const ch = row[ci];
        const btn = document.createElement('button');
        btn.id = 'btn' + ch;
        btn.className = 'cajon-btn';
        btn.title = ch;
        const img = document.createElement('img');
        img.src = 'img/rejilla/' + ch + '.svg';
        img.alt = ch;
        btn.appendChild(img);
        const label = document.createElement('span');
        label.className = 'cb-label';
        label.textContent = ch;
        btn.appendChild(label);
        btn.addEventListener('click', function () {
          elements.inputText.value += ch;
          elements.inputText.focus();
        });
        rowDiv.appendChild(btn);
      }
      grid.appendChild(rowDiv);
    }
  }
  buildCajonGrid();

  document.getElementById('cajonClear').addEventListener('click', function () {
    elements.inputText.value = '';
    elements.inputText.focus();
  });

  document.getElementById('cajonSpace').addEventListener('click', function () {
    elements.inputText.value += ' ';
    elements.inputText.focus();
  });

  document.getElementById('cajonPngBtn').addEventListener('click', generatePng);

  updateCipherInfo();
  renderHistory();
})();
