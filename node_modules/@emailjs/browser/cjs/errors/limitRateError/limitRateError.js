"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitRateError = void 0;
const EmailJSResponseStatus_1 = require("../../models/EmailJSResponseStatus");
const limitRateError = () => {
    return new EmailJSResponseStatus_1.EmailJSResponseStatus(429, 'Too Many Requests');
};
exports.limitRateError = limitRateError;
