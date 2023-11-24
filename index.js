const { app, BrowserWindow, Menu, BrowserView, ipcMain, screen, ipcRenderer } = require('electron');

let mainWindow;

let view;

function createWindow() {
    // Erstelle das Hauptfenster
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
        },
    });

    view = new BrowserView()
    mainWindow.setBrowserView(view)
    view.setBounds({ x: 200, y: 0, width: 300, height: 300 })
    view.webContents.loadURL('https://electronjs.org')


    // Lade eine Internetseite (z.B. google.de) im Hauptfenster
    mainWindow.loadFile('index.html');

    // Handle IPC communication from renderer process
    ipcMain.on('image-clicked', (event, arg) => {
        console.log('Image clicked in main process!');
        view.webContents.loadURL('https://google.de')
    });






    // Erstelle ein Menü
    const template = [
        {
            label: 'Datei',
            submenu: [
                {
                    label: 'Beenden',
                    role: 'quit',
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // Öffne die Entwicklertools (optional)
    mainWindow.webContents.openDevTools();

    // Reagiere auf das Schließen des Hauptfensters
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});


