"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHeadless = void 0;
const isHeadless = (navigator) => {
    return navigator.webdriver || !navigator.languages || navigator.languages.length === 0;
};
exports.isHeadless = isHeadless;
