package main

import (
	"fmt"
	"testing"
)

var nonce = []byte{1, 2, 3, 4, 5, 2, 7, 8, 9, 10, 11, 12}

var testData = []dataFields{{
	pwdHash: []byte("$argon2id$v=19$m=65536,t=3,p=4$1CYSy0RHWBeZeTAG3V4Ydg$T1VHxqM1wqaS7LhcFG2gnnJLDF+jq/Rs0RV+ezUwfrQ"),

	EncryptionKey: encrypted{
		nonce: nonce,
		data:  []byte("c562e9c950fdb9209ff502ab52c7a3d1153afd8b20eef7dea18884e2dba296c5ae34ca95ad29dc9b0ec0a609dfd758f0"),
	},
	Data: encrypted{
		nonce: nonce,
		data:  []byte("6yZaFIVSj251YANCnye06XYJZXrK0mPnltHNppFZmcJiVjCC9zJH8ZXyE3dM03IPIytq4bghU/6PvHTYs3FW9v1dTR+5SMjXtfYnocxukJLgCCNo9aPi8xQEEdScdtXmNDgEIVHzRBMINl8bjNeB+Kmqe8NpwkrZK3/Q1yRzM/eKjGp0mnAQVVt4EpXa+W4peaPv2DRQrYgRpE4TQRCXz4rJz8OC7I2QRPs3HmIey16c35jGx5NMqdgQWgle21FAZT+De4d7TQNDCwrFn/GWTsWHco/pOhUFVhUqt/69GeNXaKne9wvFiGzoLhNlrtWxrechASsSheyv9yjbFg+EWVg+ZKbTzHwIefcZUk4Xv67UJjFSbw4qMyKLQroEnZpLRahqe4SgrBtlTCBcY+CH8VLlErGL+nev1iuH"),
	},
}, {pwdHash: []byte("$argon2id$v=19$m=65536,t=3,p=4$1CYSy0RHWBeZeTAG3V4Ydg$T1VHxqM1wqaS7LhcFG2gnnJLDF+jq/Rs0RV+ezUwfrQ"),

	EncryptionKey: encrypted{
		nonce: nonce,
		data:  []byte("c562e9c950fdb9209ff502ab52c7a3d1153afd8b20eef7dea18884e2dba296c5ae34ca95ad29dc9b0ec0a609dfd758f0"),
	},
}}

func TestEncodeData(t *testing.T) {
	for _, tdata := range testData {
		encoded := encodeData(tdata)
		fmt.Println(len(encoded))
		decode, _ := decodeData(&encoded)

		if !tdata.Compare(decode) {
			t.Fail()
		}
	}

}

func compareByteSlice(b1 []byte, b2 []byte) bool {
	return (string(b1) == string(b2))
}

func (d dataFields) Compare(d2 dataFields) bool {
	return (compareByteSlice(d.pwdHash, d2.pwdHash) &&
		compareByteSlice(d.EncryptionKey.nonce, d2.EncryptionKey.nonce) &&
		compareByteSlice(d.EncryptionKey.data, d2.EncryptionKey.data) &&
		compareByteSlice(d.Data.nonce, d2.Data.nonce) &&
		compareByteSlice(d2.Data.data, d2.Data.data))

}
