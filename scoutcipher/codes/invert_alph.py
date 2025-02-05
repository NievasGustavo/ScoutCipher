from ..base import Encryption


class BackwardCipher(Encryption):
    """
    #### Backward encryption
    Encrypts with the inverted A-Z alphabet in Spanish.
    """

    def __init__(self):
        self.ALPHABET_MAP = {
            "A": "Z",
            "B": "Y",
            "C": "X",
            "D": "W",
            "E": "V",
            "F": "U",
            "G": "T",
            "H": "S",
            "I": "R",
            "J": "Q",
            "K": "P",
            "L": "O",
            "M": "Ñ",
            "N": "N",
            "Ñ": "M",
            "O": "L",
            "P": "K",
            "Q": "J",
            "R": "I",
            "S": "H",
            "T": "G",
            "U": "F",
            "V": "E",
            "W": "D",
            "X": "C",
            "Y": "B",
            "Z": "A",
        }

    def _transform_char(self, char: str) -> str:
        """Transforms a character according to the map, preserving upper/lower case letters."""
        if not char.isalpha():
            return char

        is_lower = char.islower()
        upper_char = char.upper()

        transformed = self.ALPHABET_MAP.get(upper_char, upper_char)

        if is_lower:
            transformed = transformed.lower()
        return transformed

    def encrypt(self, message: str) -> str:
        """
        Encrypts the given message using the inverted alphabet.
        Example:
        "hola mundo" --> "ZUYNOL ADNOM"
        """
        return "".join([self._transform_char(c) for c in message])

    def decrypt(self, encrypted_message: str) -> str:
        """
        Decrypts the given message using the inverted alphabet.
        Example:
        "ZUYNOL ADNOM" --> "hola mundo"
        """
        return self.encrypt(encrypted_message)


if __name__ == "__main__":
    cipher = BackwardCipher()
    print(cipher.encrypt("hola mundo"))
    print(cipher.decrypt("Sloz Ñfnwl"))