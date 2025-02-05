# ⚜ Scout Cipher ⚜

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![Python Version](https://img.shields.io/badge/python-3.10%2B-blue)](https://www.python.org/)

## About Scout Cipher ⛺ 🌙 🎒 🔦

In “Scout” part of the scouting technique is to decrypt and encrypt messages, usually used in a game called “Mafeking Siege” or “Treasure hunt”.

In addition to Morse code, there are other codes in this library that are quite curious.

Cheer up and contribute more of your scout group's codes!

Handshake with left hand!

Be ready ⚜️

## Features 🗝️

- **6+ Cipher Methods**: Morse, Keyword, Reverse and more.
- **Simple API**: Intuitive classes for each cipher (`Morse()`, `Murcielago()`, etc.).
- **MIT Licensed**: Free for personal and commercial use.

## Installation 💻

```bash
pip install ScoutCipher
```

## Usage 🚀

### Morse code encryption:

Common Morse code where each letter is separated by / and words by //.

```python
from ScoutCipher import Morse

cipher = Morse()
encrypted_message = cipher.encrypt("Be ready") # Output: "-..././/.-././.-/-../-.--"
descrypted_message = cipher.decrypt(encrypted_message) # Output: "Be ready"
```

### Reverse encryption:

Just read each word backwards:

Example: “Be ready” using the code would be “eb ydaer”.

```python
from ScoutCipher import Reverse

cipher = Reverse()
encrypted_message = cipher.encrypt("Scout") # Output: "tuocs"
descrypted_message = cipher.decrypt(encrypted_message) # Output: "Scout"
```

### Keyword encryption:

We write the normal alphabet, and under it we write the keyword alphabet.

The key alphabet starts with the keyword without repeating letters  
and then we write the normal alphabet omitting the letters of the keyword.

Example with the word “Batman” as the keyword:

Then, each letter of the normal alphabet corresponds to the letter of the coded alphabet below it.

```asciiart
Normal Alphabet: A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z
Code Alphabet:   B A T M N C D E F G H I J K L Ñ O P Q R S U V W X Y Z
```

```python
from ScoutCipher import Keyword

cipher = Keyword("batman")
encrypted_message = cipher.encrypt("Scout")# Output: "RTÑUS"
descrypted_message = cipher.decrypt(encrypted_message) # Output: "Scout"
```

### Inverted alphabet encryption

In this key, each letter of the key is translated by another letter, like this:

A FOR Z  
B FOR Y  
C FOR X

And so on.  
Example:

```asciiart
A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z
Z Y X W V U T S R Q P O Ñ N M L K J I H G F E D C B A
```

```python
from ScoutCipher import Backward

cipher = Backward()
encrypted_message = cipher.encrypt("Scout") # Output: "Hxlfg"
descrypted_message = cipher.decrypt(encrypted_message) # Output: "Scout"
```

### Grid encryption

The grid is a 3x3 matrix of letters, and each letter is assigned a code based on its position in the matrix ("row-column" format).

It is a mostly visual code where a table is used to encrypt or decrypt the code.

```asciiart
       ║       ║
 A B C ║ D E F ║ G H I
═══════╬═══════╬═══════
 J K L ║ M N Ñ ║ O P Q
═══════╬═══════╬═══════
 R S T ║ U V W ║ X Y Z
       ║       ║
```

Example:
S is 3 in the row and 2 in the column

```python
from ScoutCipher import Grid

cipher = Grid()
encrypted_message = cipher.encrypt("Scout") # Output: "32 13 27 34 33"
descrypted_message = cipher.decrypt(encrypted_message) # Output: "Scout"
```

### Murcielago encryption

The word bat (“Murcielago” in Spanish) is used where each letter of the word is assigned a number.

The rest of the letters remain the same  
M u r c i e l a g o  
0 1 2 3 4 5 6 7 8 9

```python
from ScoutCipher import Murcielago

cipher = Murcielago()
encrypted_message = cipher.encrypt("Scout") # Ouput: "s391t"
descrypted_message = cipher.decrypt(encrypted_message) # Output: "Scout"

```

---

## Contributing 🤝

We welcome contributions to ScoutCipher! If you want to add more ciphers, fix bugs, or improve documentation, feel free to fork the repository and submit a pull request.

1. Fork the project.
2. Create a branch (git checkout -b feature/your-feature).
3. Commit your changes (git commit -am 'Add new cipher').
4. Push to the branch (git push origin feature/your-feature).
5. Open a pull request.

---

## License 📜

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more details.
