package main

import (
	"context"
	"fmt"
	"path"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

var data *File

func init() {
	data = &File{}
	data.init()
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) CreateUser(pwd string) bool {
	sucess, err := data.CreateUser(pwd)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	return sucess
}

func (a *App) Login(pwd string) bool {
	return data.Auth(pwd)
}

func (a *App) GetDataPath() string {
	return data.path
}

func (a *App) MoveFile() string {
	
	newPath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		DefaultDirectory:     path.Dir(GetDefaultDataPath(data.encrypted)),
		DefaultFilename:      "rh" + path.Ext(GetDefaultDataPath(data.encrypted)),
		Title:                "New File Location",
		CanCreateDirectories: true,
	})
	if err != nil {
		fmt.Println(err.Error())
		return ""
	}
	if data.UpdatePath(newPath) {
		return newPath
	} else {
	return data.path
	}

}

func (a *App) FileExists() bool {
	return data.exists()
}

func (a *App) IsEncrypted() bool {
	fmt.Println(data.encrypted)
	return data.encrypted
}

func (a *App) SetItem(key string, text string) bool {
	return data.UpdateData(text)
}

func (a *App) RemoveItem(id string) bool {
	return false
}

func (a *App) GetItem(id string) string {
	return data.GetData()
}
