from ..base import Encryption


class MorseCipher(Encryption):
    """
    #### Morse code encryption
    Encodes a message with morse code
    Example:
    "hello world" --> "...././.-../.-../---//.--/---/.-./.-../-.."
    "...././.-../.-../---//.--/---/.-./.-../-.."  --> "hello world"
    """

    MORSE_CODE_DICT = {
        "A": ".-",
        "B": "-...",
        "C": "-.-.",
        "D": "-..",
        "E": ".",
        "F": "..-.",
        "G": "--.",
        "H": "....",
        "I": "..",
        "J": ".---",
        "K": "-.-",
        "L": ".-..",
        "M": "--",
        "N": "-.",
        "O": "---",
        "P": ".--.",
        "Q": "--.-",
        "R": ".-.",
        "S": "...",
        "T": "-",
        "U": "..-",
        "V": "...-",
        "W": ".--",
        "X": "-..-",
        "Y": "-.--",
        "Z": "--..",
        "0": "-----",
        "1": ".----",
        "2": "..---",
        "3": "...--",
        "4": "....-",
        "5": ".....",
        "6": "-....",
        "7": "--...",
        "8": "---..",
        "9": "----.",
    }

    def __init__(self):
        self.INV_MORSE_DICT = {}
        for k, v in self.MORSE_CODE_DICT.items():
            self.INV_MORSE_DICT[v] = k

    def encrypt(self, message: str) -> str:
        """
        Encrypt a message with morse code
        Example:
        "hello world" --> "...././.-../.-../---//.--/---/.-./.-../-.."
        """
        words = message.upper().split()
        encrypted_words = []

        for word in words:
            encrypted_chars = []
            for char in word:
                if char in self.MORSE_CODE_DICT:
                    encrypted_chars.append(self.MORSE_CODE_DICT[char])
                else:
                    raise ValueError(f"Character not supported: '{char}'")
            encrypted_words.append("/".join(encrypted_chars))

        return "//".join(encrypted_words)

    def decrypt(self, encrypted_message: str) -> str:
        """
        Decrypt a message with morse code
        Example:
        "...././.-../.-../---//.--/---/.-./.-../-.."  --> "hello world"
        """
        if encrypted_message == "":
            raise ValueError("The encrypted message cannot be empty")
        encrypted_words = encrypted_message.split("//")
        decrypted_words = []

        for word in encrypted_words:
            if word not in self.MORSE_CODE_DICT.values():
                raise ValueError(f"Invalid Morse code: '{word}'")

            decrypted_chars = []
            morse_codes = word.split("/")

            for code in morse_codes:
                if code in self.INV_MORSE_DICT:
                    decrypted_chars.append(self.INV_MORSE_DICT[code])
                else:
                    raise ValueError(f"Invalid Morse code: '{code}'")
            decrypted_words.append("".join(decrypted_chars))

        return " ".join(decrypted_words)


if __name__ == "__main__":
    cipher = MorseCipher()
    message = input("Ingrese el mensaje a encriptar: ")
    encrypted_message = cipher.encrypt(message)
    print("Mensaje encriptado:", encrypted_message)

    decrypted_message = cipher.decrypt(encrypted_message)
    print("Mensaje desencriptado:", decrypted_message)
