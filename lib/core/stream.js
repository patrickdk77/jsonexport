/* jshint node:true */
'use strict';

const Transform = require('stream').Transform;

class Stream extends Transform {

  constructor(parser) {
    super();
    this._parser = parser;
    this._options = parser._options;
    this._headers = this._options.headers || [];
    this._hasHeaders = false;
    this._lastError = null;
    this._isObject = undefined;
  }

  _mergeChunk(chunk) {
    let self = this;
    self._extra = self._extra || "";
    // Remove starting comma
    if (self._extra.charAt(0) == ',') self._extra = self._extra.substr(1);
    // Append extra to chunk
    chunk = self._extra + chunk.toString();
    // Clear extra memory
    if (self._extra.length > 0) self._extra = "";
    return chunk;
  }
  
  _wrapArray(data) {
    data = data.trim();
    if (data.charAt(0) != '[') data = '[' + data;
    if (data.charAt(data.length - 1) != ']') data += ']';
    return data;
  }

  _transform(chunk, encoding, done) {
    let self = this;
    let json = null;
    // Append extra data to chunk data
    chunk = this._mergeChunk(chunk);    
    if (!chunk) return done(this._lastError);
    
    // Detect if we are streaming a single massive object
    if (self._isObject === undefined) {
      self._isObject = chunk.trim().charAt(0) === '{';
    }
    
    // If it's a single object, we cannot incrementally stream it.
    // Buffer it completely to avoid O(N^2) boundary checking overhead.
    if (self._isObject) {
      self._extra = chunk;
      return done();
    }

    // Split chunk in objects
    let parts = chunk.split('}');
    let attempts = 0;
    while (json === null && parts.length > 0 && attempts < 10) {
      attempts++;
      try {
        let data = self._wrapArray(parts.join('}'));
        json = JSON.parse(data);
      } catch (ex) {
        this._lastError = ex;
        let extraChunk = parts.pop();
        self._extra = extraChunk + (self._extra || "");
        if (parts.length > 0) parts[parts.length - 1] += "}";
      }
    }
    
    // If we exhausted attempts without finding a boundary, buffer the rest of the chunk
    if (!json) {
      if (parts.length > 0) {
        self._extra = parts.join('}') + (self._extra || "");
      }
      return done();
    }
    this._parser.parse(json, (err, csvChunk) => {
      if (err) return done(err);
      if (!self.hasHeaders) {
        self.hasHeaders = true;
        let headers = self._parser.headers;
        if (self._options.includeHeaders && headers) {
          self.push(headers);
          self.push(self._options.endOfLine + csvChunk);
        } else {
          self.push(csvChunk);
        }
      } else {
        self.push(self._options.endOfLine + csvChunk);
      }
      done();
    }, true);
  }

  _flush(done) {
    let self = this;
    if (self._extra && self._extra.trim().length > 0) {
      try {
        let data = self._isObject ? self._extra : self._wrapArray(self._extra);
        let json = JSON.parse(data);
        this._parser.parse(json, (err, csvChunk) => {
          if (err) return done(err);
          if (!self.hasHeaders) {
            self.hasHeaders = true;
            let headers = self._parser.headers;
            if (self._options.includeHeaders && headers) {
              self.push(headers);
              self.push(self._options.endOfLine + csvChunk);
            } else {
              self.push(csvChunk);
            }
          } else {
            self.push(self._options.endOfLine + csvChunk);
          }
          done();
        }, true);
      } catch (ex) {
        done(ex);
      }
    } else {
      done();
    }
  }
}

module.exports = Stream;
