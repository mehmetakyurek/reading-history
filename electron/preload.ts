import { contextBridge } from "electron"
import  ContextBridgeApi  from "./ContextBridgeApi"

export type IContextBridge = typeof ContextBridgeApi;
export const key = "electron";

contextBridge.exposeInMainWorld(key, ContextBridgeApi);