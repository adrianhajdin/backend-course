"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockedEmailError = void 0;
const EmailJSResponseStatus_1 = require("../../models/EmailJSResponseStatus");
const blockedEmailError = () => {
    return new EmailJSResponseStatus_1.EmailJSResponseStatus(403, 'Forbidden');
};
exports.blockedEmailError = blockedEmailError;
