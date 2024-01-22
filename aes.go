package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"errors"
	"fmt"
	"io"

	"github.com/matthewhartstonge/argon2"
)

var argon = argon2.DefaultConfig()


func GetHash(pwd string, salt []byte) (argon2.Raw, error) {
	if len(salt) != int(argon.SaltLength) {
		return argon2.Raw{},
		errors.New("Hash length must be: " + fmt.Sprint(argon.SaltLength) + "bytes") 
	}
	hash, err := argon.Hash([]byte(pwd), salt)
	if err != nil {
		return argon2.Raw{}, err
	}
	return hash, nil
}

func VerifyHash(pwd string, salt []byte, hash []byte) bool {
	match, err := argon2.VerifyEncoded([]byte(pwd), hash)
	if err != nil {
		return false
	}
	return match
}

func Decrypt(key []byte, ciphertext []byte, nonce []byte) string {

	block, err := aes.NewCipher(key)
	if err != nil {
		panic(err.Error())
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		panic(err.Error())
	}
	plaintext, err := aesgcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		panic(err.Error())
	}
	return string(plaintext)
}

func Encrypt(key *[]byte, text *string) (cipherText *[]byte, nonce []byte) {

	// Load your secret key from a safe place and reuse it across multiple
	// Seal/Open calls. (Obviously don't use this example key for anything
	// real.) If you want to convert a passphrase to a key, use a suitable
	// package like bcrypt or scrypt.
	// When decoded the key should be 16 bytes (AES-128) or 32 (AES-256).
	block, err := aes.NewCipher(*key)
	if err != nil {
		panic(err.Error())
	}

	// Never use more than 2^32 random nonces with a given key because of the risk of a repeat.
	nonce = make([]byte, 12)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		panic(err.Error())
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		panic(err.Error())
	}

	ciphertext := aesgcm.Seal(nil, nonce, []byte(*text), nil)
	return &ciphertext, nonce
}
