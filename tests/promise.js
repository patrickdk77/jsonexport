/* jshint evil: true */
/* jshint ignore: start */

const os = require('node:os');
const {expect} = require('chai');
const jsonexport = require('../lib/index');

describe('Promise', () => {
  it('resolve', async () => {
    const csv = await jsonexport([{
      name: 'Bob',
      lastname: 'Smith'
    }, {
      name: 'James',
      lastname: 'David',
      escaped: 'I am a "quoted" field'
    }]);
    expect(csv).to.equal(`name,lastname,escaped${os.EOL}Bob,Smith${os.EOL}James,David,"I am a ""quoted"" field"`);
  });
  it('catch', (done) => {
    jsonexport(1).catch(err => {
      expect(err).to.be.an('error', 'promise .catch() should return errors');
      done()
    });
  });
  it('with options', async () => {
    const csv = await jsonexport([{
      name: 'Bob',
      lastname: 'Smith'
    }, {
      name: 'James',
      lastname: 'David',
      escaped: 'I am a "quoted" field'
    }], {
      rowDelimiter: ';',
    })
    expect(csv).to.equal(`name;lastname;escaped${os.EOL}Bob;Smith${os.EOL}James;David;"I am a ""quoted"" field"`);
  });
});
