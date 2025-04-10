const { app, BrowserWindow, globalShortcut, shell } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 500,
        height: 700,
        show: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.setMenu(null);
    win.maximize();
    win.show();

    win.loadFile('src/auth.html');

    // Горячие клавиши
    globalShortcut.register('F12', () => {
        win.webContents.toggleDevTools();
    });

    globalShortcut.register('Ctrl+Shift+I', () => {
        win.webContents.toggleDevTools();
    });

    win.on('closed', () => {
        globalShortcut.unregister('F12');
        globalShortcut.unregister('Ctrl+Shift+I');
    });

    // Открытие внешних ссылок в браузере
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    win.webContents.on('will-navigate', (event, url) => {
        const isExternal = !url.startsWith('file://');
        if (isExternal) {
            event.preventDefault();
            shell.openExternal(url);
        }
    });
};

app.whenReady().then(() => createWindow());

app.on('window-all-closed', () => {
    globalShortcut.unregisterAll();
    app.quit();
});
