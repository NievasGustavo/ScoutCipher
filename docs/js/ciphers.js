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
    description: 'Cada letra se codifica según su posición en una cuadrícula 3×9. El primer dígito es la fila y el segundo la columna.',
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
      const grid = [
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        ['J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q'],
        ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      ];
      let html = '<table class="ref-table grid-ref">';
      for (let r = 0; r < grid.length; r++) {
        html += '<tr>';
        for (let c = 0; c < grid[r].length; c++) {
          const code = `${r + 1}${c + 1}`;
          html += `<td><span class="ref-char">${grid[r][c]}</span><span class="ref-code-sm">${code}</span></td>`;
        }
        html += '</tr>';
      }
      html += '</table>';
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
