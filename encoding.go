package main

import (
	"errors"
	"fmt"
)

type decoder struct {
	cursor int
	data   []byte
}

func (d *decoder) getnBytes(n int) *[]byte {

	if n > 0 && len(d.data) >= d.cursor+n {
		returnVal := d.data[d.cursor : d.cursor+n]
		d.cursor += n
		return &returnVal
	}
	returnVal := d.data[d.cursor:]
	return &returnVal
}

func NewDecoder(data []byte) (decoder, error) {
	fmt.Println(len(data) < 1, int(data[0]) > len(data))
	if len(data) > 0 || len(data) > int(data[0]) {
		return decoder{
			cursor: 0,
			data:   data,
		}, nil
	} else {
		fmt.Println(len(data))
		return decoder{}, errors.New("Data length is too short")
	}
}
