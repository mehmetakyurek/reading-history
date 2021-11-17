import { BrowserWindow, app, ipcMain } from "electron"
import { Store } from "./store";

let window;
let store: Store;

Promise.all([app.whenReady(), Store.init()]).then((val) => {
    store = val[1];
    createWindow();
})

function createWindow() {
    window = new BrowserWindow({
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
    window.loadFile("../../build/index.html");
    window.webContents.on("did-finish-load", () => { setTimeout(() => window.show(), 200) })
    ipcMain.on("minimize", () => { window.minimize() });
    ipcMain.on("minmax", () => { window.isMaximized() ? window.unmaximize() : window.maximize() });
    ipcMain.on("restart", () => { app.relaunch(); app.exit(0); });
    ipcMain.handle("fileExists", () => store.fileExists())
    ipcMain.handle("isEncrypted", () => store.isEncrypted())
    ipcMain.handle("createUser", (_e, pwd) => store.createUser(pwd))
    ipcMain.handle("login", (_e, pwd) => store.login(pwd))
    ipcMain.handle("getItem", () => store.getItem())
    ipcMain.handle("setItem", (_e, _k, data) => store.setItem(data))
    ipcMain.handle("removeItem", () => store.removeItem())
}

ipcMain.on("close", () => { app.exit() });