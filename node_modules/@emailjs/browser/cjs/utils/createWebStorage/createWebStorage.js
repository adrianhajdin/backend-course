"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebStorage = void 0;
const createWebStorage = () => {
    if (typeof localStorage === 'undefined')
        return;
    return {
        get: (key) => Promise.resolve(localStorage.getItem(key)),
        set: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
        remove: (key) => Promise.resolve(localStorage.removeItem(key)),
    };
};
exports.createWebStorage = createWebStorage;
