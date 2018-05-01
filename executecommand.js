const cmd = require('node-cmd');
const  shellParser = require('node-shell-parser');

cmd.get(
  '/Users/Kyosuke/GitHub/iPOPDemo/fakenetstat',
  function(err, data, stderr) {
      console.log(data)
      console.log(shellParser(data, {skipLines: 1}))
  }
);
