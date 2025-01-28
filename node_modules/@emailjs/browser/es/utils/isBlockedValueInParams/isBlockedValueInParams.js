import { validateBlockListParams } from '../validateBlockListParams/validateBlockListParams';
const isBlockListDisabled = (options) => {
    return !options.list?.length || !options.watchVariable;
};
const getValue = (data, name) => {
    return data instanceof FormData ? data.get(name) : data[name];
};
export const isBlockedValueInParams = (options, params) => {
    if (isBlockListDisabled(options))
        return false;
    validateBlockListParams(options.list, options.watchVariable);
    const value = getValue(params, options.watchVariable);
    if (typeof value !== 'string')
        return false;
    return options.list.includes(value);
};
