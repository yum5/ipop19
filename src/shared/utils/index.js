const cmd = require('node-cmd');
// const os = require('os')
const sftpClient = require('sftp-promises')
import _ from 'lodash';

// const PLATFORM = {
//   centos6: 'centos6',
//   centos7: 'centos7',
//   darwin: 'darwin'
// }
//
// const getPlatform = () => {
//   if (process.platform === 'linux') {
//     if (os.release().includes('el6')) {
//       return PLATFORM.centos6
//     } else if (os.release().includes('el7')) {
//       return PLATFORM.centos7
//     } else {
//       throw new Error('Unsupported Platform')
//     }
//   } else if (process.platform === 'darwin') {
//     return PLATFORM.darwin
//   } else {
//     throw new Error('Unsupported Platform')
//   }
// }
//
// const getPacketCountCmd = (nic) => {
//   const platform = getPlatform()
//
//   switch (platform) {
//     case PLATFORM.centos6:
//     {
//       const parser = stdout => {
//         const result = stdout.split('\n')[2].split(/\s+/);
//         return {
//           rx: parseInt(result[3]),
//           tx: parseInt(result[7])
//         }
//       }
//
//       return {
//         command: `netstat -I${nic}`,
//         parser: parser
//       }
//     }
//     case PLATFORM.centos7:
//     {
//       const parser = stdout => {
//         const lines = stdout.split('\n');
//         const lineRx = lines[3].split(/\s+/)
//         const lineTx = lines[5].split(/\s+/)
//
//         return {
//           rx: parseInt(lineRx[2]),
//           tx: parseInt(lineTx[2])
//         }
//       }
//
//       return {
//         command: `ip -s link show dev ${nic}`,
//         parser: parser
//       }
//     }
//     case PLATFORM.darwin:
//     {
//       const parser = stdout => {
//         const result = stdout.split('\n')[1].split(/\s+/);
//
//         return {
//           rx: parseInt(result[4]),
//           tx: parseInt(result[6])
//         }
//       }
//
//       return {
//         command: `netstat -I ${nic}`,
//         parser: parser
//       }
//     }
//   }
// }
//
// const getInterfacesCmd = () => {
//   const platform = getPlatform()
//
//   switch (platform) {
//     case PLATFORM.centos6:
//     {
//       return {
//         command: `netstat -i | tail -n +3`,
//         parser: stdout => stdout.split('\n').map(v => v.split(/\s+/)[0]).filter(v => v)
//       }
//     }
//     case PLATFORM.centos7:
//     {
//       return {
//         command: `ip link show | grep -oE '^\[0-9]\+:\[ ]\+(.\+):'`,
//         parser: stdout => stdout.split('\n').map(v => v.split(/\s+/)[1]).filter(v => v).map(v => v.replace(/:/, ''))
//       }
//     }
//     case PLATFORM.darwin:
//     {
//       return {
//         command: `networksetup -listallhardwareports | grep Device`,
//         parser: stdout => stdout.split('\n').map(v => v.split(/\s+/)[1]).filter(v => v)
//       }
//     }
//   }
// }


const executeCommand = command => {
  const promise = new Promise((resolve, reject) => {
    cmd.get(command,
      (err, data) => {
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
      reject(new Error(`promise timeout for: ${command}`))
    }, 30000)
  })

  return Promise.race([
    promise,
    timeout
  ])
}

const _getHostName = async (_executeCommand, ip) => {
   const result = await _executeCommand(`snmpwalk -v 2c -c public ${ip} 1.3.6.1.2.1.1.5.0`);

   try {
     return result.match(/^SNMPv2-MIB::sysName\.0 = STRING: (.+)\n$/)[1];
   } catch (e) {
     throw new Error('snmpwalk returns unexpected result');
   }
}

const getHostName = ip => _getHostName(executeCommand, ip)

const _getInterfaceIndex = async (_executeCommand, ip) => {
   const result = await _executeCommand(`snmpwalk -v 2c -c public ${ip} 1.3.6.1.2.1.2.2.1.1`);

   try {
     return result.split('\n').filter(v => v).map(v => v.match(/^IF-MIB::ifIndex\.(\d+) = INTEGER: (\d+)$/)[2]).map(v => parseInt(v));
   } catch (e) {
     throw new Error('snmpwalk returns unexpected result');
   }
}

const getInterfaceIndex = ip => _getInterfaceIndex(executeCommand, ip)

const _getInOctets = async (_executeCommand, ip, ifIndex) => {
   const result = await _executeCommand(`snmpwalk -v 2c -c public ${ip} 1.3.6.1.2.1.31.1.1.1.6.${ifIndex}`);

   try {
     return parseInt(result.match(/^IF-MIB::ifHCInOctets\.(\d+) = Counter64: (\d+)\n$/)[2]);
   } catch (e) {
     throw new Error('snmpwalk returns unexpected result');
   }
}

const getInOctets = (ip, ifIndex) => _getInOctets(executeCommand, ip, ifIndex)

const _getOutOctets = async (_executeCommand, ip, ifIndex) => {
   const result = await _executeCommand(`snmpwalk -v 2c -c public ${ip} 1.3.6.1.2.1.31.1.1.1.10.${ifIndex}`);

   try {
     return parseInt(result.match(/^IF-MIB::ifHCOutOctets\.(\d+) = Counter64: (\d+)\n$/)[2]);
   } catch (e) {
     throw new Error('snmpwalk returns unexpected result');
   }
}

const getOutOctets = (ip, ifIndex) => _getOutOctets(executeCommand, ip, ifIndex)

const _getIfDesc = async (_executeCommand, ip, ifIndex) => {
   const result = await _executeCommand(`snmpwalk -v 2c -c public ${ip} 1.3.6.1.2.1.2.2.1.2.${ifIndex}`);

   try {
     return result.match(/^IF-MIB::ifDescr\.(\d+) = STRING: (.+)\n$/)[2];
   } catch (e) {
     throw new Error('snmpwalk returns unexpected result');
   }
}

const getIfDesc = (ip, ifIndex) => _getIfDesc(executeCommand, ip, ifIndex)

const _getAdminStatus = async (_executeCommand, ip, ifIndex) => {
   const result = await _executeCommand(`snmpwalk -v 2c -c public ${ip} 1.3.6.1.2.1.2.2.1.7.${ifIndex}`);

   try {
     return result.match(/^IF-MIB::ifAdminStatus\.(\d+) = INTEGER: (\w+)\((\d+)\)\n$/)[2];
   } catch (e) {
     throw new Error('snmpwalk returns unexpected result');
   }
}

const getAdminStatus = (ip, ifIndex) => _getAdminStatus(executeCommand, ip, ifIndex)

const getViaSWFromFlowType = type => {
  if (type === 'mf') {
    return 'spine'
  } else if (type === 'df') {
    return 'mems'
  } else if (type === 'ef') {
    return 'plzt'
  } else {
    throw new Error('got unexpected flow type from Ryu SDN Controller');
  }
}

const _getVlanConfig = async (_executeCommand, ip) => {
  const config = {
    host: ip,
    username: 'student',
    password: 'yamanaka'
  }

  const sftp = new sftpClient(config);
  const buffer = (await sftp.getBuffer('/home/student/holst/ryu-book/SC18/jsonfiles/vlan_state.json')).toString();
  const json = JSON.parse(buffer);
  // console.log(json);
  // const json = {
  //   VLAN: 13,
  //   type: 'mf'
  // }

  const vlans = _.map(_.values(json), vlan => {
    if (vlan && vlan['VLAN'] && vlan['type']) {
      return {
        vlanId: parseInt(vlan['VLAN']),
        viaSW: getViaSWFromFlowType(vlan['type'])
      }
    } else {
      throw new Error('got invalid json message from Ryu SDN Controller');
    }
  })

  return vlans;
}

const getVlanConfig = ip => _getVlanConfig(executeCommand, ip)

export {
  // getPlatform,
  // getPacketCountCmd,
  // getInterfacesCmd,
  executeCommand,
  _getHostName,
  getHostName,
  _getInterfaceIndex,
  getInterfaceIndex,
  _getInOctets,
  getInOctets,
  _getOutOctets,
  getOutOctets,
  _getIfDesc,
  getIfDesc,
  _getAdminStatus,
  getAdminStatus,
  _getVlanConfig,
  getVlanConfig
}
