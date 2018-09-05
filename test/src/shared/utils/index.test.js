import { executeCommand,
  getHostName,
  _getHostName,
  _getInterfaces,
  getInterfaces
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
        .rejects.toThrowError('command not found');
      // done();
    })

    it('should throw an error when command takes too long time', async () => {
      await expect(executeCommand('sleep 10'))
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

  describe('getInterfaces', () => {
    it('should get Host Name successfully', async (done) => {
const expected = `IF-MIB::ifIndex.1 = INTEGER: 1
IF-MIB::ifIndex.2 = INTEGER: 2
IF-MIB::ifIndex.3 = INTEGER: 3
IF-MIB::ifIndex.4 = INTEGER: 4
IF-MIB::ifIndex.5 = INTEGER: 5
IF-MIB::ifIndex.156 = INTEGER: 156
`;
      const _executeCommand = sinon.stub().returns(Promise.resolve(expected));

      const result = await _getInterfaces(_executeCommand, '192.168.100.14');
      expect(result).toEqual([1, 2, 3, 4, 5, 156]);
      done();
    })

    it('should throw an error when command returns unexpected result', async () => {
      const _executeCommand = sinon.stub().returns(Promise.resolve('*******\n****\n****'));
      await expect(_getInterfaces(_executeCommand, '192.168.100.14'))
        .rejects.toThrowError('snmpwalk returns unexpected result');
    })
  })
})
