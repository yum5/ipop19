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


const net = require('net');

// const client = new net.Socket();
// client.connect(3030, 'localhost', function() {
// 	console.log('Connected');
// 	client.write('Hello, server! Love, Client.');
// });
//
// client.on('data', function(data) {
// 	console.log('Received: ' + data);
//   mainWindow.webContents.send('packet_received', {
//     timestamp: moment()
//   });
// 	client.destroy(); // kill client after server's response
// });
//
// client.on('close', function() {
// 	console.log('Connection closed');
// });

// const server = net.createServer(function(conn){
//   console.log('server-> tcp server created');
//
//   conn.on('data', function(data) {
//     console.log('server-> ' + data + ' from ' + conn.remoteAddress + ':' + conn.remotePort);
//     conn.write('server -> Repeating: ' + data);
//     mainWindow.webContents.send('packet_received', {
//       timestamp: new Date()
//     });
//   });
//   conn.on('close', function(){
//     console.log('server-> client closed connection');
//   });
// }).listen(3000);


// var observable = interval(1000);
// var subscription = observable.take(3).subscribe(x => console.log(x));
// range(1, 200)
//   .pipe(filter(x => x % 2 === 1), map(x => x + x))
//   .subscribe(x => console.log(x));


const settings = {
  interval: 1000
}

const main = () => {
  // centos 6
  // cmd.get(
  //   'netstat -Ieth0',
  //   // '/Users/Kyosuke/GitHub/iPOPDemo/fakenetstat',
  //   function(err, data, stderr) {
  //     const result = data.split('\n')[2].split(' ');
  //
  //     if (mainWindow) {
  //       mainWindow.webContents.send('packet_received', {
  //         timestamp: new Date(),
  //         rx: parseInt(result[3]),
  //         tx: parseInt(result[7])
  //       });
  //     }
  //   }
  // );

  // centos 7
  cmd.get(
    // ip -s link show dev eth0,
    'netstat -Ieth0',
    // '/Users/Kyosuke/GitHub/iPOPDemo/fakenetstat',
    function(err, data, stderr) {
      const result = data.split('\n')[2].split(' ');

      if (mainWindow) {
        mainWindow.webContents.send('packet_received', {
          timestamp: new Date(),
          rx: parseInt(result[2]),
          tx: parseInt(result[6])
        });
      }
    }
  );
  setTimeout(main, settings.interval);
}

main()
ipcMain.on('settings_changed', function(event, interval) {
  settings.interval = interval
});
