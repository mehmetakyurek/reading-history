import { ipcRenderer } from "electron"

export default {
    close: () => ipcRenderer.send("close"),
    minimize: () => ipcRenderer.send("minimize"),
    minmax: () => ipcRenderer.send("minmax"),
    restart: () => ipcRenderer.send("restart")
};