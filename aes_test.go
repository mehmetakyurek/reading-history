package main

import (
	"testing"

	"github.com/matthewhartstonge/argon2"
)

var key = []byte("00000000000000000000000000000000") //32
var text = "Ehe"

func TestEncrypt(t *testing.T) {
	ctext, nonce := Encrypt(key, text)
	if Decrypt(key, ctext, nonce) != text {
		t.FailNow()
	}

}

var salt = []byte("0000000000000000")
var pwd = "password"

func TestHash(t *testing.T) {
	pwdHash, err := GetHash(pwd, salt)
	if err != nil {
		t.FailNow()
	}
	ctext, nonce := Encrypt(pwdHash.Hash, string(key))
	pwdHash2, err := GetHash(string(pwdHash.Hash), pwdHash.Salt)
	if err != nil {
		t.FailNow()
	}
	plainKey := Decrypt(pwdHash.Hash, ctext, nonce)
	match, err := argon2.VerifyEncoded(pwdHash.Hash, pwdHash2.Encode())
	if err != nil || !match {
		t.Fail()
	}
	if plainKey != string(key) {
		t.Fail()
	}
}
