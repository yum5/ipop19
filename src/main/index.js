'use strict';

// const moment = require('moment');
const electron = require('electron');
const cmd = require('node-cmd');
const os = require('os');
const NanoTimer = require('nanotimer');
const timer = new NanoTimer();
const { app, BrowserWindow, ipcMain } = electron;
import configureStore from '../shared/store/configureStore';
import {
  appendTime,
  loadSettings
} from '../shared/actions/settings';
import {
  packetCount,
} from '../shared/actions/packets';
import {
  vlanConfig,
  receiveVlanConfig
} from '../shared/actions/vlan';
import { getDevices } from '../shared/actions/devices';

const PLATFORM = {
  centos6: 'centos6',
  centos7: 'centos7',
  darwin: 'darwin'
}

// mainプロセスはWebpackに扱われず単にコピーされるだけなので、export NODE_ENV=production とないと反映されない！！！！！
const isDevelopment = process.env.NODE_ENV !== 'production'

// TODO: only for test purpose !!
// remove this lines
import _ from 'lodash';
const getFakeVlanConfig = () => {
  const sw = ['spine', 'mems', 'plzt'];
  const list = [{
    vlanId: 11,
    viaSW: _.sample(sw),
  },
  {
    vlanId: 12,
    viaSW: _.sample(sw),
  },
  {
    vlanId: 13,
    viaSW: _.sample(sw),
  },
  {
    vlanId: 14,
    viaSW: _.sample(sw),
  },
  {
    vlanId: 15,
    viaSW: _.sample(sw),
  },
  {
    vlanId: 16,
    viaSW: _.sample(sw),
  },
  ]
  return _.sampleSize(list, _.random(1, 6));
}

const store = configureStore({}, 'main');

const main = () => {
  // timer.setTimeout(main, '', `30000m`);
  timer.setTimeout(main, '', `4000m`);

  store.getState().settings.graphEntries.forEach(entry => {
    store.dispatch(packetCount(entry));
  })

  const ryuHost = store.getState().settings.ryuHost;
  store.dispatch(vlanConfig(ryuHost));
  // store.dispatch(receiveVlanConfig(getFakeVlanConfig()));
}

setTimeout(() => {
  // wait a moment until React gets ready
  // store.dispatch(getDevices(['192.168.100.2', '192.168.100.3', '192.168.100.7']));
  // store.dispatch(getDevices(['192.168.100.2']));
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
