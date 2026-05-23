export = Parser;
declare class Parser {
    constructor(options: any);
    _options: any;
    _handler: Handler;
    _headers: any;
    _escape: (value: any) => any;
    /**
     * Generates a CSV file with optional headers based on the passed JSON,
     * with can be an Object or Array.
     *
     * @param {Object|Array} json
     * @param {Function} done(err,csv) - Callback function
     *      if error, returning error in call back.
     *      if csv is created successfully, returning csv output to callback.
     */
    parse(json: any | any[], done: Function, stream: any): any;
    get headers(): any;
    _checkRows(rows: any): any[];
    _parseArray(json: any, stream: any): string;
    _parseObject(json: any): string;
}
import Handler = require("./handler");
