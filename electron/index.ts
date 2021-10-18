import { BrowserWindow, app, ipcMain } from "electron"


app.whenReady().then(() => {
    const window = new BrowserWindow({
        frame: false,
        show: false,
        width: 1370,
        height: 880,
        webPreferences: {
            contextIsolation: true,
            preload: __dirname + "/preload.js"
        }
    });
    window.setMenuBarVisibility(false);
    window.loadURL("http://localhost:3000");
    window.webContents.on("did-finish-load", () => { setTimeout(() => window.show(), 200) })
    ipcMain.on("minimize", () => { window.minimize() });
    ipcMain.on("minmax", () => { window.isMaximized() ? window.unmaximize() : window.maximize() });
    ipcMain.on("restart", () => { app.relaunch(); app.exit(0); })
})

ipcMain.on("close", () => { app.exit() });