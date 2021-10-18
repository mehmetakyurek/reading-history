import electron from "electron"

import { IContextBridge, key } from "../electron/preload"

declare global {
    interface Window {
        [key]: IContextBridge
    }
}