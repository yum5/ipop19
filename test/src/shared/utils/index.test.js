import {
  TIMEOUT,
  executeCommand,
  getHostName,
  _getHostName,
  _getInterfaceIndex,
  getInterfaceIndex,
  _getInOctets,
  getInOctets,
  _getIfDesc,
  getIfDesc,
  _getAdminStatus,
  getAdminStatus
} from '../../../../src/shared/utils/index';
import sinon from 'sinon';

describe('utils/index', () => {
  describe('executeCommand', () => {
    it('should execute pwd command successfully', async (done) => {
      const result = await executeCommand('pwd');
      expect(result).toBeTruthy();
      done();
    })

    it('should throw an error when command not found', async () => {
      await expect(executeCommand('unknown-command'))
        .rejects.toThrow();
      // done();
    })

    it('should throw an error when command takes too long time', async () => {
      jest.setTimeout(TIMEOUT * 2);
      await expect(executeCommand(`sleep ${TIMEOUT * 2 / 1000}`))
        .rejects.toThrowError('promise timeout');
    })
  })

  describe('getHostName', () => {
    it('should get Host Name successfully', async (done) => {
      const _executeCommand = sinon.stub().returns(Promise.resolve('SNMPv2-MIB::sysName.0 = STRING: HOLST M4300TOR#1\n'));

      const result = await _getHostName(_executeCommand, '192.168.100.14');
      expect(result).toEqual('HOLST M4300TOR#1');
      done();
    })

    it('should throw an error when command returns unexpected result', async () => {
      const _executeCommand = sinon.stub().returns(Promise.resolve('*************'));
      await expect(_getHostName(_executeCommand, '192.168.100.14'))
        .rejects.toThrowError('snmpwalk returns unexpected result');
    })
  })

  describe('getInterfaceIndex', () => {
    it('should get interface index successfully', async (done) => {
const expected = `IF-MIB::ifIndex.1 = INTEGER: 1
IF-MIB::ifIndex.2 = INTEGER: 2
IF-MIB::ifIndex.3 = INTEGER: 3
IF-MIB::ifIndex.4 = INTEGER: 4
IF-MIB::ifIndex.5 = INTEGER: 5
IF-MIB::ifIndex.156 = INTEGER: 156
`;
      const _executeCommand = sinon.stub().returns(Promise.resolve(expected));

      const result = await _getInterfaceIndex(_executeCommand, '192.168.100.14');
      expect(result).toEqual([1, 2, 3, 4, 5, 156]);
      done();
    })

    it('should throw an error when command returns unexpected result', async () => {
      const _executeCommand = sinon.stub().returns(Promise.resolve('*******\n****\n****'));
      await expect(_getInterfaceIndex(_executeCommand, '192.168.100.14'))
        .rejects.toThrowError('snmpwalk returns unexpected result');
    })
  })

  describe('getInOctets', () => {
    it('should get in octets successfully', async (done) => {
const expected = `IF-MIB::ifHCInOctets.1 = Counter64: 2881550
`;
      const _executeCommand = sinon.stub().returns(Promise.resolve(expected));

      const result = await _getInOctets(_executeCommand, '192.168.100.14', 10);
      expect(result).toEqual(2881550);
      done();
    })

    it('should throw an error when command returns unexpected result', async () => {
      const _executeCommand = sinon.stub().returns(Promise.resolve('*******\n****\n****'));
      await expect(_getInOctets(_executeCommand, '192.168.100.14', 10))
        .rejects.toThrowError(' returns unexpected result');
    })
  })

  describe('getIfDesc', () => {
    it('should get if desc successfully', async (done) => {
const expected = `IF-MIB::ifDescr.10 = STRING: Unit: 1 Slot: 0 Port: 10 10G - Level
`;
      const _executeCommand = sinon.stub().returns(Promise.resolve(expected));

      const result = await _getIfDesc(_executeCommand, '192.168.100.14', 10);
      expect(result).toEqual('Unit: 1 Slot: 0 Port: 10 10G - Level');
      done();
    })

    it('should throw an error when command returns unexpected result', async () => {
      const _executeCommand = sinon.stub().returns(Promise.resolve('*******\n****\n****'));
      await expect(_getIfDesc(_executeCommand, '192.168.100.14', 10))
        .rejects.toThrowError('snmpwalk returns unexpected result');
    })
  })

  describe('getAdminStaus', () => {
    it('should get status successfully', async (done) => {
const expected = `IF-MIB::ifAdminStatus.10 = INTEGER: up(1)
`;
      const _executeCommand = sinon.stub().returns(Promise.resolve(expected));

      const result = await _getAdminStatus(_executeCommand, '192.168.100.14', 10);
      expect(result).toEqual('up');
      done();
    })

    it('should get status successfully', async (done) => {
const expected = `IF-MIB::ifAdminStatus.3 = INTEGER: down(2)
`;
      const _executeCommand = sinon.stub().returns(Promise.resolve(expected));

      const result = await _getAdminStatus(_executeCommand, '192.168.100.14', 10);
      expect(result).toEqual('down');
      done();
    })

    it('should throw an error when command returns unexpected result', async () => {
      const _executeCommand = sinon.stub().returns(Promise.resolve('*******\n****\n****'));
      await expect(_getAdminStatus(_executeCommand, '192.168.100.14', 10))
        .rejects.toThrowError('snmpwalk returns unexpected result');
    })
  })
})
