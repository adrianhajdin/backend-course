"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLimitRateHit = void 0;
const validateLimitRateParams_1 = require("../validateLimitRateParams/validateLimitRateParams");
const getLeftTime = async (id, throttle, storage) => {
    const lastTime = Number((await storage.get(id)) || 0);
    return throttle - Date.now() + lastTime;
};
const isLimitRateHit = async (defaultID, options, storage) => {
    if (!options.throttle || !storage) {
        return false;
    }
    (0, validateLimitRateParams_1.validateLimitRateParams)(options.throttle, options.id);
    const id = options.id || defaultID;
    const leftTime = await getLeftTime(id, options.throttle, storage);
    if (leftTime > 0) {
        return true;
    }
    await storage.set(id, Date.now().toString());
    return false;
};
exports.isLimitRateHit = isLimitRateHit;
