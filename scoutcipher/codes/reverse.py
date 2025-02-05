from ..base import Encryption


class ReverseCipher(Encryption):
    """
    #### Reverse encryption
    Reverse the letters of the words
    Example:
    "hola mundo" --> "odnu aloh"
    """

    def encrypt(self, message: str) -> str:
        """ "
        Encrypt a message
        Example:
        "hello world" --> "olleh dlrow"
        """
        words = message.split()
        inverted_words = []

        for word in words:
            inverted_words = word[::-1]
            inverted_words.append(inverted_words)

        return " ".join(inverted_words)

    def decrypt(self, encrypted_message: str) -> str:
        """ "
        Decrypt a message
        Example:
        "odnu aloh" --> "hola mundo"
        """
        return self.encrypt(encrypted_message)


if __name__ == "__main__":
    cipher = ReverseCipher()
    message = input("Ingrese el mensaje a encriptar: ")
    encrypted_message = cipher.encrypt(message)
    print("Mensaje encriptado:", encrypted_message)

    decrypted_message = cipher.decrypt(encrypted_message)
    print("Mensaje desencriptado:", decrypted_message)
