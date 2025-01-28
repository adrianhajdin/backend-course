"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const createWebStorage_1 = require("../utils/createWebStorage/createWebStorage");
exports.store = {
    origin: 'https://api.emailjs.com',
    blockHeadless: false,
    storageProvider: (0, createWebStorage_1.createWebStorage)(),
};
