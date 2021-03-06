const cmd = require('node-cmd');
// const os = require('os')
const sftpClient = require('sftp-promises')
import _ from 'lodash';

const TIMEOUT = 100000

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

const DEBUG_IN_OCTET = {
}
const DEBUG_OUT_OCTET = {
}

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
    }, TIMEOUT)
  })

  return Promise.race([
    promise,
    timeout
  ])
}

const _getHostName = async (_executeCommand, ip) => {
   const result = await _executeCommand(`snmpwalk -v 2c -c public ${ip} 1.3.6.1.2.1.1.5.0`);

   try {
     return result.match(/^SNMPv2-MIB::sysName\.0 = STRING: (.+)\r\n/)[1];
   } catch (e) {
     throw new Error('snmpwalk returns unexpected result1');
   }
}

const getHostName = ip => _getHostName(executeCommand, ip)

const _getInterfaceIndex = async (_executeCommand, ip) => {
   const result = await _executeCommand(`snmpwalk -v 2c -c public ${ip} 1.3.6.1.2.1.2.2.1.1`);

   try {
     return result.split('\n').filter(v => v).map(v => v.match(/^IF-MIB::ifIndex\.(\d+) = INTEGER: (\d+)/)[2]).map(v => parseInt(v));
   } catch (e) {
     throw new Error('snmpwalk returns unexpected result2');
   }
}

const getInterfaceIndex = ip => _getInterfaceIndex(executeCommand, ip)

const _getInOctets = async (_executeCommand, ip, ifIndex, isDebugMode) => {
  if (isDebugMode) {
    const current = DEBUG_IN_OCTET[`${ip}::${ifIndex}`] || 1000;
    const delta = _.random(0, 10) + _.random(0, 10) + _.random(0, 10);
    const next = current + delta;

    DEBUG_IN_OCTET[`${ip}::${ifIndex}`] = next;
    return next;
  }
  // const result = await _executeCommand(`snmpwalk -v 2c -c public ${ip} 1.3.6.1.2.1.31.1.1.1.6`);
  // const result = await _executeCommand(`snmpget -v 2c -c public ${ip} ifHCInOctets.${ifIndex}`);
  const result = await _executeCommand(`snmpget -v 2c -c public ${ip} ifHCInUcastPkts.${ifIndex}`);
  try {
    // if (ifIndex == 10406){
    //   return parseInt(result.match(/^IF-MIB::ifHCInOctets\.10406 = Counter64: (\d+)\r\n/)[2]);
    // }
   return parseInt(result.match(/^IF-MIB::ifHCInUcastPkts\.(\d+) = Counter64: (\d+)\r\n/)[2]);
  } catch (e) {
   throw new Error('snmpwalk returns unexpected result3');
  }
}

const getInOctets = (ip, ifIndex, isDebugMode) => _getInOctets(executeCommand, ip, ifIndex, isDebugMode)

const _getOutOctets = async (_executeCommand, ip, ifIndex, isDebugMode) => {
  if (isDebugMode) {
    const current = DEBUG_OUT_OCTET[`${ip}::${ifIndex}`] || 1000;
    const delta = _.random(0, 10) + _.random(0, 10) + _.random(0, 10);
    const next = current + delta;

    DEBUG_OUT_OCTET[`${ip}::${ifIndex}`] = next;
    return next;
  }
  // const result = await _executeCommand(`snmpwalk -v 2c -c public ${ip} 1.3.6.1.2.1.31.1.1.1.10.${ifIndex}`);
  const result = await _executeCommand(`snmpget -v 2c -c public ${ip} ifHCOutUcastPkts.${ifIndex}`);

  try {
   return parseInt(result.match(/^IF-MIB::ifHCOutUcastPkts\.(\d+) = Counter64: (\d+)\r\n/)[2]);
  } catch (e) {
   throw new Error('snmpwalk returns unexpected result4');
  }
}

const getOutOctets = (ip, ifIndex, isDebugMode) => _getOutOctets(executeCommand, ip, ifIndex, isDebugMode)

const _getIfDesc = async (_executeCommand, ip, ifIndex) => {
   const result = await _executeCommand(`snmpwalk -v 2c -c public ${ip} 1.3.6.1.2.1.2.2.1.2.${ifIndex}`);
   

   try {
     return result.match(/^IF-MIB::ifDescr\.(\d+) = STRING: (.+)\r\n/)[2];
   } catch (e) {
     throw new Error('snmpwalk returns unexpected result5');
   }
}

const getIfDesc = (ip, ifIndex) => _getIfDesc(executeCommand, ip, ifIndex)

const _getAdminStatus = async (_executeCommand, ip, ifIndex) => {
   const result = await _executeCommand(`snmpwalk -v 2c -c public ${ip} 1.3.6.1.2.1.2.2.1.7.${ifIndex}`);

   try {
     return result.match(/^IF-MIB::ifAdminStatus\.(\d+) = INTEGER: (\w+)\((\d+)\)\r\n/)[2];
   } catch (e) {
     throw new Error('snmpwalk returns unexpected result6');
   }
}

const getAdminStatus = (ip, ifIndex) => _getAdminStatus(executeCommand, ip, ifIndex)

const getViaSWFromFlowType = type => {
  if (type === 'mf') {
    return 'spine'
  } else if (type === 'df') {
    return 'plzt'
  } else if (type === 'ef') {
    return 'mems'
  } else {
    throw new Error('got unexpected flow type from Ryu SDN Controller');
  }
}

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

const _getVlanConfig = async (_executeCommand, ip, isDebugMode) => {
  if (isDebugMode) {
    return getFakeVlanConfig();
  }

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

const getVlanConfig = (ip, isDebugMode) => _getVlanConfig(executeCommand, ip, isDebugMode)

const getSlotSize = async (ip, isDebugMode) => {
  if (isDebugMode) {
    return {
      // slotA: _.random(1, 100),
      // slotB: _.random(1, 100),
      // slotC: _.random(1, 100),
      slotA0: _.random(1, 100),
      slotA1: _.random(1, 100),
      slotA2: _.random(1, 100),
      // slotA3: _.random(1, 100),
      // slotA4: _.random(1, 100),
      // slotA5: _.random(1, 100),
      slotB0: _.random(1, 100),
      slotB1: _.random(1, 100),
      slotB2: _.random(1, 100),
      slotB3: _.random(1, 100),
      slotB4: _.random(1, 100),
      slotB5: _.random(1, 100),
      slotC0: _.random(1, 100),
      slotC1: _.random(1, 100),
      slotC2: _.random(1, 100),
      slotC3: _.random(1, 100),
      slotC4: _.random(1, 100),
      slotC5: _.random(1, 100),
      slotD0: _.random(1, 100),
      slotD1: _.random(1, 100),
      slotD2: _.random(1, 100),
      // slotD: _.random(1, 100),
      // slotE: _.random(1, 100),
    }
  }

  const config = {
    host: ip,
    username: 'student',
    password: 'yamanaka'
  }

  const sftp = new sftpClient(config);
  const buffer = (await sftp.getBuffer('/home/student/keio_technomall_2018/slot.json')).toString();
  const json = JSON.parse(buffer);

  if (json) {
    return {
      slotA: json['slotA'],
      slotA0: json['slotA0'],
      slotA1: json['slotA1'],
      slotA2: json['slotA2'],
      slotB: json['slotB'],
      slotB0: json['slotB0'],
      slotB1: json['slotB1'],
      slotB2: json['slotB2'],
      slotB3: json['slotB3'],
      slotB4: json['slotB4'],
      slotB5: json['slotB5'],
      slotC: json['slotC'],
      slotC0: json['slotC0'],
      slotC1: json['slotC1'],
      slotC2: json['slotC2'],
      slotC3: json['slotC3'],
      slotC4: json['slotC4'],
      slotC5: json['slotC5'],
      slotD: json['slotD'],
      slotE: json['slotE'],
    }
  } else {
    throw new Error('got invalid json message from PLZT Controller');
  }
}

export {
  // getPlatform,
  // getPacketCountCmd,
  // getInterfacesCmd,
  TIMEOUT,
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
  getVlanConfig,
  getSlotSize
}
