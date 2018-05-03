'use strict';

// const moment = require('moment');
const electron = require('electron');
const cmd = require('node-cmd');
const os = require('os');
const { app, BrowserWindow, ipcMain } = electron;

const PLATFORM = {
  centos6: 'centos6',
  centos7: 'centos7',
  darwin: 'darwin'
}

let mainWindow;

function createWindow () {
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

const getPlatform = () => {
  if (process.platform === 'linux') {
    if (os.release().includes('el6')) {
      return PLATFORM.centos6
    } else if (os.release().includes('el7')) {
      return PLATFORM.centos7
    } else {
      throw 'Unsupported Platform'
    }
  } else if (process.platform === 'darwin') {
    return PLATFORM.darwin
  } else {
    throw 'Unsupported Platform'
  }
}

const getCommand = nic => {
  const platform = getPlatform()

  switch (platform) {
    case PLATFORM.centos6:
      return `netstat -I${nic}`;
    case PLATFORM.centos7:
      return `ip -s link show dev ${nic}`;
    case PLATFORM.darwin:
      return `netstat -I ${nic}`;
  }
}

const parseCommandResult = stdout => {
  const platform = getPlatform()

  switch (platform) {
    case PLATFORM.centos6:
    {
      const result = stdout.split('\n')[2].split(/\s+/);
      return {
        rx: parseInt(result[3]),
        tx: parseInt(result[7])
      }
    }
    case PLATFORM.centos7:
    {
      const lines = stdout.split('\n');
      const lineRx = lines[3].split(/\s+/)
      const lineTx = lines[5].split(/\s+/)

      return {
        rx: parseInt(lineRx[2]),
        tx: parseInt(lineTx[2])
      }
    }
    case PLATFORM.darwin:
    {
      const result = stdout.split('\n')[1].split(/\s+/);

      return {
        rx: parseInt(result[4]),
        tx: parseInt(result[6])
      }
    }
  }
}

const settings = {
  interval: 1000,
  nic: 'en0'
}

ipcMain.on('settings_changed', function(event, newSetting) {
  settings.interval = newSetting.interval;
  settings.nic = newSetting.nic;
});

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
