"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForm = void 0;
const store_1 = require("../../store/store");
const sendPost_1 = require("../../api/sendPost");
const buildOptions_1 = require("../../utils/buildOptions/buildOptions");
const validateForm_1 = require("../../utils/validateForm/validateForm");
const validateParams_1 = require("../../utils/validateParams/validateParams");
const isHeadless_1 = require("../../utils/isHeadless/isHeadless");
const headlessError_1 = require("../../errors/headlessError/headlessError");
const isBlockedValueInParams_1 = require("../../utils/isBlockedValueInParams/isBlockedValueInParams");
const blockedEmailError_1 = require("../../errors/blockedEmailError/blockedEmailError");
const isLimitRateHit_1 = require("../../utils/isLimitRateHit/isLimitRateHit");
const limitRateError_1 = require("../../errors/limitRateError/limitRateError");
const findHTMLForm = (form) => {
    return typeof form === 'string' ? document.querySelector(form) : form;
};
/**
 * Send a form the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {string | HTMLFormElement} form - the form element or selector
 * @param {object} options - the EmailJS SDK config options
 * @returns {Promise<EmailJSResponseStatus>}
 */
const sendForm = async (serviceID, templateID, form, options) => {
    const opts = (0, buildOptions_1.buildOptions)(options);
    const publicKey = opts.publicKey || store_1.store.publicKey;
    const blockHeadless = opts.blockHeadless || store_1.store.blockHeadless;
    const storageProvider = store_1.store.storageProvider || opts.storageProvider;
    const blockList = { ...store_1.store.blockList, ...opts.blockList };
    const limitRate = { ...store_1.store.limitRate, ...opts.limitRate };
    if (blockHeadless && (0, isHeadless_1.isHeadless)(navigator)) {
        return Promise.reject((0, headlessError_1.headlessError)());
    }
    const currentForm = findHTMLForm(form);
    (0, validateParams_1.validateParams)(publicKey, serviceID, templateID);
    (0, validateForm_1.validateForm)(currentForm);
    const formData = new FormData(currentForm);
    if ((0, isBlockedValueInParams_1.isBlockedValueInParams)(blockList, formData)) {
        return Promise.reject((0, blockedEmailError_1.blockedEmailError)());
    }
    if (await (0, isLimitRateHit_1.isLimitRateHit)(location.pathname, limitRate, storageProvider)) {
        return Promise.reject((0, limitRateError_1.limitRateError)());
    }
    formData.append('lib_version', '4.4.1');
    formData.append('service_id', serviceID);
    formData.append('template_id', templateID);
    formData.append('user_id', publicKey);
    return (0, sendPost_1.sendPost)('/api/v1.0/email/send-form', formData);
};
exports.sendForm = sendForm;
