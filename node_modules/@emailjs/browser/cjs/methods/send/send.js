"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = void 0;
const store_1 = require("../../store/store");
const sendPost_1 = require("../../api/sendPost");
const buildOptions_1 = require("../../utils/buildOptions/buildOptions");
const validateParams_1 = require("../../utils/validateParams/validateParams");
const validateTemplateParams_1 = require("../../utils/validateTemplateParams/validateTemplateParams");
const isHeadless_1 = require("../../utils/isHeadless/isHeadless");
const headlessError_1 = require("../../errors/headlessError/headlessError");
const isBlockedValueInParams_1 = require("../../utils/isBlockedValueInParams/isBlockedValueInParams");
const blockedEmailError_1 = require("../../errors/blockedEmailError/blockedEmailError");
const isLimitRateHit_1 = require("../../utils/isLimitRateHit/isLimitRateHit");
const limitRateError_1 = require("../../errors/limitRateError/limitRateError");
/**
 * Send a template to the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {object} templateParams - the template params, what will be set to the EmailJS template
 * @param {object} options - the EmailJS SDK config options
 * @returns {Promise<EmailJSResponseStatus>}
 */
const send = async (serviceID, templateID, templateParams, options) => {
    const opts = (0, buildOptions_1.buildOptions)(options);
    const publicKey = opts.publicKey || store_1.store.publicKey;
    const blockHeadless = opts.blockHeadless || store_1.store.blockHeadless;
    const storageProvider = opts.storageProvider || store_1.store.storageProvider;
    const blockList = { ...store_1.store.blockList, ...opts.blockList };
    const limitRate = { ...store_1.store.limitRate, ...opts.limitRate };
    if (blockHeadless && (0, isHeadless_1.isHeadless)(navigator)) {
        return Promise.reject((0, headlessError_1.headlessError)());
    }
    (0, validateParams_1.validateParams)(publicKey, serviceID, templateID);
    (0, validateTemplateParams_1.validateTemplateParams)(templateParams);
    if (templateParams && (0, isBlockedValueInParams_1.isBlockedValueInParams)(blockList, templateParams)) {
        return Promise.reject((0, blockedEmailError_1.blockedEmailError)());
    }
    if (await (0, isLimitRateHit_1.isLimitRateHit)(location.pathname, limitRate, storageProvider)) {
        return Promise.reject((0, limitRateError_1.limitRateError)());
    }
    const params = {
        lib_version: '4.4.1',
        user_id: publicKey,
        service_id: serviceID,
        template_id: templateID,
        template_params: templateParams,
    };
    return (0, sendPost_1.sendPost)('/api/v1.0/email/send', JSON.stringify(params), {
        'Content-type': 'application/json',
    });
};
exports.send = send;
