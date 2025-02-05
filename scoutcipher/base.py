from abc import ABC, abstractmethod


class Encryption(ABC):
    @abstractmethod
    def encrypt(self, message):
        pass
    
    @abstractmethod
    def decrypt(self, encrypted_message):
        pass