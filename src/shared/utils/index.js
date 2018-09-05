const cmd = require('node-cmd');
const os = require('os')

const PLATFORM = {
  centos6: 'centos6',
  centos7: 'centos7',
  darwin: 'darwin'
}

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


const executeCommand = (command) => {
  const promise = new Promise((resolve, reject) => {
    cmd.get(command,
      function(err, data, stderr) {
        if (err) {
          reject(new Error(err));
        } else {
          resolve(data);
        }
      }
    );
  })
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error('promise timeout'))
    }, 3000)
  })

  return Promise.race([
    promise,
    timeout
  ])
}


export {
  getPlatform,
  getPacketCount,
  getInterfaces,
  executeCommand
}
