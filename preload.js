const { contextBridge,  ipcRenderer } = require('electron')
const Toastify = require('toastify-js');

contextBridge.exposeInMainWorld('axios', {
    openAI: (messageValue) => ipcRenderer.invoke('axios.openAI', messageValue),
    supaBase: (method, id, data) => ipcRenderer.invoke('axios.supaBase', method, id, data)
})

contextBridge.exposeInMainWorld('Toastify', {
    showToast: (options) => Toastify(options).showToast()
})