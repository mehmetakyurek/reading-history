import { BrowserWindow, app, ipcMain, globalShortcut, session } from "electron"
import { Store } from "./store";
import { homedir } from "os"
let window: BrowserWindow;
let store: Store;

Promise.all([app.whenReady(), Store.init()]).then((val) => {
    store = val[1];
    createWindow();
    globalShortcut.register('CommandOrControl+R', () => { })
    if (!app.isPackaged) session.defaultSession.loadExtension(homedir() + "\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\4.24.0_0")
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
    if (app.isPackaged) window.loadFile("../../build/index.html");
    else window.loadURL("http://localhost:3000");

    window.webContents.on("did-finish-load", () => window.show())
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