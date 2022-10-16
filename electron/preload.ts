import { contextBridge, ipcRenderer } from "electron"


const storage = {
    getItem: (key: string): Promise<string> => { return ipcRenderer.invoke("getItem"); },
    setItem: (key: string, data: string): Promise<void> => ipcRenderer.invoke("setItem", key, data),
    removeItem: (key: string): Promise<void> => ipcRenderer.invoke("removeItem")
}
const ContextBridgeApi = {
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

export type IContextBridge = typeof ContextBridgeApi;
export const key = "electron";

contextBridge.exposeInMainWorld(key, ContextBridgeApi);