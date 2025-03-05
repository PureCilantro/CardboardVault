import { app, BrowserWindow } from 'electron'

import BackendAPI from '../api/main.js'
let dbApi = new BackendAPI();

async function startDbApi() {
  try {
    await dbApi.start();
    console.log("Backend server started successfully in main process");
  } catch (error) {
    console.error("Failed to start backend server:", error);
    app.quit();
  }
}

startDbApi();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 800,
    icon: './app/icons/cardboardVault.png',
    webPreferences: {
      devTools: true,
    }
  })
  win.loadFile('./app/page/index.html')
  win.removeMenu()
  win.setResizable(false)

  win.webContents.openDevTools() //Dev
}

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(true);
});

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  console.log("Closing DB");
  dbApi.stop();
})