import { store } from '../../store/store';
import { buildOptions } from '../../utils/buildOptions/buildOptions';
/**
 * EmailJS global SDK config
 * @param {object} options - the EmailJS global SDK config options
 * @param {string} origin - the non-default EmailJS origin
 */
export const init = (options, origin = 'https://api.emailjs.com') => {
    if (!options)
        return;
    const opts = buildOptions(options);
    store.publicKey = opts.publicKey;
    store.blockHeadless = opts.blockHeadless;
    store.storageProvider = opts.storageProvider;
    store.blockList = opts.blockList;
    store.limitRate = opts.limitRate;
    store.origin = opts.origin || origin;
};
