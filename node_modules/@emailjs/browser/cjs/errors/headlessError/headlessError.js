"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headlessError = void 0;
const EmailJSResponseStatus_1 = require("../../models/EmailJSResponseStatus");
const headlessError = () => {
    return new EmailJSResponseStatus_1.EmailJSResponseStatus(451, 'Unavailable For Headless Browser');
};
exports.headlessError = headlessError;
