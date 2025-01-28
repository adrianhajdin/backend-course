"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPost = void 0;
const EmailJSResponseStatus_1 = require("../models/EmailJSResponseStatus");
const store_1 = require("../store/store");
const sendPost = async (url, data, headers = {}) => {
    const response = await fetch(store_1.store.origin + url, {
        method: 'POST',
        headers,
        body: data,
    });
    const message = await response.text();
    const responseStatus = new EmailJSResponseStatus_1.EmailJSResponseStatus(response.status, message);
    if (response.ok) {
        return responseStatus;
    }
    throw responseStatus;
};
exports.sendPost = sendPost;
