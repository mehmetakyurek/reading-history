import { contextBridge, ipcRenderer } from "electron"


const storage = {
    getItem: (key: string): Promise<string> => { return ipcRenderer.invoke("getItem"); },
    setItem: (key: string, data: string): Promise<void> => ipcRenderer.invoke("setItem", key, data),
    removeItem: (key: string): Promise<void> => ipcRenderer.invoke("removeItem")
}

const { invoke, send } = ipcRenderer;

const ContextBridgeApi = {
    createUser: (pwd?: string): Promise<{ err: boolean }> => invoke("createUser", pwd),
    login: (pwd?: string): Promise<boolean> => invoke("login", pwd),
    getDataPath: (): Promise<string> => invoke("getDataPath"),
    moveFile: (): Promise<string> => invoke("moveFile"),
    fileExists: () => invoke("fileExists"),
    isEncrypted: () => invoke("isEncrypted"),
    close: () => send("close"),
    minimize: () => send("minimize"),
    minmax: () => send("minmax"),
    restart: () => send("restart"),
    deleteData: () => invoke("deleteData"),
    storage,
};

export type IContextBridge = typeof ContextBridgeApi;
export const key = "electron";

contextBridge.exposeInMainWorld(key, ContextBridgeApi);