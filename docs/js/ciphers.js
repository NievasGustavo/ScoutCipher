const MORSE_DICT = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
};
const MORSE_REVERSE = {};
for (const k in MORSE_DICT) MORSE_REVERSE[MORSE_DICT[k]] = k;

const GRID_3x9 = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
  ['J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q'],
  ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
];

const BACKWARD_MAP = {
  'A': 'Z', 'B': 'Y', 'C': 'X', 'D': 'W', 'E': 'V', 'F': 'U', 'G': 'T',
  'H': 'S', 'I': 'R', 'J': 'Q', 'K': 'P', 'L': 'O', 'M': 'Ñ', 'N': 'N',
  'Ñ': 'M', 'O': 'L', 'P': 'K', 'Q': 'J', 'R': 'I', 'S': 'H', 'T': 'G',
  'U': 'F', 'V': 'E', 'W': 'D', 'X': 'C', 'Y': 'B', 'Z': 'A'
};

const GRID_ENCRYPT_MAP = {};
for (let r = 0; r < GRID_3x9.length; r++) {
  for (let c = 0; c < GRID_3x9[r].length; c++) {
    GRID_ENCRYPT_MAP[GRID_3x9[r][c]] = `${r + 1}${c + 1}`;
    GRID_ENCRYPT_MAP[GRID_3x9[r][c].toLowerCase()] = `${r + 1}${c + 1}`;
  }
}

const Ciphers = {
  morse: {
    id: 'morse',
    name: 'Morse',
    needsKeyword: false,
    description: 'Cada letra se reemplaza por su código Morse. Las letras se separan con / y las palabras con //.',
    encrypt: function (text) {
      const words = text.toUpperCase().split(' ');
      const result = [];
      for (const word of words) {
        const chars = [];
        for (const ch of word) {
          if (!MORSE_DICT[ch]) throw new Error(`Caracter no soportado: '${ch}'`);
          chars.push(MORSE_DICT[ch]);
        }
        result.push(chars.join('/'));
      }
      return result.join('//');
    },
    decrypt: function (text) {
      if (!text.trim()) throw new Error('El mensaje no puede estar vacío');
      const words = text.split('//');
      const result = [];
      for (const word of words) {
        const codes = word.split('/');
        const chars = [];
        for (const code of codes) {
          if (!MORSE_REVERSE[code]) throw new Error(`Código Morse inválido: '${code}'`);
          chars.push(MORSE_REVERSE[code]);
        }
        result.push(chars.join(''));
      }
      return result.join(' ');
    },
    getReference: function () {
      const letters = Object.keys(MORSE_DICT).filter(k => /^[A-Z]$/.test(k));
      let html = '<table class="ref-table"><tbody><tr>';
      for (const l of letters) html += `<td class="ref-char">${l}</td>`;
      html += '</tr><tr>';
      for (const l of letters) html += `<td class="ref-code">${MORSE_DICT[l]}</td>`;
      html += '</tr></tbody></table>';
      return html;
    }
  },

  murcielago: {
    id: 'murcielago',
    name: 'Murciélago',
    needsKeyword: false,
    description: 'Cada letra de la palabra MURCIÉLAGO se reemplaza por su posición (0-9). El resto de las letras quedan igual.',
    encrypt: function (text) {
      const map = 'murcielago';
      return text.toLowerCase().split('').map(ch => {
        const idx = map.indexOf(ch);
        return idx >= 0 ? String(idx) : ch;
      }).join('');
    },
    decrypt: function (text) {
      const map = ['m', 'u', 'r', 'c', 'i', 'e', 'l', 'a', 'g', 'o'];
      return text.split('').map(ch => {
        if (/^\d$/.test(ch)) return map[parseInt(ch)] || ch;
        return ch;
      }).join('');
    },
    getReference: function () {
      const word = 'murcielago';
      let html = '<table class="ref-table"><tbody><tr>';
      for (const ch of word) html += `<td class="ref-char">${ch}</td>`;
      html += '</tr><tr>';
      for (let i = 0; i < word.length; i++) html += `<td class="ref-code">${i}</td>`;
      html += '</tr></tbody></table>';
      return html;
    }
  },

  keyword: {
    id: 'keyword',
    name: 'Keyword (Palabra Clave)',
    needsKeyword: true,
    description: 'Se genera un alfabeto cifrado a partir de una palabra clave. La clave se coloca al inicio sin repetir letras, y luego el resto del alfabeto.',
    _generateCipher: function (keyword) {
      const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
      const kw = keyword.toUpperCase();
      let unique = '';
      for (const ch of kw) if (!unique.includes(ch)) unique += ch;
      for (const ch of alphabet) if (!unique.includes(ch)) unique += ch;
      return { alphabet, cipher: unique };
    },
    encrypt: function (text, keyword) {
      if (!keyword) throw new Error('Debe ingresar una palabra clave');
      const { alphabet, cipher } = this._generateCipher(keyword);
      return text.toUpperCase().split('').map(ch => {
        const idx = alphabet.indexOf(ch);
        return idx >= 0 ? cipher[idx] : ch;
      }).join('');
    },
    decrypt: function (text, keyword) {
      if (!keyword) throw new Error('Debe ingresar una palabra clave');
      const { alphabet, cipher } = this._generateCipher(keyword);
      return text.toUpperCase().split('').map(ch => {
        const idx = cipher.indexOf(ch);
        return idx >= 0 ? alphabet[idx] : ch;
      }).join('');
    },
    getReference: function (keyword) {
      if (!keyword) return '<p class="ref-hint">Ingresá una palabra clave para ver el alfabeto generado.</p>';
      const { alphabet, cipher } = this._generateCipher(keyword);
      let html = '<table class="ref-table"><tbody><tr>';
      html += '<td class="ref-label">Normal</td>';
      for (const ch of alphabet) html += `<td class="ref-char">${ch}</td>`;
      html += '</tr><tr>';
      html += `<td class="ref-label">Clave</td>`;
      for (const ch of cipher) html += `<td class="ref-code">${ch}</td>`;
      html += '</tr></tbody></table>';
      return html;
    }
  },

  backward: {
    id: 'backward',
    name: 'Alfabeto Invertido',
    needsKeyword: false,
    description: 'Cada letra se reemplaza por su opuesta en el alfabeto (A↔Z, B↔Y, C↔X...). La Ñ intercambia con la M.',
    encrypt: function (text) {
      return text.toUpperCase().split('').map(ch => BACKWARD_MAP[ch] || ch).join('');
    },
    decrypt: function (text) {
      return this.encrypt(text);
    },
    getReference: function () {
      const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
      let html = '<table class="ref-table"><tbody><tr>';
      html += '<td class="ref-label">Normal</td>';
      for (const ch of alphabet) html += `<td class="ref-char">${ch}</td>`;
      html += '</tr><tr>';
      html += '<td class="ref-label">Cifrado</td>';
      for (const ch of alphabet) html += `<td class="ref-code">${BACKWARD_MAP[ch]}</td>`;
      html += '</tr></tbody></table>';
      return html;
    }
  },

  cenitpolar: {
    id: 'cenitpolar',
    name: 'Cenit Polar',
    needsKeyword: false,
    description: 'Cada letra se intercambia según los pares C↔P, E↔O, N↔L, I↔A, T↔R. El resto se mantiene igual.',
    encrypt: function (text) {
      const map = { C:'P', E:'O', N:'L', I:'A', T:'R', P:'C', O:'E', L:'N', A:'I', R:'T' };
      return text.toUpperCase().split('').map(ch => map[ch] || ch).join('');
    },
    decrypt: function (text) {
      return this.encrypt(text);
    },
    getReference: function () {
      return '<table class="ref-table"><thead><tr><th colspan="5">Cenit ↔ Polar</th></tr></thead><tbody>'
        + '<tr><td>C</td><td>E</td><td>N</td><td>I</td><td>T</td></tr>'
        + '<tr><td>P</td><td>O</td><td>L</td><td>A</td><td>R</td></tr>'
        + '</tbody></table>'
        + '<p class="ref-simple">Ejemplo: "lis" → "nas"</p>'
        + '<details><summary>Alfabeto completo</summary>'
        + '<table class="ref-table"><thead><tr><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th><th>H</th><th>I</th><th>J</th><th>K</th><th>L</th><th>M</th><th>N</th><th>Ñ</th><th>O</th><th>P</th><th>Q</th><th>R</th><th>S</th><th>T</th><th>U</th><th>V</th><th>W</th><th>X</th><th>Y</th><th>Z</th></tr></thead><tbody>'
        + '<tr><td>I</td><td>B</td><td>P</td><td>D</td><td>O</td><td>F</td><td>G</td><td>H</td><td>A</td><td>J</td><td>K</td><td>N</td><td>M</td><td>L</td><td>Ñ</td><td>E</td><td>C</td><td>Q</td><td>T</td><td>S</td><td>R</td><td>U</td><td>V</td><td>W</td><td>X</td><td>Y</td><td>Z</td></tr>'
        + '</tbody></table></details>';
    }
  },

  grid: {
    id: 'grid',
    name: 'Cuadrícula (Grid)',
    needsKeyword: false,
    description: 'Cada letra se codifica según su posición en una cuadrícula 3×3. El primer dígito es la fila y el segundo la columna.',
    encrypt: function (text) {
      return text.split('').map(ch => {
        return GRID_ENCRYPT_MAP[ch.toUpperCase()] || ch;
      }).join(' ');
    },
    decrypt: function (text) {
      if (!text.trim()) throw new Error('El mensaje no puede estar vacío');
      const codes = text.trim().split(/\s+/);
      const result = [];
      for (const code of codes) {
        if (!/^\d+$/.test(code)) throw new Error(`Código inválido: '${code}'`);
        const r = parseInt(code[0]) - 1;
        const c = parseInt(code[1]) - 1;
        if (r < 0 || r >= 3 || c < 0 || c >= 9) throw new Error(`Código fuera de rango: '${code}'`);
        result.push(GRID_3x9[r][c]);
      }
      return result.join('');
    },
    getReference: function () {
      const data = GRID_3x9;
      let html = '<table class="ref-table grid-pythagorean"><thead><tr><th></th>';
      for (let c = 0; c < 9; c++) {
        const cls = (c === 2 || c === 5) ? ' class="sep-v"' : '';
        html += `<th${cls}>${c + 1}</th>`;
      }
      html += '</tr></thead><tbody>';
      for (let r = 0; r < 3; r++) {
        html += '<tr>';
        html += `<th>${r + 1}</th>`;
        for (let c = 0; c < 9; c++) {
          const classes = [];
          if (c === 2 || c === 5) classes.push('sep-v');
          if (r === 0 || r === 1) classes.push('sep-h');
          const cls = classes.length ? ` class="${classes.join(' ')}"` : '';
          const code = `${r + 1}${c + 1}`;
          html += `<td${cls}><span class="ref-char">${data[r][c]}</span><span class="ref-code-sm">${code}</span></td>`;
        }
        html += '</tr>';
      }
      html += '</tbody></table>';
      return html;
    }
  },

  parelinofu: {
    id: 'parelinofu',
    name: 'Parelinofú',
    needsKeyword: false,
    description: 'Cada letra se reemplaza por su par en la palabra PARELINOFU (PA-RE-LI-NO-FU). Las letras que no están en la palabra quedan igual.',
    encrypt: function (text) {
      const map = { 'P':'A', 'A':'P', 'R':'E', 'E':'R', 'L':'I', 'I':'L', 'N':'O', 'O':'N', 'F':'U', 'U':'F' };
      return text.toUpperCase().split('').map(ch => map[ch] || ch).join('');
    },
    decrypt: function (text) {
      return this.encrypt(text);
    },
    getReference: function () {
      const orig = ['P','A','R','E','L','I','N','O','F','U'];
      const repl = ['A','P','E','R','I','L','O','N','U','F'];
      let html = '<table class="ref-table"><tbody><tr>';
      for (const ch of orig) html += `<td class="ref-char">${ch}</td>`;
      html += '</tr><tr>';
      for (const ch of repl) html += `<td class="ref-code">${ch}</td>`;
      html += '</tr></tbody></table>';
      return html;
    }
  },

  cajon: {
    id: 'cajon',
    name: 'Cajón (Rejilla)',
    needsKeyword: false,
    description: 'Cada letra se reemplaza por su imagen en la rejilla de 3 cajones. Usá la grilla interactiva para escribir el mensaje manualmente.',
    encrypt: function (text) {
      const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
      let html = '';
      for (const ch of text.toUpperCase()) {
        if (ch === ' ') {
          html += '<span class="cajon-space"></span>';
        } else if (letters.includes(ch)) {
          html += '<img src="img/rejilla/' + ch + '.svg" class="cajon-img" alt="' + ch + '">';
        }
      }
      return html;
    },
    decrypt: function () {
      throw new Error('Usá la grilla de botones para escribir el mensaje manualmente.');
    },
    getReference: function () {
      const data = GRID_3x9;
      let html = '<table class="ref-table grid-pythagorean"><thead><tr><th></th>';
      for (let c = 0; c < 9; c++) {
        html += '<th' + ((c === 2 || c === 5) ? ' class="sep-v"' : '') + '>' + (c + 1) + '</th>';
      }
      html += '</tr></thead><tbody>';
      for (let r = 0; r < 3; r++) {
        html += '<tr><th>' + (r + 1) + '</th>';
        for (let c = 0; c < 9; c++) {
          const classes = [];
          if (c === 2 || c === 5) classes.push('sep-v');
          if (r < 2) classes.push('sep-h');
          const cls = classes.length ? ' class="' + classes.join(' ') + '"' : '';
          html += '<td' + cls + '><img src="img/rejilla/' + data[r][c] + '.svg" class="cajon-ref-img" alt="' + data[r][c] + '"><span class="ref-code-sm">' + data[r][c] + '</span></td>';
        }
        html += '</tr>';
      }
      html += '</tbody></table>';
      return html;
    }
  },

  reverse: {
    id: 'reverse',
    name: 'Inverso (Reverse)',
    needsKeyword: false,
    description: 'Cada palabra se escribe al revés. Para descifrar se aplica la misma operación.',
    encrypt: function (text) {
      return text.split(' ').map(w => w.split('').reverse().join('')).join(' ');
    },
    decrypt: function (text) {
      return this.encrypt(text);
    },
    getReference: function () {
      return '<p class="ref-simple"><strong>Ejemplo:</strong> "Scout Cipher" → "tuocS rehpiC"</p>';
    }
  }
};
