import { createWebStorage } from '../utils/createWebStorage/createWebStorage';
export const store = {
    origin: 'https://api.emailjs.com',
    blockHeadless: false,
    storageProvider: createWebStorage(),
};
