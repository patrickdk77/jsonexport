export = Handler;
declare class Handler {
    constructor(options: any);
    _options: any;
    _typeKeys: string[];
    /**
     * Check if results needing mapping to alternate value
     *
     * @returns [{item, value}] result
     */
    _setHeaders(result: any, item: any): any;
    castValue(element: any, item: any, index: any, parent: any): any;
    checkComplex(element: any, item: any): any;
    /**
     * Check the element type of the element call the correct handle function
     *
     * @param element Element that will be checked
     * @param item Used to make the headers/path breadcrumb
     * @returns [{item, value}] result
     */
    check(element: any, item: any, index: any, parent: any): any;
    /**
     * Handle all Objects
     *
     * @param {Object} obj
     * @returns [{item, value}] result
     */
    _handleObject(obj: any): any[];
    /**
     * Handle all Arrays, merges arrays with primitive types in a single value
     *
     * @param {Array} array
     * @returns [{item, value}] result
     */
    _handleArray(array: any[]): any[];
    /**
     * Handle all Boolean variables, can be replaced with options.handleBoolean
     *
     * @param {Boolean} boolean
     * @returns {String} result
     */
    _handleBoolean(boolean: boolean): string;
    /**
     * Handle all String variables, can be replaced with options.handleString
     *
     * @param {String} string
     * @returns {String} string
     */
    _handleString(string: string): string;
    /**
     * Handle all Number variables, can be replaced with options.handleNumber
     *
     * @param {Number} number
     * @returns {Number} number
     */
    _handleNumber(number: number): number;
    /**
     * Handle all Date variables, can be replaced with options.handleDate
     *
     * @param {Date} number
     * @returns {string} result
     */
    _handleDate(date: any): string;
}
