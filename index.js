const {app, BrowserWindow, Menu, BrowserView, ipcMain, screen, ipcRenderer} = require('electron');
const path = require('path');


let mainWindow;

let view;
let view2;
let views = [];

function createWindow() {
    // Erstelle das Hauptfenster
    const {width, height} = screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            webviewTag: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                }
            }
        },
    });


    view = new BrowserView({
        webPreferences: {
            //preload: path.join(__dirname, 'preload.js')
        }
    });

    //mainWindow.setBrowserView(view)
    view.setBounds({x: 200, y: 0, width: width-200, height: height})
    view.webContents.loadURL('http://localhost:8080/')

    views.one = view;

    view2 = new BrowserView({
        webPreferences: {
            //preload: path.join(__dirname, 'preload.js')
        }
    });

    //mainWindow.setBrowserView(view2)
    view2.setBounds({x: 200, y: 0, width: width-200, height: height})
    view2.webContents.loadURL('http://localhost:7860/?__theme=dark')

    views.two = view2



    // Lade eine Internetseite (z.B. google.de) im Hauptfenster
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Handle IPC communication from renderer process
    ipcMain.on('open-new-url', (event, dataReceived) => {
        console.log('Link clicked in main process!');
        switch (dataReceived.module) {
            case "lumidora-tts":
                //view.webContents.loadURL('http://localhost:8080/'); // Replace with the desired URL
                mainWindow.setBrowserView(views.one)
                break;
            case "lumidora-sd-webui":
                //view.webContents.loadURL('http://localhost:7860/?__theme=dark'); // Replace with the desired URL
                mainWindow.setBrowserView(views.two)
                break;
        }
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


