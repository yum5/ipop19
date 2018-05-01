const cmd = require('node-cmd');
const  shellParser = require('node-shell-parser');

cmd.get(
  // 'netstat -Ieth0',
  // './fakenetstat',
  function(err, data, stderr) {
      console.log(data)

      console.log(data.split('\n')[2].split(' '))
      // console.log(shellParser(data, {skipLines: 1}))
  }
);
