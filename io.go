package main

import (
	"crypto/rand"
	"fmt"
	"io"
	"os"
	"path"

	"github.com/matthewhartstonge/argon2"
)

var (
	pathFile = GetPathPath()
)

type File struct {
	encrypted bool
	path      string
	key       []byte
	data      dataFields
}

type encrypted struct {
	nonce []byte
	data  []byte
}

type dataFields struct {
	EncryptionKey encrypted
	Data          encrypted
	pwdHash       []byte
	plain         string
}

func (f *File) init() {
	f.path = GetDataPath()
	fmt.Println(f.path, path.Ext(f.path))
	if len(f.path) > 0 {
		f.encrypted = path.Ext(f.path) == ".rhdata"
		contents, err := os.ReadFile(f.path)
		if err != nil {
			fmt.Println(err.Error())
		}
		decoded, err := decodeData(contents)
		if err != nil {
			fmt.Println(err)
		}
		f.data = decoded
	}
}

func (f *File) exists() bool {
	return len(f.path) > 0
}

func (f *File) CreateUser(pwd string) (bool, error) {
	defaultPath := (GetDefaultDataPath(len(pwd) > 0))
	isEnc := len(pwd) > 0

	err := os.WriteFile(pathFile, []byte(defaultPath), 0666)
	if err != nil {
		return false, err
	}
	_, err = os.Create(defaultPath)
	if err != nil {
		return false, err
	}

	if isEnc {
		salt := make([]byte, argon.SaltLength)
		io.ReadFull(rand.Reader, salt)
		hash, err := GetHash(pwd, salt)
		if err != nil {
			return false, err
		}
		key := make([]byte, 32)

		io.ReadFull(rand.Reader, key)
		hashKey := hash.Hash
		if err != nil {
			return false, err
		}

		encryptedKey, nonce := Encrypt(hashKey, string(key))
		encryptedData, dataNonce := Encrypt(key, "{}")
		pwdHash, err := GetHash(string(hashKey), salt)
		if err != nil {
			return false, err
		}
		f.data = dataFields{
			pwdHash:       pwdHash.Encode(),
			EncryptionKey: encrypted{nonce, encryptedKey},
			Data:          encrypted{dataNonce, encryptedData},
		}

		f.key = key
	}
	f.path = defaultPath
	f.encrypted = len(pwd) > 0
	f.Write()
	return true, nil
}

func (f *File) Write() error {
	return os.WriteFile(f.path, encodeData(f.data), 0666)
}

func (f *File) Auth(pwd string) bool {
	if f.exists() {
		if !f.encrypted {
			f.data.plain = string(f.Read())
			return true
		}

		raw, err := argon2.Decode(f.data.pwdHash)
		if err != nil {
			return false
		}

		pwdHash, err := GetHash(pwd, raw.Salt)
		if err != nil {
			return false
		}
		match, err := argon2.VerifyEncoded(pwdHash.Hash, f.data.pwdHash)
		if !match || err != nil {
			return false
		}
		fmt.Println(match)
		f.key = ([]byte(Decrypt(pwdHash.Hash, f.data.EncryptionKey.data, f.data.EncryptionKey.nonce)))
		fmt.Println(f.key)
		return true
	}
	return false
}

func (f *File) Read() []byte {
	data, err := os.ReadFile(f.path)
	if err != nil {
		fmt.Println("Can't read data file")
	}
	return data
}

func (f * File) UpdateData(text string) bool {
	if f.encrypted {
	
	
	ctext, nonce := Encrypt(f.key, text)
	f.data.Data.data = ctext
	f.data.Data.nonce = nonce
	f.Write()
	return false
	} else {
		f.data.plain = text
		f.Write()
		return true
	}
}

func (f *File) UpdatePath(p string) bool {
	oldPath := f.path
	f.path = p
	err := f.Write()
	if err != nil {
		f.path = oldPath
		return false
	}
	err = os.WriteFile(GetPathPath(),[]byte(p), 0666)
	if(err != nil) {
		f.path = oldPath
		return false
	}
	return true
}

func (f *File) GetData() string {
	if f.encrypted {
		fmt.Println(f.data.Data.nonce)
		return Decrypt(f.key, f.data.Data.data, f.data.Data.nonce)
	} else {
		return f.data.plain
	}
}

func encodeData(fields dataFields) []byte {
	result := []byte{}
	if len(fields.pwdHash) > 0 {
		result = append(result, byte(len(fields.pwdHash)))
	}
	result = append(result, fields.pwdHash...)
	if len(fields.EncryptionKey.nonce)+len(fields.EncryptionKey.data) > 0 {
		result = append(result, uint8(len(fields.EncryptionKey.nonce)+len(fields.EncryptionKey.data)))
	}
	result = append(result, fields.EncryptionKey.nonce...)
	result = append(result, fields.EncryptionKey.data...)
	result = append(result, fields.Data.nonce...)
	result = append(result, fields.Data.data...)
	return result
}

type Error struct{ message string }

func (e Error) Error() string {
	return e.message
}

func decodeData(data []byte) (dataFields, error) {
	fmt.Println(data)
	if len(data) > 1 {
		fmt.Println(int(data[0]))
		decoder, err := NewDecoder(data)
		if err != nil {
			fmt.Println(err)
		}
		hashLength := decoder.getnBytes(1)
		df := dataFields{}
		df.pwdHash = decoder.getnBytes(int(hashLength[0]))

		keyLength := uint8(decoder.getnBytes(1)[0]) - 12
		df.EncryptionKey.nonce = decoder.getnBytes(12)
		df.EncryptionKey.data = decoder.getnBytes(int(keyLength))
		if len(data) > decoder.cursor+12 {
			df.Data.nonce = decoder.getnBytes(12)
			df.Data.data = decoder.getnBytes(-1)
		}
		return df, nil
	} else {
		return dataFields{}, Error{message: "Data length is too short"}
	}
}
