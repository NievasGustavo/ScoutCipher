(function () {
  const HISTORY_KEY = 'scoutcipher_history';
  const MAX_HISTORY = 20;

  const CAJON_CELL = 40;
  const CAJON_GAP = 4;
  const CAJON_PAD = 24;
  const CAJON_COLS = 16;
  const CAJON_STEP = CAJON_CELL + CAJON_GAP;

  let cajonRows = [];
  let cajonWarning = '';

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
        cipher.encrypt(text);
        renderCajonPreview(cajonUnitsFromText(text));
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

  function cajonUnitsFromText(text) {
    const units = [];
    for (const ch of text.toUpperCase()) {
      units.push(ch === ' ' ? { space: true } : { letter: ch });
    }
    return units;
  }

  function splitWord(word, cols) {
    const chunks = [];
    for (let i = 0; i < word.length; i += cols) {
      chunks.push(word.slice(i, i + cols));
    }
    return chunks;
  }

  function layoutCajon(units, cols) {
    const rows = [];
    const oversizeWords = [];
    let current = [];
    let used = 0;
    let word = [];

    function flush() {
      if (current.length) {
        rows.push(current);
        current = [];
        used = 0;
      }
    }

    function commitWord() {
      if (!word.length) return;
      const len = word.length;
      if (len > cols) {
        oversizeWords.push(word.join(''));
        flush();
        for (const chunk of splitWord(word, cols)) {
          for (const l of chunk) {
            current.push(l);
            used++;
          }
          if (used === cols) flush();
        }
      } else {
        const needSep = used > 0 ? 1 : 0;
        if (used > 0 && needSep + len > cols - used) {
          flush();
        }
        if (used > 0) {
          current.push(null);
          used++;
        }
        for (const l of word) {
          current.push(l);
          used++;
        }
        if (used === cols) flush();
      }
      word = [];
    }

    for (const u of units) {
      if (u.space) {
        commitWord();
      } else {
        word.push(u.letter);
      }
    }
    commitWord();
    flush();

    let warning = '';
    if (oversizeWords.length) {
      warning = 'La palabra ' + oversizeWords.map(w => '"' + w + '"').join(', ') + ' supera el ancho de fila y se parte.';
    }
    return { rows, warning };
  }

  function renderCajonPreview(units) {
    const layout = layoutCajon(units, CAJON_COLS);
    cajonRows = layout.rows;
    cajonWarning = layout.warning;

    elements.cajonOutput.innerHTML = '';

    const grid = document.createElement('div');
    grid.style.cssText = [
      'display:grid',
      'grid-template-columns:repeat(' + CAJON_COLS + ',' + CAJON_CELL + 'px)',
      'gap:' + CAJON_GAP + 'px',
      'padding:' + CAJON_PAD + 'px',
      'background:#ffffff',
      'width:fit-content',
      'max-width:100%',
      'overflow-x:auto',
      'margin:0 auto',
      'border-radius:8px'
    ].join(';') + ';';

    for (const row of layout.rows) {
      for (let c = 0; c < CAJON_COLS; c++) {
        const cell = document.createElement('div');
        cell.style.width = CAJON_CELL + 'px';
        cell.style.height = CAJON_CELL + 'px';
        const letter = row[c];
        if (letter) {
          const img = document.createElement('img');
          img.src = 'img/rejilla/' + letter + '.svg';
          img.alt = letter;
          img.style.cssText = 'width:100%;height:100%;display:block;object-fit:contain;';
          cell.appendChild(img);
        }
        grid.appendChild(cell);
      }
    }
    elements.cajonOutput.appendChild(grid);

    if (layout.warning) {
      const note = document.createElement('div');
      note.textContent = layout.warning;
      note.style.cssText = 'margin-top:12px;font-size:0.8rem;color:#8a7a7e;';
      elements.cajonOutput.appendChild(note);
    }
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
    if (!cajonRows.length) {
      showError('Primero cifrá un mensaje para generar el PNG.');
      return;
    }

    const rows = cajonRows;
    const canvasW = CAJON_PAD * 2 + CAJON_COLS * CAJON_STEP - CAJON_GAP;
    const canvasH = CAJON_PAD * 2 + rows.length * CAJON_STEP - CAJON_GAP;

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasW, canvasH);

    let idx = 0;
    const total = rows.length * CAJON_COLS;

    function drawNext() {
      if (idx >= total) {
        downloadCanvas(canvas);
        if (cajonWarning) {
          elements.errorMsg.textContent = cajonWarning;
          elements.errorMsg.style.display = 'block';
        }
        return;
      }

      const row = Math.floor(idx / CAJON_COLS);
      const col = idx % CAJON_COLS;
      const letter = rows[row] ? rows[row][col] : null;
      idx++;

      if (!letter) {
        drawNext();
        return;
      }

      const x = CAJON_PAD + col * CAJON_STEP;
      const y = CAJON_PAD + row * CAJON_STEP;
      const svgContent = SVG_DATA[letter];

      if (!svgContent) {
        drawFallback(ctx, x, y, letter);
        drawNext();
        return;
      }

      const img = new Image();
      img.onload = function () {
        ctx.drawImage(img, x, y, CAJON_CELL, CAJON_CELL);
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
