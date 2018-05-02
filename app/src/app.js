'use strict';

// index.js (main process)
// - GUI (renderer process)
// - GUI (renderer process)
// - GUI (renderer process)
// const moment = require('moment');
const electron = require('electron');
const cmd = require('node-cmd');
const { app, BrowserWindow, ipcMain } = electron;

// const { Observable, Subject, ReplaySubject, from, of, range, interval } = require('rxjs');
// const { map, filter, switchMap } = require('rxjs/operators');
// const { interval } = require('rxjs/observable/interval');
// const Rx = require('rxjs');

let mainWindow;

function createWindow () {
  // create window
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    // webPreferences: {
    //   nodeIntegration: false
    // }
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // macOSでは、ユーザが Cmd + Q で明示的に終了するまで、
  // アプリケーションとそのメニューバーは有効なままにするのが一般的。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // macOSでは、ユーザがドックアイコンをクリックしたとき、
  // そのアプリのウインドウが無かったら再作成するのが一般的。
  if (win === null) {
    createWindow()
  }
})


const getCommand = nic => {
  if (process.platform === 'linux') {
    return `netstat -I${nic}`
  } else if (process.platform === 'darwin') {
    return `netstat -I ${nic}`
  } else {
    throw 'Unsupported Platform'
  }
}

const parseCommandResult = stdout => {
  if (process.platform === 'linux') {
    const lines = stdout.split('\n');

    if (lines.length === 7) {
      // Possibly CentOS 7
      const lineRx = lines[3].split(/\s+/)
      const lineTx = lines[5].split(/\s+/)

      return {
        rx: parseInt(lineRx[2]),
        tx: parseInt(lineTx[2])
      }
    } else if (lines.length === 4) {
      // Possibly CentOS 6
      const result = stdout.split('\n')[2].split(/\s+/);
      return {
        rx: parseInt(result[3]),
        tx: parseInt(result[7])
      }
    } else {
      throw 'Unexpected Command Result'
    }
  } else if (process.platform === 'darwin') {
    const result = stdout.split('\n')[1].split(/\s+/);

    return {
      rx: parseInt(result[4]),
      tx: parseInt(result[6])
    }
  } else {
    throw 'Unsupported Platform'
  }
}

const settings = {
  interval: 1000,
  nic: 'en0'
}

const main = () => {
  cmd.get(
    getCommand(settings.nic),
    function(err, data, stderr) {
      const result = parseCommandResult(data);

      if (mainWindow) {
        mainWindow.webContents.send('packet_received', {
          timestamp: new Date(),
          rx: result.rx,
          tx: result.tx
        });
      }
    }
  );
  setTimeout(main, settings.interval);
}

main()
ipcMain.on('settings_changed', function(event, newSetting) {
  settings.interval = newSetting.interval;
  settings.nic = newSetting.nic;
});
