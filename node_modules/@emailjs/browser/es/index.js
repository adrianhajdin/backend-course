import { EmailJSResponseStatus } from './models/EmailJSResponseStatus';
import { init } from './methods/init/init';
import { send } from './methods/send/send';
import { sendForm } from './methods/sendForm/sendForm';
export { init, send, sendForm, EmailJSResponseStatus };
export default {
    init,
    send,
    sendForm,
    EmailJSResponseStatus,
};
