import { executeCommand } from '../../../../src/shared/utils/index';

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
})
