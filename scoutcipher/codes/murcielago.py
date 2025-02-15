from ..base import Encryption


class MurcielagoCipher(Encryption):
    """
    #### MURCIELAGO(bat) encryption\n
    Each character in the word bat is assigned a number from 0 to 9.\n
    The rest of the letters remain the same.

    M u r c i e l a g o\n
    0 1 2 3 4 5 6 7 8 9

    Example:
    "isla está en oro" --> "4s67 5st7 5n 929"\n
    "message to encrypt" --> "05ss785 t9 5n32ypt"
    """

    def __init__(self):
        self.MURCIELAGO = "murcielago"
        self.decrypt_alph = {}

        for i, char in enumerate(self.MURCIELAGO):
            self.decrypt_alph[str(i)] = char

    def encrypt(self, message: str) -> str:
        """
        Converts a message to murcielago
        Example:
        "message to encrypt" --> "05ss785 t9 5n32ypt"
        """
        ecrypted = []
        for char in message.lower():
            if char in self.MURCIELAGO:
                ecrypted.append(str(self.MURCIELAGO.index(char)))
            else:
                ecrypted.append(char)
        return "".join(ecrypted)

    def decrypt(self, encrypted_message: str) -> str:
        """
        Decrypted message from murcielago
        Example:
        "05ss785 t9 5n32ypt" --> "message to encrypt"
        """
        decrypted = []
        for char in encrypted_message:
            if char in self.decrypt_alph:
                decrypted.append(self.decrypt_alph[char])
            else:
                decrypted.append(char)
        return "".join(decrypted)


if __name__ == "__main__":
    cipher = MurcielagoCipher()
    print(cipher.encrypt("message to encrypt"))
    print(cipher.decrypt("05ss785 t9 5n32ypt"))
