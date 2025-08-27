/* jshint evil: true */
/* jshint ignore: start */

const os = require('node:os');
const stream = require('node:stream');
const {expect} = require('chai');
const jsonexport = require('../lib/index');

function getWriteStream(done) {
  const write = new stream.Writable();
  let csv = "";
  write._write = function(chunk, enc, next) {
    chunk = chunk.toString();
    csv += chunk;
    next();
  };
  write.on('finish', () => {
    done(csv);
  });
  return write;
}

describe('Stream', () => {
  it('simple', (done) => {
    const read = new stream.Readable();
    const write = getWriteStream((csv) => {
      expect(csv).to.equal(`name,lastname,escaped${os.EOL}Bob,Smith${os.EOL}James,David,"I am a ""quoted"" field"`);
      done();
    });

    read.pipe(jsonexport()).pipe(write);

    read.push(JSON.stringify([{
      name: 'Bob',
      lastname: 'Smith'
    }, {
      name: 'James',
      lastname: 'David',
      escaped: 'I am a "quoted" field'
    }]));
    read.push(null);
  });
  it('simple with options', (done) => {
    const read = new stream.Readable();
    const write = getWriteStream((csv) => {
      expect(csv).to.equal(`name|lastname|escaped${os.EOL}Bob|Smith${os.EOL}James|David|"I am a ""quoted"" field"`);
      done();
    });

    read.pipe(jsonexport({
      rowDelimiter: '|'
    })).pipe(write);

    read.push(JSON.stringify([{
      name: 'Bob',
      lastname: 'Smith'
    }, {
      name: 'James',
      lastname: 'David',
      escaped: 'I am a "quoted" field'
    }]));
    read.push(null);
  });
  it('complex', (done) => {
    const read = new stream.Readable();
    const write = getWriteStream((csv) => {
      expect(csv).to.equal(`id,name,lastname,family.name,family.type${os.EOL}1,Bob,Smith,Peter,Father${os.EOL}2,James,David,Julie,Mother`);
      done();
    });

    read.pipe(jsonexport()).pipe(write);

    read.push(JSON.stringify([{
      id: 1,
      name: 'Bob',
      lastname: 'Smith',
      family: {
        name: 'Peter',
        type: 'Father'
      }
    }, {
      id: 2,
      name: 'James',
      lastname: 'David',
      family: {
        name: 'Julie',
        type: 'Mother'
      }
    }]));
    read.push(null);
  });
});
