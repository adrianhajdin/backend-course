var emailjs = (function (exports) {
    'use strict';

    class EmailJSResponseStatus {
      constructor() {
        let _status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let _text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Network Error';
        this.status = _status;
        this.text = _text;
      }
    }

    const createWebStorage = () => {
      if (typeof localStorage === 'undefined') return;
      return {
        get: key => Promise.resolve(localStorage.getItem(key)),
        set: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
        remove: key => Promise.resolve(localStorage.removeItem(key))
      };
    };

    const store = {
      origin: 'https://api.emailjs.com',
      blockHeadless: false,
      storageProvider: createWebStorage()
    };

    const buildOptions = options => {
      if (!options) return {};
      // support compatibility with SDK v3
      if (typeof options === 'string') {
        return {
          publicKey: options
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      if (options.toString() === '[object Object]') {
        return options;
      }
      return {};
    };

    /**
     * EmailJS global SDK config
     * @param {object} options - the EmailJS global SDK config options
     * @param {string} origin - the non-default EmailJS origin
     */
    const init = function (options) {
      let origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'https://api.emailjs.com';
      if (!options) return;
      const opts = buildOptions(options);
      store.publicKey = opts.publicKey;
      store.blockHeadless = opts.blockHeadless;
      store.storageProvider = opts.storageProvider;
      store.blockList = opts.blockList;
      store.limitRate = opts.limitRate;
      store.origin = opts.origin || origin;
    };

    const sendPost = async function (url, data) {
      let headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      const response = await fetch(store.origin + url, {
        method: 'POST',
        headers,
        body: data
      });
      const message = await response.text();
      const responseStatus = new EmailJSResponseStatus(response.status, message);
      if (response.ok) {
        return responseStatus;
      }
      throw responseStatus;
    };

    const validateParams = (publicKey, serviceID, templateID) => {
      if (!publicKey || typeof publicKey !== 'string') {
        throw 'The public key is required. Visit https://dashboard.emailjs.com/admin/account';
      }
      if (!serviceID || typeof serviceID !== 'string') {
        throw 'The service ID is required. Visit https://dashboard.emailjs.com/admin';
      }
      if (!templateID || typeof templateID !== 'string') {
        throw 'The template ID is required. Visit https://dashboard.emailjs.com/admin/templates';
      }
    };

    const validateTemplateParams = templateParams => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      if (templateParams && templateParams.toString() !== '[object Object]') {
        throw 'The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/';
      }
    };

    const isHeadless = navigator => {
      return navigator.webdriver || !navigator.languages || navigator.languages.length === 0;
    };

    const headlessError = () => {
      return new EmailJSResponseStatus(451, 'Unavailable For Headless Browser');
    };

    const validateBlockListParams = (list, watchVariable) => {
      if (!Array.isArray(list)) {
        throw 'The BlockList list has to be an array';
      }
      if (typeof watchVariable !== 'string') {
        throw 'The BlockList watchVariable has to be a string';
      }
    };

    const isBlockListDisabled = options => {
      return !options.list?.length || !options.watchVariable;
    };
    const getValue = (data, name) => {
      return data instanceof FormData ? data.get(name) : data[name];
    };
    const isBlockedValueInParams = (options, params) => {
      if (isBlockListDisabled(options)) return false;
      validateBlockListParams(options.list, options.watchVariable);
      const value = getValue(params, options.watchVariable);
      if (typeof value !== 'string') return false;
      return options.list.includes(value);
    };

    const blockedEmailError = () => {
      return new EmailJSResponseStatus(403, 'Forbidden');
    };

    const validateLimitRateParams = (throttle, id) => {
      if (typeof throttle !== 'number' || throttle < 0) {
        throw 'The LimitRate throttle has to be a positive number';
      }
      if (id && typeof id !== 'string') {
        throw 'The LimitRate ID has to be a non-empty string';
      }
    };

    const getLeftTime = async (id, throttle, storage) => {
      const lastTime = Number((await storage.get(id)) || 0);
      return throttle - Date.now() + lastTime;
    };
    const isLimitRateHit = async (defaultID, options, storage) => {
      if (!options.throttle || !storage) {
        return false;
      }
      validateLimitRateParams(options.throttle, options.id);
      const id = options.id || defaultID;
      const leftTime = await getLeftTime(id, options.throttle, storage);
      if (leftTime > 0) {
        return true;
      }
      await storage.set(id, Date.now().toString());
      return false;
    };

    const limitRateError = () => {
      return new EmailJSResponseStatus(429, 'Too Many Requests');
    };

    /**
     * Send a template to the specific EmailJS service
     * @param {string} serviceID - the EmailJS service ID
     * @param {string} templateID - the EmailJS template ID
     * @param {object} templateParams - the template params, what will be set to the EmailJS template
     * @param {object} options - the EmailJS SDK config options
     * @returns {Promise<EmailJSResponseStatus>}
     */
    const send = async (serviceID, templateID, templateParams, options) => {
      const opts = buildOptions(options);
      const publicKey = opts.publicKey || store.publicKey;
      const blockHeadless = opts.blockHeadless || store.blockHeadless;
      const storageProvider = opts.storageProvider || store.storageProvider;
      const blockList = {
        ...store.blockList,
        ...opts.blockList
      };
      const limitRate = {
        ...store.limitRate,
        ...opts.limitRate
      };
      if (blockHeadless && isHeadless(navigator)) {
        return Promise.reject(headlessError());
      }
      validateParams(publicKey, serviceID, templateID);
      validateTemplateParams(templateParams);
      if (templateParams && isBlockedValueInParams(blockList, templateParams)) {
        return Promise.reject(blockedEmailError());
      }
      if (await isLimitRateHit(location.pathname, limitRate, storageProvider)) {
        return Promise.reject(limitRateError());
      }
      const params = {
        lib_version: '4.4.1',
        user_id: publicKey,
        service_id: serviceID,
        template_id: templateID,
        template_params: templateParams
      };
      return sendPost('/api/v1.0/email/send', JSON.stringify(params), {
        'Content-type': 'application/json'
      });
    };

    const validateForm = form => {
      if (!form || form.nodeName !== 'FORM') {
        throw 'The 3rd parameter is expected to be the HTML form element or the style selector of the form';
      }
    };

    const findHTMLForm = form => {
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
      const opts = buildOptions(options);
      const publicKey = opts.publicKey || store.publicKey;
      const blockHeadless = opts.blockHeadless || store.blockHeadless;
      const storageProvider = store.storageProvider || opts.storageProvider;
      const blockList = {
        ...store.blockList,
        ...opts.blockList
      };
      const limitRate = {
        ...store.limitRate,
        ...opts.limitRate
      };
      if (blockHeadless && isHeadless(navigator)) {
        return Promise.reject(headlessError());
      }
      const currentForm = findHTMLForm(form);
      validateParams(publicKey, serviceID, templateID);
      validateForm(currentForm);
      const formData = new FormData(currentForm);
      if (isBlockedValueInParams(blockList, formData)) {
        return Promise.reject(blockedEmailError());
      }
      if (await isLimitRateHit(location.pathname, limitRate, storageProvider)) {
        return Promise.reject(limitRateError());
      }
      formData.append('lib_version', '4.4.1');
      formData.append('service_id', serviceID);
      formData.append('template_id', templateID);
      formData.append('user_id', publicKey);
      return sendPost('/api/v1.0/email/send-form', formData);
    };

    var index = {
      init,
      send,
      sendForm,
      EmailJSResponseStatus
    };

    exports.EmailJSResponseStatus = EmailJSResponseStatus;
    exports.default = index;
    exports.init = init;
    exports.send = send;
    exports.sendForm = sendForm;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
