package main

import (
	"log"
	"os"
	"path"
)

func GetPathPath() string {
	cfg, err := os.UserConfigDir()
	if err != nil {
		log.Fatal(err)
		return ""
	}
	return path.Join(cfg, ".rhpath")
}
func GetDataPath() string {
	p, err := os.ReadFile(pathFile)
	if err != nil {
		return ""
	}
	return string(p)
}

func GetDefaultDataPath(encrypted bool) string {
	dp, err := os.UserHomeDir()
	if err != nil {
		log.Fatal(err)
		return ""
	}
	ext := ""
	if encrypted {
		ext = ".rhdata"
	} else {
		ext = ".json"
	}
	return path.Join(dp, "rh"+ext)
}
