"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlockedValueInParams = void 0;
const validateBlockListParams_1 = require("../validateBlockListParams/validateBlockListParams");
const isBlockListDisabled = (options) => {
    return !options.list?.length || !options.watchVariable;
};
const getValue = (data, name) => {
    return data instanceof FormData ? data.get(name) : data[name];
};
const isBlockedValueInParams = (options, params) => {
    if (isBlockListDisabled(options))
        return false;
    (0, validateBlockListParams_1.validateBlockListParams)(options.list, options.watchVariable);
    const value = getValue(params, options.watchVariable);
    if (typeof value !== 'string')
        return false;
    return options.list.includes(value);
};
exports.isBlockedValueInParams = isBlockedValueInParams;
