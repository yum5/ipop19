'use strict';

// const moment = require('moment');
const electron = require('electron');
const NanoTimer = require('nanotimer');
const timer = new NanoTimer();
const { app, BrowserWindow } = electron;
import configureStore from '../shared/store/configureStore';
import {
  loadSettings
} from '../shared/actions/settings';
import {
  packetCount,
} from '../shared/actions/packets';
import {
  vlanConfig,
  receiveVlanConfig
} from '../shared/actions/vlan';
import {
  slotSize,
} from '../shared/actions/slot';
// import { getDevices } from '../shared/actions/devices';

// mainプロセスはWebpackに扱われず単にコピーされるだけなので、export NODE_ENV=production とないと反映されない！！！！！
const isDevelopment = process.env.NODE_ENV !== 'production'


const store = configureStore({}, 'main');

const main = () => {
  const settings = store.getState().settings
  const isDebugMode = settings.isDebugMode;
  // timer.setTimeout(main, '', `30000m`);
  timer.setTimeout(main, '', `15000m`);

  const timestamp = new Date();
  settings.graphEntries.forEach(device => {
    store.dispatch(packetCount(device, timestamp, isDebugMode));
  })
  store.getState().devices.dataSources.forEach(device => {
    store.dispatch(packetCount(device, timestamp, isDebugMode));
  })

  const ryuHost = settings.ryuHost;
  store.dispatch(vlanConfig(ryuHost, isDebugMode));

  store.dispatch(slotSize(settings.plztController, isDebugMode));
}

// wait a moment until React gets ready
setTimeout(() => {
  // store.dispatch(getDevices(['192.168.100.2', '192.168.100.3', '192.168.100.7']));
  store.dispatch(loadSettings());

  main()
  store.dispatch(receiveVlanConfig([{
    vlanId: 15,
    viaSW: 'plzt',
  }]));
}, 3000)



// setInterval(() => {
//   store.dispatch(packetCount('en0'));
// }, 1000)



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
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
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
