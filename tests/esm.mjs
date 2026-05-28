import { expect } from 'chai';
import os from 'node:os';
import jsonexport from '../lib/index.mjs';

describe('ESM import', () => {
  it('resolves with default export', async () => {
    const csv = await jsonexport([{
      name: 'Bob',
      lastname: 'Smith'
    }]);
    expect(csv).to.equal(`name,lastname${os.EOL}Bob,Smith`);
  });
});
