const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

app.on('ready', () => {
  // Auto-launch app on login
  app.setLoginItemSettings({
    openAtLogin: true,
    path: process.execPath, // ensures correct executable path after install
  });
  });

let searchWin;

function createWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width: 300,
    height: 1000,
    x: width - 300,
    y: 5,
    resizable: true,
    frame: false,
    transparent: true,
    icon: path.join(__dirname, 'build', 'icon.ico'), // <-- add this
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL('http://localhost:5173/todo');
}

function searchWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  searchWin = new BrowserWindow({
    width: 450,
    height: 50,
    resizable: false,
    frame: false,
    transparent: true,
    icon: path.join(__dirname, 'build', 'icon.ico'), // <-- add this too
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  searchWin.center();
  searchWin.loadURL('http://localhost:5173/search');
}

app.whenReady().then(() => {
  createWindow();
  searchWindow();

  ipcMain.on('resize-window', (event, newHeight) => {
    if (searchWin) {
      let [w, h] = searchWin.getSize();
      searchWin.setSize(w, newHeight);
    }
  });
});



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
