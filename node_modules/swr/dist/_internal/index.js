Object.defineProperty(exports, '__esModule', { value: true });

var configContextClient = require('./config-context-client-CTAS8iBI.js');
var React = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

const INFINITE_PREFIX = '$inf$';

// @ts-expect-error
const enableDevtools = configContextClient.isWindowDefined && window.__SWR_DEVTOOLS_USE__;
const use = enableDevtools ? window.__SWR_DEVTOOLS_USE__ : [];
const setupDevTools = ()=>{
    if (enableDevtools) {
        // @ts-expect-error
        window.__SWR_DEVTOOLS_REACT__ = React__default.default;
    }
};

const normalize = (args)=>{
    return configContextClient.isFunction(args[1]) ? [
        args[0],
        args[1],
        args[2] || {}
    ] : [
        args[0],
        null,
        (args[1] === null ? args[2] : args[1]) || {}
    ];
};

const useSWRConfig = ()=>{
    return configContextClient.mergeObjects(configContextClient.defaultConfig, React.useContext(configContextClient.SWRConfigContext));
};

const preload = (key_, fetcher)=>{
    const [key, fnArg] = configContextClient.serialize(key_);
    const [, , , PRELOAD] = configContextClient.SWRGlobalState.get(configContextClient.cache);
    // Prevent preload to be called multiple times before used.
    if (PRELOAD[key]) return PRELOAD[key];
    const req = fetcher(fnArg);
    PRELOAD[key] = req;
    return req;
};
const middleware = (useSWRNext)=>(key_, fetcher_, config)=>{
        // fetcher might be a sync function, so this should not be an async function
        const fetcher = fetcher_ && ((...args)=>{
            const [key] = configContextClient.serialize(key_);
            const [, , , PRELOAD] = configContextClient.SWRGlobalState.get(configContextClient.cache);
            if (key.startsWith(INFINITE_PREFIX)) {
                // we want the infinite fetcher to be called.
                // handling of the PRELOAD cache happens there.
                return fetcher_(...args);
            }
            const req = PRELOAD[key];
            if (configContextClient.isUndefined(req)) return fetcher_(...args);
            delete PRELOAD[key];
            return req;
        });
        return useSWRNext(key_, fetcher, config);
    };

const BUILT_IN_MIDDLEWARE = use.concat(middleware);

// It's tricky to pass generic types as parameters, so we just directly override
// the types here.
const withArgs = (hook)=>{
    return function useSWRArgs(...args) {
        // Get the default and inherited configuration.
        const fallbackConfig = useSWRConfig();
        // Normalize arguments.
        const [key, fn, _config] = normalize(args);
        // Merge configurations.
        const config = configContextClient.mergeConfigs(fallbackConfig, _config);
        // Apply middleware
        let next = hook;
        const { use } = config;
        const middleware = (use || []).concat(BUILT_IN_MIDDLEWARE);
        for(let i = middleware.length; i--;){
            next = middleware[i](next);
        }
        return next(key, fn || config.fetcher || null, config);
    };
};

// Add a callback function to a list of keyed callback functions and return
// the unsubscribe function.
const subscribeCallback = (key, callbacks, callback)=>{
    const keyedRevalidators = callbacks[key] || (callbacks[key] = []);
    keyedRevalidators.push(callback);
    return ()=>{
        const index = keyedRevalidators.indexOf(callback);
        if (index >= 0) {
            // O(1): faster than splice
            keyedRevalidators[index] = keyedRevalidators[keyedRevalidators.length - 1];
            keyedRevalidators.pop();
        }
    };
};

// Create a custom hook with a middleware
const withMiddleware = (useSWR, middleware)=>{
    return (...args)=>{
        const [key, fn, config] = normalize(args);
        const uses = (config.use || []).concat(middleware);
        return useSWR(key, fn, {
            ...config,
            use: uses
        });
    };
};

setupDevTools();

exports.IS_REACT_LEGACY = configContextClient.IS_REACT_LEGACY;
exports.IS_SERVER = configContextClient.IS_SERVER;
exports.OBJECT = configContextClient.OBJECT;
exports.SWRConfig = configContextClient.SWRConfig;
exports.SWRGlobalState = configContextClient.SWRGlobalState;
exports.UNDEFINED = configContextClient.UNDEFINED;
exports.cache = configContextClient.cache;
exports.compare = configContextClient.compare;
exports.createCacheHelper = configContextClient.createCacheHelper;
exports.defaultConfig = configContextClient.defaultConfig;
exports.defaultConfigOptions = configContextClient.defaultConfigOptions;
exports.getTimestamp = configContextClient.getTimestamp;
exports.hasRequestAnimationFrame = configContextClient.hasRequestAnimationFrame;
exports.initCache = configContextClient.initCache;
exports.internalMutate = configContextClient.internalMutate;
exports.isDocumentDefined = configContextClient.isDocumentDefined;
exports.isFunction = configContextClient.isFunction;
exports.isPromiseLike = configContextClient.isPromiseLike;
exports.isUndefined = configContextClient.isUndefined;
exports.isWindowDefined = configContextClient.isWindowDefined;
exports.mergeConfigs = configContextClient.mergeConfigs;
exports.mergeObjects = configContextClient.mergeObjects;
exports.mutate = configContextClient.mutate;
exports.noop = configContextClient.noop;
exports.preset = configContextClient.preset;
exports.rAF = configContextClient.rAF;
exports.revalidateEvents = configContextClient.events;
exports.serialize = configContextClient.serialize;
exports.slowConnection = configContextClient.slowConnection;
exports.stableHash = configContextClient.stableHash;
exports.useIsomorphicLayoutEffect = configContextClient.useIsomorphicLayoutEffect;
exports.INFINITE_PREFIX = INFINITE_PREFIX;
exports.normalize = normalize;
exports.preload = preload;
exports.subscribeCallback = subscribeCallback;
exports.useSWRConfig = useSWRConfig;
exports.withArgs = withArgs;
exports.withMiddleware = withMiddleware;
