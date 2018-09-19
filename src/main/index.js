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
import { getDevices } from '../shared/actions/devices';

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
    webPreferences: {
      nativeWindowOpen: true
    }
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

const settings = {
  interval: 20000,
  interfaces: [],
  selectedInterface: '',
}

const store = configureStore({}, 'main');
setTimeout(() => {
  // wait a moment until React gets ready
  // store.dispatch(getDevices(['192.168.100.2', '192.168.100.3', '192.168.100.7']));
  store.dispatch(getDevices(['192.168.100.2']));
}, 3000)


const timer = new NanoTimer();

const main = () => {
  timer.setTimeout(main, '', `${settings.interval}m`);

  store.getState().settings.graphEntries.forEach(entry => {
    store.dispatch(packetCount(entry));
  })
}

main()

// setInterval(() => {
//   store.dispatch(packetCount('en0'));
// }, 1000)
