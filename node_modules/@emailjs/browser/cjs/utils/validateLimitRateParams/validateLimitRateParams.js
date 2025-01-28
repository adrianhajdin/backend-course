"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLimitRateParams = void 0;
const validateLimitRateParams = (throttle, id) => {
    if (typeof throttle !== 'number' || throttle < 0) {
        throw 'The LimitRate throttle has to be a positive number';
    }
    if (id && typeof id !== 'string') {
        throw 'The LimitRate ID has to be a non-empty string';
    }
};
exports.validateLimitRateParams = validateLimitRateParams;
