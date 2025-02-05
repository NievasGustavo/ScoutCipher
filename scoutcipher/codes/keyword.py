from ..base import Encryption


class KeywordCipher(Encryption):
    """
    #### Keyword encryption\n
    We use the normal alphabet as a reference.\n
    We then remove the repeated letters from our keyword,
    place it at the beginning of the alphabet and remove the repeated letters in the rest of the alphabet.

    Normal alphabet: A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z\n
    Encrypted alphabet: B A T M N C D E F G H I J K L O P Q R S U V W X Y Z
    Example:
    "Scout" --> "RTÑUS"\n
    "Oyseñk" --> "Python"
    """

    def __init__(self, keyword):
        self.keyword = keyword.upper()
        self.alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"
        self.cipher = self._generate_cipher()

    def _generate_cipher(self):
        unique_chars = []

        for char in self.keyword:
            if char not in unique_chars:
                unique_chars.append(char)

        for char in self.alphabet:
            if char not in unique_chars:
                unique_chars.append(char)

        return "".join(unique_chars)

    def encrypt(self, text):
        # Encrypt the text using the alphabet and keyword
        text = text.upper()
        encrypted_text = ""

        for char in text:
            if char in self.alphabet:
                index = self.alphabet.index(char)
                encrypted_text += self.cipher[index]
            else:
                encrypted_text += char

        return encrypted_text

    def decrypt(self, encrypted_text):
        # Decrypt the text using the alphabet and keyword
        decrypted_text = ""

        for char in encrypted_text:
            if char in self.cipher:
                index = self.cipher.index(char)
                decrypted_text += self.alphabet[index]
            else:
                decrypted_text += char

        return decrypted_text


if __name__ == "__main__":
    cipher = KeywordCipher("batman")

    encrypted_message = cipher.encrypt("Scout")
    print(encrypted_message)
    print(cipher.decrypt(encrypted_message))
