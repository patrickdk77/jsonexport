export = Stream;
declare class Stream {
    constructor(parser: any);
    _parser: any;
    _options: any;
    _headers: any;
    _hasHeaders: boolean;
    _lastError: any;
    _isObject: any;
    _mergeChunk(chunk: any): any;
    _extra: any;
    _wrapArray(data: any): any;
    _transform(chunk: any, encoding: any, done: any): any;
    _flush(done: any): void;
}
