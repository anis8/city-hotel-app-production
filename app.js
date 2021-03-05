const {app, nativeImage, BrowserWindow, ipcMain} = require('electron');
try {
    const {autoUpdater} = require("electron-updater");

    const path = require('path');
    const url = require('url');

    const DiscordRPC = require('discord-rpc');
    const DiscordUpdate = require(path.join(process.resourcesPath, './discord/discord.js'));

    let pluginName;
    let mainWindow;
    let rpc = null;

    switch (process.platform) {
        case 'win32':
            if (process.arch === "x32" || process.arch === "ia32") {
                pluginName = 'win/pepflashplayer-32.dll';
            } else {
                pluginName = 'win/pepflashplayer.dll';
            }
            break;
        case 'darwin':
            pluginName = 'mac/PepperFlashPlayer.plugin';
            break;
        case "linux":
            if (process.arch === "arm") {
                pluginName = 'lin/libpepflashplayer_arm.so';
            } else {
                pluginName = 'lin/libpepflashplayer_amd.so';
            }
            break;
        case "freebsd":
        case "netbsd":
        case "openbsd":
            pluginName = 'libpepflashplayer.so';
            break;
    }
    //app.commandLine.appendSwitch("disable-renderer-backgrounding");
    if (process.platform !== "darwin") {
        app.commandLine.appendSwitch('high-dpi-support', "1");
        app.commandLine.appendSwitch('force-device-scale-factor', "1");
    }
    app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname.includes(".asar") ? process.resourcesPath : __dirname, "flash/" + pluginName));
    //app.disableHardwareAcceleration();
    app.commandLine.appendSwitch('disable-site-isolation-trials');
    //app.commandLine.appendSwitch('no-sandbox');


    let sendWindow = (identifier, message) => {
        mainWindow.send(identifier, message);
    };
    let createWindow = async () => {

        mainWindow = new BrowserWindow({
            title: "HabboCity",
            icon: path.join(__dirname, '/icon.png'),
            webPreferences: {
                plugins: true,
                nodeIntegration: false,
                contextIsolation: false,
                webSecurity: false,
                preload: path.join(__dirname, './preload.js')
            },
            show: false,
            frame: true,
            backgroundColor: "#000",
        });

        mainWindow.maximize();
        mainWindow.show();
        mainWindow.setMenu(null);
        mainWindow.on('closed', () => {
            mainWindow = null;
        });

        ///mainWindow.webContents.openDevTools();

        await mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, `app.html`),
            protocol: 'file:',
            slashes: true
        }));

        sendWindow("version", app.getVersion());
        ipcMain.on('clearcache', async () => {
            let session = mainWindow.webContents.session;
            await session.clearCache();
            app.relaunch();
            app.exit();
        });
        ipcMain.on('fullscreen', () => {
            if (mainWindow.isFullScreen())
                mainWindow.setFullScreen(false);
            else
                mainWindow.setFullScreen(true);
        });
        ipcMain.on('zoomOut', () => {
            let factor = mainWindow.webContents.getZoomFactor();
            if (factor > 0.3) {
                mainWindow.webContents.setZoomFactor(factor - 0.01);
            }
        });
        ipcMain.on('zoomIn', () => {
            let factor = mainWindow.webContents.getZoomFactor();
            if (factor < 3) {
                mainWindow.webContents.setZoomFactor(factor + 0.01);
            }
        });

        if (process.platform === "darwin") {
            app.dock.setIcon(nativeImage.createFromPath(
                path.join(__dirname, '/icon.png')
            ));
        }

        mainWindow.webContents.on('new-window', (e, url) => {
            const splitUrl = url.replace('https://', '').split('.');
            let checkUrl = splitUrl[0];
            if (url.replace('https://', '').startsWith('www.') || url.replace('https://', '').startsWith('swf.')) checkUrl = splitUrl[1];

            if (checkUrl !== 'habbocity' || url === 'https://www.habbocity.me/discord') {
                e.preventDefault();
                if(url === 'https://www.habbocity.me/discord') url = 'https://discord.com/invite/CityFamily';
                require('electron').shell.openExternal(url);
            }
        });

        const clientId = '798873369315377163';
        let startRpc = false;
        let startTimestamp;
        let details = null;
        let state = null;

        ipcMain.on('toggleRpc', () => {
            if (startRpc === false) {
                startRpc = true;
                startTimestamp = new Date();
                rpc = new DiscordRPC.Client({
                    transport: 'ipc'
                });
                rpc.on('ready', () => {
                    rpc.setActivity({
                        details,
                        state,
                        largeImageKey: 'hclogo',
                        smallImageKey: 'littleicon',
                        smallImageText: app.getVersion(),
                        instance: false,
                        startTimestamp
                    });
                });
                rpc.login({clientId});
            } else if (startRpc === true) {
                startRpc = false;
                startTimestamp = null;
                rpc.clearActivity();
                rpc.destroy();
                rpc = null;
            }
        });

        ipcMain.on('updateRpc', (event, data) => {
            if (startRpc === true) {
                details = DiscordUpdate.rpcUpdate(data, app.getVersion())[0];
                state = DiscordUpdate.rpcUpdate(data, app.getVersion())[1];
                rpc.setActivity({
                    details,
                    state,
                    largeImageKey: 'hclogo',
                    smallImageKey: 'littleicon',
                    smallImageText: app.getVersion(),
                    instance: false,
                    startTimestamp
                });
            }
        });
    }

    let appStart = false;
    let checkForUpdate = null;

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            ipcMain.removeAllListeners();
            app.exit(0);
            app.quit();
        }
    });

    app.on('before-quit', () => {
        if (rpc !== null) {
            rpc.clearActivity();
            rpc.destroy();
            rpc = null;
        }
        if (checkForUpdate !== null) clearInterval(checkForUpdate);
        mainWindow.removeAllListeners('close');
        mainWindow.close();
    });

    app.on('ready', async () => {
        await createWindow();
        await autoUpdater.checkForUpdatesAndNotify();
    });
    app.on('activate', async () => {
        if (mainWindow === null) {
            await createWindow();
        }
    });

    autoUpdater.on('checking-for-update', () => {
        if (appStart === false) sendWindow('checking-for-update', path.join(process.resourcesPath, './discord/iframeData.js'));
    });
    autoUpdater.on('update-available', () => {
        if (appStart === false) {
            sendWindow('update-available', '');
        } else if (appStart === true) {
            clearInterval(checkForUpdate);
        }
    });
    autoUpdater.on('update-not-available', () => {
        sendWindow('update-not-available', '');
        appStart = true;
        checkForUpdate = setInterval(async () => {
            await autoUpdater.checkForUpdates();
        }, 900000);
    });
    autoUpdater.on('error', (err) => {
        sendWindow('error', 'Error: ' + err);
    });
    autoUpdater.on('download-progress', (d) => {
        sendWindow('download-progress', {
            speed: d.bytesPerSecond,
            percent: d.percent,
            transferred: d.transferred,
            total: d.total,
            inBack: appStart
        });
        mainWindow.setProgressBar(d.percent / 100);
    });
    autoUpdater.on('update-downloaded', () => {
        if (appStart === false) {
            sendWindow('update-downloaded', 'Update downloaded');
            autoUpdater.quitAndInstall();
        } else if (appStart === true) {
            sendWindow('askForUpdate', '');
            ipcMain.on('responseForUpdate', (e, response) => {
                if (response === true) autoUpdater.quitAndInstall();
            });
        }
    });
} catch (e) {
    app.exit(0);
    app.quit();
}
