"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const store_1 = require("../../store/store");
const buildOptions_1 = require("../../utils/buildOptions/buildOptions");
/**
 * EmailJS global SDK config
 * @param {object} options - the EmailJS global SDK config options
 * @param {string} origin - the non-default EmailJS origin
 */
const init = (options, origin = 'https://api.emailjs.com') => {
    if (!options)
        return;
    const opts = (0, buildOptions_1.buildOptions)(options);
    store_1.store.publicKey = opts.publicKey;
    store_1.store.blockHeadless = opts.blockHeadless;
    store_1.store.storageProvider = opts.storageProvider;
    store_1.store.blockList = opts.blockList;
    store_1.store.limitRate = opts.limitRate;
    store_1.store.origin = opts.origin || origin;
};
exports.init = init;
