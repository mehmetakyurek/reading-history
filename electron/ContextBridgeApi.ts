import { ipcRenderer } from "electron"

const storage = {
    getItem: (key: string): Promise<string> => { return ipcRenderer.invoke("getItem"); },
    setItem: (key: string, data: string): Promise<void> => ipcRenderer.invoke("setItem", key, data),
    removeItem: (key: string): Promise<void> => ipcRenderer.invoke("removeItem")
}
export default {
    createUser: (pwd?: string): Promise<{ err: boolean }> => ipcRenderer.invoke("createUser", pwd),
    login: (pwd?: string): Promise<boolean> => ipcRenderer.invoke("login", pwd),
    fileExists: () => ipcRenderer.invoke("fileExists"),
    isEncrypted: () => ipcRenderer.invoke("isEncrypted"),
    close: () => ipcRenderer.send("close"),
    minimize: () => ipcRenderer.send("minimize"),
    minmax: () => ipcRenderer.send("minmax"),
    restart: () => ipcRenderer.send("restart"),
    deleteData: () => ipcRenderer.invoke("deleteData"),
    storage,
};