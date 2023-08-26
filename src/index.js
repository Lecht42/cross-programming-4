const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');
const path = require('path');
const { dialog } = require('electron');

if (require('electron-squirrel-startup')) {
  app.quit();
}

ipcMain.handle('get-sources', async () => {
  const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
  return sources;
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, 
      contextIsolation: true, 
      preload: path.join(__dirname, 'preload.js') 
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.openDevTools();
};


app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('show-open-dialog', async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Videos', extensions: ['mkv', 'avi', 'mp4', 'webm'] }
      ]
    });
    return filePaths;
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('show-open-dialog', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Videos', extensions: ['mkv', 'avi', 'mp4', 'webm'] }
    ]
  });
  return filePaths;
});
