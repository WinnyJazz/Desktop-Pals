// destructuring assignment.
const { app, BrowserWindow, Menu } = require('electron');

/* const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow; */

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 500,
        minHeight: 400,
        maxWidth: 800,
        maxHeight: 600
    });

    win.loadFile('src/welcome.html');

    win.webContents.on('before-input-event', (event, input) => {
        if (
            input.control &&
            input.shift &&
            input.key.toLowerCase() === 'i'
        ) {
            win.webContents.toggleDevTools();
        }
    });
}

app.whenReady().then(() => {
    // Menu.setApplicationMenu(null);
    createWindow();
});