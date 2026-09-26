// destructuring assignment.
const { app, BrowserWindow, Menu } = require('electron');

/* const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow; */

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    });

    win.loadFile('src/welcome.html');
}

app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    createWindow();
});