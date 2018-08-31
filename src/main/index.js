'use strict';

// const moment = require('moment');
const electron = require('electron');
const cmd = require('node-cmd');
const os = require('os');
const NanoTimer = require('nanotimer');
const { app, BrowserWindow, ipcMain } = electron;
import configureStore from '../shared/store/configureStore';
import { appendTime } from '../shared/actions/settings';
import { packetCount } from '../shared/actions/packets';

const PLATFORM = {
  centos6: 'centos6',
  centos7: 'centos7',
  darwin: 'darwin'
}

// TODO: mainプロセスはWebpackに扱われず単にコピーされるだけなので、export NODE_ENV=production とないと反映されない！！！！！
const isDevelopment = process.env.NODE_ENV !== 'production'

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

  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  }

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
  if (mainWindow === null) {
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

// const getCommand = nic => {
//   const platform = getPlatform()
//
//   switch (platform) {
//     case PLATFORM.centos6:
//       return `netstat -I${nic}`;
//     case PLATFORM.centos7:
//       return `ip -s link show dev ${nic}`;
//     case PLATFORM.darwin:
//       return `netstat -I ${nic}`;
//   }
// }
//
// const parseCommandResult = stdout => {
//   const platform = getPlatform()
//
//   switch (platform) {
//     case PLATFORM.centos6:
//     {
//       const result = stdout.split('\n')[2].split(/\s+/);
//       return {
//         rx: parseInt(result[3]),
//         tx: parseInt(result[7])
//       }
//     }
//     case PLATFORM.centos7:
//     {
//       const lines = stdout.split('\n');
//       const lineRx = lines[3].split(/\s+/)
//       const lineTx = lines[5].split(/\s+/)
//
//       return {
//         rx: parseInt(lineRx[2]),
//         tx: parseInt(lineTx[2])
//       }
//     }
//     case PLATFORM.darwin:
//     {
//       const result = stdout.split('\n')[1].split(/\s+/);
//
//       return {
//         rx: parseInt(result[4]),
//         tx: parseInt(result[6])
//       }
//     }
//   }
// }

const getPacketCount = (nic) => {
  const platform = getPlatform()

  switch (platform) {
    case PLATFORM.centos6:
    {
      const parser = stdout => {
        const result = stdout.split('\n')[2].split(/\s+/);
        return {
          rx: parseInt(result[3]),
          tx: parseInt(result[7])
        }
      }

      return {
        command: `netstat -I${nic}`,
        parser: parser
      }
    }
    case PLATFORM.centos7:
    {
      const parser = stdout => {
        const lines = stdout.split('\n');
        const lineRx = lines[3].split(/\s+/)
        const lineTx = lines[5].split(/\s+/)

        return {
          rx: parseInt(lineRx[2]),
          tx: parseInt(lineTx[2])
        }
      }

      return {
        command: `ip -s link show dev ${nic}`,
        parser: parser
      }
    }
    case PLATFORM.darwin:
    {
      const parser = stdout => {
        const result = stdout.split('\n')[1].split(/\s+/);

        return {
          rx: parseInt(result[4]),
          tx: parseInt(result[6])
        }
      }

      return {
        command: `netstat -I ${nic}`,
        parser: parser
      }
    }
  }
}

const getInterfaces = () => {
  const platform = getPlatform()

  switch (platform) {
    case PLATFORM.centos6:
    {
      return {
        command: `netstat -i | tail -n +3`,
        parser: stdout => stdout.split('\n').map(v => v.split(/\s+/)[0]).filter(v => v)
      }
    }
    case PLATFORM.centos7:
    {
      return {
        command: `ip link show | grep -oE '^\[0-9]\+:\[ ]\+(.\+):'`,
        parser: stdout => stdout.split('\n').map(v => v.split(/\s+/)[1]).filter(v => v).map(v => v.replace(/:/, ''))
      }
    }
    case PLATFORM.darwin:
    {
      return {
        command: `networksetup -listallhardwareports | grep Device`,
        parser: stdout => stdout.split('\n').map(v => v.split(/\s+/)[1]).filter(v => v)
      }
    }
  }
}


const settings = {
  interval: 1000,
  interfaces: [],
  selectedInterface: '',
}

ipcMain.on('settings_changed', function(event, newSetting) {
  settings.interval = newSetting.interval;
  settings.selectedInterface = newSetting.selectedInterface;
});

ipcMain.on('request_settings', function(event) {
  const { command, parser } = getInterfaces()
  cmd.get(command,
    function(err, data, stderr) {
      const list = parser(data);
      settings.interfaces = list;
      settings.selectedInterface = list[0];

      if (mainWindow) {
        mainWindow.webContents.send('receive_settings', {
          interval: settings.interval,
          interfaces: settings.interfaces,
          selectedInterface: settings.selectedInterface
        });
      }
    }
  );
});

const timer = new NanoTimer();

const main = () => {
  timer.setTimeout(main, '', `${settings.interval}m`);

  if (settings.selectedInterface !== '') {
    const { command, parser } = getPacketCount(settings.selectedInterface)
    cmd.get(command,
      function(err, data, stderr) {
        const result = parser(data);

        if (mainWindow) {
          mainWindow.webContents.send('packet_received', {
            timestamp: new Date(),
            rx: result.rx,
            tx: result.tx
          });
        }
        store.dispatch(packetCount('en0'));
      }
    );
  }
}

main()

const store = configureStore({}, 'main');

// setInterval(() => {
//   store.dispatch(packetCount('en0'));
// }, 1000)
