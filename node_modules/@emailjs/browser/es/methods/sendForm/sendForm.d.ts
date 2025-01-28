import type { EmailJSResponseStatus } from '../../models/EmailJSResponseStatus';
import type { Options } from '../../types/Options';
/**
 * Send a form the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {string | HTMLFormElement} form - the form element or selector
 * @param {object} options - the EmailJS SDK config options
 * @returns {Promise<EmailJSResponseStatus>}
 */
export declare const sendForm: (serviceID: string, templateID: string, form: string | HTMLFormElement, options?: Options | string) => Promise<EmailJSResponseStatus>;
