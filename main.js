const { app, BrowserWindow } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

let server;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

function startServer() {
    return new Promise((resolve, reject) => {
        server = http.createServer((request, response) => {
            let filePath = decodeURIComponent(request.url.split('?')[0]);

            if (filePath === '/') {
                filePath = '/src/welcome.html';
            }

            const relativePath = filePath.replace(/^[/\\]+/, '');
            const fullPath = path.join(app.getAppPath(), relativePath);

            fs.readFile(fullPath, (error, data) => {
                if (error) {
                    response.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });

                    response.end('404 - File Not Found');
                    return;
                }

                const extension = path.extname(fullPath).toLowerCase();
                const contentType = mimeTypes[extension] || 'application/octet-stream';

                response.writeHead(200, {
                    'Content-Type': contentType
                });

                response.end(data);
            });
        });

        server.listen(0, '127.0.0.1', () => {
            const port = server.address().port;

            console.log(`Local server berjalan di http://127.0.0.1:${port}`);

            resolve(port);
        });

        server.on('error', reject);
    });
}

async function createWindow() {
    const port = await startServer();

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 500,
        minHeight: 400,
        maxWidth: 800,
        maxHeight: 600
    });

    win.loadURL(`http://127.0.0.1:${port}/src/welcome.html`);

    win.webContents.on('before-input-event', (event, input) => {
        if (
            input.control &&
            input.shift &&
            input.key.toLowerCase() === 'i'
        ) {
            win.webContents.toggleDevTools();
        }
    });

    win.on('closed', () => {
        if (server) {
            server.close();
            server = null;
        }
    });
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (server) {
        server.close();
        server = null;
    }

    if (process.platform !== 'darwin') {
        app.quit();
    }
});