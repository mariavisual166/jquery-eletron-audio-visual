const electron = require('electron')
const path = require('path')
const url = require('url')
const url2 = require('url')

// Module to control application life. (this variable should already exist)
const app = electron.app

// this should be placed at top of main.js to handle setup events quickly


const { BrowserWindow, ipcMain} = electron
// Creacion de objetos

if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

 

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    frame: true,
    resizable: true,
    backgroundColor: '#2e2c29',
    opacity: 1,
    frame:true
    
  });

  mainWindow.loadURL(
    url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
    })
    
  )
  
  mainWindow.once('ready-to-show', () =>{
    mainWindow.show()
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
  
  
}

ipcMain.on('fullscreen', () => {
	if (mainWindow.isFullScreen())
		mainWindow.setFullScreen(false)
	else
		mainWindow.setFullScreen(true)
})

ipcMain.on('minimizar', () => { 
	mainWindow.minimize() 
})

ipcMain.on('cerrar', () => {
	mainWindow.close()
})



app.on('ready', function (){
   
    createWindow()

})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }

})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }
    const ChildProcess = require('child_process');
    const path = require('path');
    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus
            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);
            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers
            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};


/*
var autoUpdaterInit = function(mainWindow) {
  const platform = os.platform() + '_' + os.arch();
  autoUpdater.setFeedURL('http://127.0.0.1:5000/update/' + platform)
  autoUpdater.checkForUpdates();
}*/
