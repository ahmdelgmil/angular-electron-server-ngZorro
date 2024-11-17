const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function startServer() {
    const serverPath = path.join(__dirname, 'server', 'server.js');
    serverProcess = spawn('node', [serverPath], {
        stdio: 'inherit'
    });
    
    
    serverProcess.on('close', (code) => {
        console.log(`Server process exited with code ${code}`);
    });
}

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    if (process.env.ELECTRON_DEV) {
        // في وضع التطوير، نحمل من localhost
        await mainWindow.loadURL('http://localhost:4200');
        mainWindow.webContents.openDevTools();
    } else {
        // في وضع الإنتاج، نحمل من مجلد dist
        const indexPath = path.join(__dirname, 'dist', 'firebase-manager-app' , 'browser', 'index.html');
        await mainWindow.loadFile(indexPath);
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    startServer();
    createWindow();

    app.on('activate', () => {
        if (mainWindow === null) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('quit', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
});