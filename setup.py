from setuptools import find_packages, setup

setup(
    name="ScoutCipher",
    version="0.1.0",
    description="ScoutCipher is a Python package for encrypting and decrypting messages using different encryption methods using scout codes.",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    include_package_data=True,
    author="Gustavo Nievas",
    url="https://github.com/NievasGustavo/ScoutCipher",
    license="MIT",
    packages=find_packages(),
    python_requires=">=3.10",
    classifiers=[
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
)
