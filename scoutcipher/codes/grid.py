from ..base import Encryption


class GridCipher(Encryption):
    """
    #### Grid encryption
    A table is used to decrypt or encrypt:
           ║       ║       \n
     A B C ║ D E F ║ G H I \n
    ═══════╬═══════╬═══════\n
     J K L ║ M N Ñ ║ O P Q \n
    ═══════╬═══════╬═══════\n
     R S T ║ U V W ║ X Y Z \n
           ║       ║       \n
    Example:
    "Scout" --> 32 13 27 34 33\n
    28 38 33 18 27 25 --> "Python"
    """

    def __init__(self):
        self.matriz = [
            ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
            ["J", "K", "L", "M", "N", "Ñ", "O", "P", "Q"],
            ["R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
        ]
        self.char_to_code = self._create_char_to_code_map()
        self.code_to_char = self._create_code_to_char_map()

    def _create_char_to_code_map(self) -> dict:
        """
        Creates a mapping of each letter to its code based
        on its position in the matrix ("row-column" format).
        Example: 'A' -> '11', 'B' -> '12', etc.
        """
        mapping = {}

        for row_idx, row in enumerate(self.matriz):
            for col_idx, char in enumerate(row):
                code = f"{row_idx + 1}{col_idx + 1}"
                mapping[char] = code
                mapping[char.lower()] = code

        return mapping

    def _create_code_to_char_map(self) -> dict:
        code_to_char = {}

        for char, code in self.char_to_code.items():
            code_to_char[code] = char

        return code_to_char

    def encrypt(self, message: str) -> str:
        """
        Encrypts a message from normal alphabet to grid
        Example:
        "python" --> "28 38 33 18 27 25"
        """
        encrypted = []
        for char in message:
            if char.upper() in self.char_to_code:
                encrypted.append(self.char_to_code[char.upper()])
            else:
                encrypted.append(char)
        return " ".join(encrypted)

    def decrypt(self, encrypted_message: str) -> str:
        """
        Decrypts a message from grid
        Example:
        "32 13 27 34 33" --> "Scout"
        """
        decrypted = []
        codes = encrypted_message.split(" ")
        for code in codes:
            if not code.isdigit():
                raise ValueError(f"Invalid code: '{code}'. It must be a number")
            if code in self.code_to_char:
                decrypted.append(self.code_to_char[code])
            else:
                if code == "":
                    decrypted.append(" ")
                    continue
                decrypted.append(code)
        return "".join(decrypted)


if __name__ == "__main__":
    cipher = GridCipher()

    message = "python"
    encrypted = cipher.encrypt(message)
    print(encrypted)

    decrypted = cipher.decrypt(encrypted)
    print(decrypted)
