const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSources: async () => {
    return await ipcRenderer.invoke('get-sources');
  },
  showOpenDialog: async () => {
    return await ipcRenderer.invoke('show-open-dialog');
  }
});
