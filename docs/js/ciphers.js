const Ciphers = {
  morse: {
    id: 'morse',
    name: 'Morse',
    needsKeyword: false,
    description: 'Cada letra se reemplaza por su código Morse. Las letras se separan con / y las palabras con //.',
    encrypt: function (text) {
      const dict = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
        '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
      };
      const words = text.toUpperCase().split(' ');
      const result = [];
      for (const word of words) {
        const chars = [];
        for (const ch of word) {
          if (!dict[ch]) throw new Error(`Caracter no soportado: '${ch}'`);
          chars.push(dict[ch]);
        }
        result.push(chars.join('/'));
      }
      return result.join('//');
    },
    decrypt: function (text) {
      const dict = {
        '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
        '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
        '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
        '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
        '-.--': 'Y', '--..': 'Z',
        '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
        '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9'
      };
      if (!text.trim()) throw new Error('El mensaje no puede estar vacío');
      const words = text.split('//');
      const result = [];
      for (const word of words) {
        const codes = word.split('/');
        const chars = [];
        for (const code of codes) {
          if (!dict[code]) throw new Error(`Código Morse inválido: '${code}'`);
          chars.push(dict[code]);
        }
        result.push(chars.join(''));
      }
      return result.join(' ');
    },
    getReference: function () {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      const morse = {'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..'};
      let html = '<table class="ref-table"><tbody><tr>';
      for (const l of letters) html += `<td class="ref-char">${l}</td>`;
      html += '</tr><tr>';
      for (const l of letters) html += `<td class="ref-code">${morse[l]}</td>`;
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
      const map = {
        'A': 'Z', 'B': 'Y', 'C': 'X', 'D': 'W', 'E': 'V', 'F': 'U', 'G': 'T',
        'H': 'S', 'I': 'R', 'J': 'Q', 'K': 'P', 'L': 'O', 'M': 'Ñ', 'N': 'N',
        'Ñ': 'M', 'O': 'L', 'P': 'K', 'Q': 'J', 'R': 'I', 'S': 'H', 'T': 'G',
        'U': 'F', 'V': 'E', 'W': 'D', 'X': 'C', 'Y': 'B', 'Z': 'A'
      };
      return text.split('').map(ch => {
        if (!/[a-zA-ZÀ-ÿÑñ]/.test(ch)) return ch;
        const upper = ch.toUpperCase();
        const result = map[upper] || upper;
        return ch === ch.toLowerCase() ? result.toLowerCase() : result;
      }).join('');
    },
    decrypt: function (text) {
      return this.encrypt(text);
    },
    getReference: function () {
      const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
      const map = {
        'A': 'Z', 'B': 'Y', 'C': 'X', 'D': 'W', 'E': 'V', 'F': 'U', 'G': 'T',
        'H': 'S', 'I': 'R', 'J': 'Q', 'K': 'P', 'L': 'O', 'M': 'Ñ', 'N': 'N',
        'Ñ': 'M', 'O': 'L', 'P': 'K', 'Q': 'J', 'R': 'I', 'S': 'H', 'T': 'G',
        'U': 'F', 'V': 'E', 'W': 'D', 'X': 'C', 'Y': 'B', 'Z': 'A'
      };
      let html = '<table class="ref-table"><tbody><tr>';
      html += '<td class="ref-label">Normal</td>';
      for (const ch of alphabet) html += `<td class="ref-char">${ch}</td>`;
      html += '</tr><tr>';
      html += '<td class="ref-label">Cifrado</td>';
      for (const ch of alphabet) html += `<td class="ref-code">${map[ch]}</td>`;
      html += '</tr></tbody></table>';
      return html;
    }
  },

  grid: {
    id: 'grid',
    name: 'Cuadrícula (Grid)',
    needsKeyword: false,
    description: 'Cada letra se codifica según su posición en una cuadrícula 3×3. El primer dígito es la fila y el segundo la columna.',
    encrypt: function (text) {
      const grid = [
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        ['J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q'],
        ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      ];
      const map = {};
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          map[grid[r][c]] = `${r + 1}${c + 1}`;
          map[grid[r][c].toLowerCase()] = `${r + 1}${c + 1}`;
        }
      }
      return text.split('').map(ch => {
        const upper = ch.toUpperCase();
        return map[upper] || ch;
      }).join(' ');
    },
    decrypt: function (text) {
      const grid = [
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        ['J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q'],
        ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      ];
      if (!text.trim()) throw new Error('El mensaje no puede estar vacío');
      const codes = text.trim().split(/\s+/);
      const result = [];
      for (const code of codes) {
        if (!/^\d+$/.test(code)) throw new Error(`Código inválido: '${code}'`);
        const r = parseInt(code[0]) - 1;
        const c = parseInt(code[1]) - 1;
        if (r < 0 || r >= 3 || c < 0 || c >= 9) throw new Error(`Código fuera de rango: '${code}'`);
        result.push(grid[r][c]);
      }
      return result.join('');
    },
    getReference: function () {
      const data = [
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        ['J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q'],
        ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      ];
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
      const data = [['A','B','C','D','E','F','G','H','I'],['J','K','L','M','N','Ñ','O','P','Q'],['R','S','T','U','V','W','X','Y','Z']];
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

var SVG_DATA = {
  A: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C0.66 0 1.32 0 2 0 C2 11.88 2 23.76 2 36 C-16.15 36 -34.3 36 -53 36 C-53 35.34 -53 34.68 -53 34 C-35.51 34 -18.02 34 0 34 C0 22.78 0 11.56 0 0 Z " fill="#000000" transform="translate(54,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(9,21.75)"/>\n</svg>',
  B: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C0.66 0 1.32 0 2 0 C2 11.88 2 23.76 2 36 C-16.15 36 -34.3 36 -53 36 C-53 35.34 -53 34.68 -53 34 C-35.51 34 -18.02 34 0 34 C0 22.78 0 11.56 0 0 Z " fill="#000000" transform="translate(54,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(27,21.75)"/>\n</svg>',
  C: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C0.66 0 1.32 0 2 0 C2 11.88 2 23.76 2 36 C-16.15 36 -34.3 36 -53 36 C-53 35.34 -53 34.68 -53 34 C-35.51 34 -18.02 34 0 34 C0 22.78 0 11.56 0 0 Z " fill="#000000" transform="translate(54,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(46,21.75)"/>\n</svg>',
  D: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C0.66 0 1.32 0 2 0 C2 11.22 2 22.44 2 34 C18.83 34 35.66 34 53 34 C53 22.78 53 11.56 53 0 C53.66 0 54.32 0 55 0 C55 11.88 55 23.76 55 36 C36.85 36 18.7 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(9,21.75)"/>\n</svg>',
  E: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C0.66 0 1.32 0 2 0 C2 11.22 2 22.44 2 34 C18.83 34 35.66 34 53 34 C53 22.78 53 11.56 53 0 C53.66 0 54.32 0 55 0 C55 11.88 55 23.76 55 36 C36.85 36 18.7 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(27,21.75)"/>\n</svg>',
  F: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C0.66 0 1.32 0 2 0 C2 11.22 2 22.44 2 34 C18.83 34 35.66 34 53 34 C53 22.78 53 11.56 53 0 C53.66 0 54.32 0 55 0 C55 11.88 55 23.76 55 36 C36.85 36 18.7 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(46,21.75)"/>\n</svg>',
  G: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C0.66 0 1.32 0 2 0 C2 11.22 2 22.44 2 34 C19.16 34 36.32 34 54 34 C54 34.66 54 35.32 54 36 C36.18 36 18.36 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(9,21.75)"/>\n</svg>',
  H: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C0.66 0 1.32 0 2 0 C2 11.22 2 22.44 2 34 C19.16 34 36.32 34 54 34 C54 34.66 54 35.32 54 36 C36.18 36 18.36 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(27,21.75)"/>\n</svg>',
  I: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C0.66 0 1.32 0 2 0 C2 11.22 2 22.44 2 34 C19.16 34 36.32 34 54 34 C54 34.66 54 35.32 54 36 C36.18 36 18.36 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(46,21.75)"/>\n</svg>',
  J: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C18.15 0 36.3 0 55 0 C55 11.88 55 23.76 55 36 C36.85 36 18.7 36 0 36 C0 35.34 0 34.68 0 34 C17.49 34 34.98 34 53 34 C53 23.44 53 12.88 53 2 C35.51 2 18.02 2 0 2 C0 1.34 0 0.68 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(9,21.75)"/>\n</svg>',
  K: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C18.15 0 36.3 0 55 0 C55 11.88 55 23.76 55 36 C36.85 36 18.7 36 0 36 C0 35.34 0 34.68 0 34 C17.49 34 34.98 34 53 34 C53 23.44 53 12.88 53 2 C35.51 2 18.02 2 0 2 C0 1.34 0 0.68 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(27,21.75)"/>\n</svg>',
  L: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C18.15 0 36.3 0 55 0 C55 11.88 55 23.76 55 36 C36.85 36 18.7 36 0 36 C0 35.34 0 34.68 0 34 C17.49 34 34.98 34 53 34 C53 23.44 53 12.88 53 2 C35.51 2 18.02 2 0 2 C0 1.34 0 0.68 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(46,21.75)"/>\n</svg>',
  M: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C18.15 0 36.3 0 55 0 C55 11.88 55 23.76 55 36 C36.85 36 18.7 36 0 36 C0 24.12 0 12.24 0 0 Z M2 2 C2 12.56 2 23.12 2 34 C18.83 34 35.66 34 53 34 C53 23.44 53 12.88 53 2 C36.17 2 19.34 2 2 2 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(9,21.75)"/>\n</svg>',
  N: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C18.15 0 36.3 0 55 0 C55 11.88 55 23.76 55 36 C36.85 36 18.7 36 0 36 C0 24.12 0 12.24 0 0 Z M2 2 C2 12.56 2 23.12 2 34 C18.83 34 35.66 34 53 34 C53 23.44 53 12.88 53 2 C36.17 2 19.34 2 2 2 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(27,21.75)"/>\n</svg>',
  Ñ: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C18.15 0 36.3 0 55 0 C55 11.88 55 23.76 55 36 C36.85 36 18.7 36 0 36 C0 24.12 0 12.24 0 0 Z M2 2 C2 12.56 2 23.12 2 34 C18.83 34 35.66 34 53 34 C53 23.44 53 12.88 53 2 C36.17 2 19.34 2 2 2 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(46,21.75)"/>\n</svg>',
  O: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C17.82 0 35.64 0 54 0 C54 0.66 54 1.32 54 2 C36.84 2 19.68 2 2 2 C2 12.56 2 23.12 2 34 C19.16 34 36.32 34 54 34 C54 34.66 54 35.32 54 36 C36.18 36 18.36 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(9,21.75)"/>\n</svg>',
  P: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C17.82 0 35.64 0 54 0 C54 0.66 54 1.32 54 2 C36.84 2 19.68 2 2 2 C2 12.56 2 23.12 2 34 C19.16 34 36.32 34 54 34 C54 34.66 54 35.32 54 36 C36.18 36 18.36 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(27,21.75)"/>\n</svg>',
  Q: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C17.82 0 35.64 0 54 0 C54 0.66 54 1.32 54 2 C36.84 2 19.68 2 2 2 C2 12.56 2 23.12 2 34 C19.16 34 36.32 34 54 34 C54 34.66 54 35.32 54 36 C36.18 36 18.36 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(46,21.75)"/>\n</svg>',
  R: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C18.15 0 36.3 0 55 0 C55 11.88 55 23.76 55 36 C54.34 36 53.68 36 53 36 C53 24.78 53 13.56 53 2 C35.51 2 18.02 2 0 2 C0 1.34 0 0.68 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(9,21.75)"/>\n</svg>',
  S: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C18.15 0 36.3 0 55 0 C55 11.88 55 23.76 55 36 C54.34 36 53.68 36 53 36 C53 24.78 53 13.56 53 2 C35.51 2 18.02 2 0 2 C0 1.34 0 0.68 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(27,21.75)"/>\n</svg>',
  T: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C18.15 0 36.3 0 55 0 C55 11.88 55 23.76 55 36 C54.34 36 53.68 36 53 36 C53 24.78 53 13.56 53 2 C35.51 2 18.02 2 0 2 C0 1.34 0 0.68 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(46,21.75)"/>\n</svg>',
  U: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C18.15 0 36.3 0 55 0 C55 11.88 55 23.76 55 36 C54.34 36 53.68 36 53 36 C53 24.78 53 13.56 53 2 C36.17 2 19.34 2 2 2 C2 13.22 2 24.44 2 36 C1.34 36 0.68 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(9,21.75)"/>\n</svg>',
  V: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C18.15 0 36.3 0 55 0 C55 11.88 55 23.76 55 36 C54.34 36 53.68 36 53 36 C53 24.78 53 13.56 53 2 C36.17 2 19.34 2 2 2 C2 13.22 2 24.44 2 36 C1.34 36 0.68 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(27,21.75)"/>\n</svg>',
  W: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C18.15 0 36.3 0 55 0 C55 11.88 55 23.76 55 36 C54.34 36 53.68 36 53 36 C53 24.78 53 13.56 53 2 C36.17 2 19.34 2 2 2 C2 13.22 2 24.44 2 36 C1.34 36 0.68 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(46,21.75)"/>\n</svg>',
  X: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C17.82 0 35.64 0 54 0 C54 0.66 54 1.32 54 2 C36.84 2 19.68 2 2 2 C2 13.22 2 24.44 2 36 C1.34 36 0.68 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(9,21.75)"/>\n</svg>',
  Y: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C17.82 0 35.64 0 54 0 C54 0.66 54 1.32 54 2 C36.84 2 19.68 2 2 2 C2 13.22 2 24.44 2 36 C1.34 36 0.68 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(27,21.75)"/>\n</svg>',
  Z: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: https://ezgif.com/png-to-svg -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="56" height="40">\n<path d="M0 0 C17.82 0 35.64 0 54 0 C54 0.66 54 1.32 54 2 C36.84 2 19.68 2 2 2 C2 13.22 2 24.44 2 36 C1.34 36 0.68 36 0 36 C0 24.12 0 12.24 0 0 Z " fill="#000000" transform="translate(1,2)"/>\n<path d="M0 0 C3 0.25 3 0.25 5 2.25 C5.25 5.25 5.25 5.25 5 8.25 C3 10.25 3 10.25 0 10.5 C-3 10.25 -3 10.25 -5 8.25 C-5.25 5.25 -5.25 5.25 -5 2.25 C-3 0.25 -3 0.25 0 0 Z " fill="#000000" transform="translate(46,21.75)"/>\n</svg>'
};
