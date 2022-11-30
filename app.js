const {app, nativeImage, BrowserWindow, ipcMain, globalShortcut} = require('electron');
try {
    const {autoUpdater} = require('electron-updater');
    const contextMenu = require('electron-context-menu');
    const path = require('path');
    const url = require('url');

    let pluginName;
    let mainWindow;

    const DiscordRPC = require('discord-rpc');
    const DiscordUpdate = require(path.join(process.resourcesPath, './discord/discord.js'));
    const clientId = '798873369315377163';
    DiscordRPC.register(clientId);
    let rpc = null;

    contextMenu({
        prepend: (defaultActions, parameters, browserWindow) => [
            {
                label: 'Recharger la page',
                visible: true,
                icon: path.join(__dirname, `/assets/images/reload.png`),
                click: () => sendWindow('reload', '')
            },
            {
                label: 'Rejoindre CityCom',
                visible: true,
                icon: path.join(__dirname, `/assets/images/discord.png`),
                click: () => require('electron').shell.openExternal('https://discord.com/invite/citycom')
            },
            {
                label: 'Plein écran',
                visible: true,
                icon: path.join(__dirname, `/assets/images/screen.png`),
                click: () => mainWindow.isFullScreen() ? mainWindow.setFullScreen(false) : mainWindow.setFullScreen(true)
            },
            {
                type: 'separator',
                visible: parameters.mediaType === 'image',
            },
            {
                label: 'Ouvrir l\'image dans un nouvel onglet (Navigateur par défaut)',
                visible: parameters.mediaType === 'image',
                click: () => require('electron').shell.openExternal(`${parameters.srcURL}`)
            }
        ],
        labels: {
            copy: 'Copier',
            paste: 'Coller',
            cut: 'Couper',
            searchWithGoogle: 'Rechercher "{selection}" avec Google',
            learnSpelling: 'Enregistrer "{selection}" dans le dictionnaire',
            saveImageAs: 'Enregistrer l\'image sous',
            copyImage: 'Copier l\'image',
            copyImageAddress: 'Copier l\'adresse de l\'image',
            copyLink: 'Copier l\'adresse du lien'
        },
        showCopyImageAddress: true,
        showSaveImageAs: true
    });

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
                preload: path.join(__dirname, './preload.js'),
                spellcheck: true
            },
            show: false,
            frame: true,
            backgroundColor: "#9569f3"
        });

        mainWindow.maximize();
        mainWindow.show();
        mainWindow.setMenu(null);
        mainWindow.on('closed', () => mainWindow = null);

        mainWindow.webContents.openDevTools();

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
            mainWindow.isFullScreen() ? mainWindow.setFullScreen(false) : mainWindow.setFullScreen(true);
        });
        ipcMain.on('zoomOut', () => {
            let factor = mainWindow.webContents.getZoomFactor();
            if (factor > 0.3) mainWindow.webContents.setZoomFactor(factor - 0.01);
        });
        ipcMain.on('zoomIn', () => {
            let factor = mainWindow.webContents.getZoomFactor();
            if (factor < 3) mainWindow.webContents.setZoomFactor(factor + 0.01);
        });
        ipcMain.on('zoomReset', () => mainWindow.webContents.setZoomFactor(1));
        ipcMain.on('flashFrame', () => {
            mainWindow.isFocused() ? mainWindow.flashFrame(false) : mainWindow.flashFrame(true);
        });
        ipcMain.on('notifIcon', (event, data) => {
            let badge;
            mainWindow.setOverlayIcon(null, '');
            if (parseInt(data) < 10) {
                badge = path.join(__dirname, `/assets/images/badges/badge-${data}.ico`);
                if(parseInt(data) === 0) badge = null;
            } else {
                badge = path.join(__dirname, `/assets/images/badges/badge-10.ico`);
            }
            mainWindow.setOverlayIcon(badge, `${data} notification(s)`);
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
            e.preventDefault();
            if (checkUrl !== 'habbocity' && url !== 'https://funados-radio.fr/dedicace/' || url === 'https://www.habbocity.me/discord') {
                if (url === 'https://www.habbocity.me/discord') url = 'https://discord.com/invite/citycom';
                require('electron').shell.openExternal(url);
            } else {
                const child = new BrowserWindow({ parent: mainWindow, show: false });
                child.setMenu(null);
                child.loadURL(url);
                child.once('ready-to-show', () => {
                    child.show();
                });
            }
        });

        let startRpc = false;
        let startTimestamp;
        let detailsRpc = null;
        let stateRpc = null;
        ipcMain.on('toggleRpc', () => {
            if (startRpc === false) {
                startRpc = true;
                startTimestamp = Date.now();
                rpc = new DiscordRPC.Client({
                    transport: 'ipc'
                });
                rpc.on('ready', () => {
                    rpc.request('SET_ACTIVITY', {
                        pid: process.pid,
                        activity: {
                            details: detailsRpc,
                            state: stateRpc,
                            timestamps: {
                                start: startTimestamp
                            },
                            assets: {
                                large_image: 'hclogo',
                                small_image: 'littleicon',
                                small_text: app.getVersion()
                            },
                            buttons: [
                                {
                                    label: 'Aller sur HabboCity',
                                    url: 'https://www.habbocity.me'
                                },
                                {
                                    label: 'Rejoindre CityCom',
                                    url: 'https://discord.com/invite/citycom'
                                }
                            ]
                        }
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
                detailsRpc = DiscordUpdate.rpcUpdate(data, app.getVersion())[0];
                stateRpc = DiscordUpdate.rpcUpdate(data, app.getVersion())[1];
                let btnLabel = DiscordUpdate.rpcUpdate(data, app.getVersion())[2];
                let btnUrl = DiscordUpdate.rpcUpdate(data, app.getVersion())[3];
                rpc.request('SET_ACTIVITY', {
                    pid: process.pid,
                    activity: {
                        details: detailsRpc,
                        state: stateRpc,
                        timestamps: {
                            start: startTimestamp
                        },
                        assets: {
                            large_image: 'hclogo',
                            small_image: 'littleicon',
                            small_text: app.getVersion()
                        },
                        buttons: [
                            {
                                label: btnLabel,
                                url: btnUrl
                            },
                            {
                                label: 'Rejoindre CityCom',
                                url: 'https://discord.com/invite/citycom'
                            }
                        ]
                    }
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
        clearInterval(checkForUpdate);
        mainWindow.removeAllListeners('close');
        mainWindow.close();
    });
    app.on('ready', async () => {
        globalShortcut.register('CommandOrControl+Alt+D', () => sendWindow('shortcutDiscord', ''));
        await createWindow();
        await autoUpdater.checkForUpdatesAndNotify();
    });
    app.on('activate', async () => {
        if (mainWindow === null) await createWindow();
    });

    autoUpdater.on('checking-for-update', () => {
        if (appStart === false) sendWindow('checking-for-update', '');
    });
    autoUpdater.on('update-available', () => {
        appStart === false ? sendWindow('update-available', '') : clearInterval(checkForUpdate);
    });
    autoUpdater.on('update-not-available', () => {
        if(appStart === false) {
            sendWindow('update-not-available', '');
            sendWindow('checkDiscordItem', '');
            appStart = true;
            checkForUpdate = setInterval(async () => await autoUpdater.checkForUpdatesAndNotify(), 3e5);
        }
    });
    autoUpdater.on('error', (err) => sendWindow('error', 'Error: ' + err));
    autoUpdater.on('download-progress', (d) => {
        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
        
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        
            const i = Math.floor(Math.log(bytes) / Math.log(k));
        
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
        mainWindow.setProgressBar(0);
        sendWindow('download-progress', {
            speed: formatBytes(d.bytesPerSecond),
            percent: d.percent,
            transferred: formatBytes(d.transferred),
            total: formatBytes(d.total),
            inBack: appStart
        });
        mainWindow.setProgressBar(d.percent / 100);
    });
    autoUpdater.on('update-downloaded', () => {
        if (appStart === false) {
            sendWindow('update-downloaded', 'Update downloaded');
            autoUpdater.quitAndInstall();
        } else if (appStart === true) {
            clearInterval(checkForUpdate);
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
