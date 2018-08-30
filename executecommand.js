const cmd = require('node-cmd');
const  shellParser = require('node-shell-parser');

cmd.get(
  // 'netstat -Ieth0',
  // './fakenetstat',
  'networksetup -listallhardwareports | grep Device',
  function(err, data, stderr) {
      console.log(data)

      // console.log(data.split('\n')[2].split(' '))
      console.log(data.split('\n').map(v => v.split(/\s+/)[1]).filter(v => v))
      // console.log(shellParser(data, {skipLines: 1}))
  }
);
