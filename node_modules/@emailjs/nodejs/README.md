# Official EmailJS SDK for Node.js

SDK for [EmailJS.com](https://www.emailjs.com) customers.
\
Use your EmailJS account for sending emails.

[![codecov](https://codecov.io/gh/emailjs-com/emailjs-nodejs/branch/main/graph/badge.svg)](https://codecov.io/gh/emailjs-com/emailjs-nodejs)
[![npm version](https://img.shields.io/npm/v/@emailjs/nodejs.svg)](https://www.npmjs.com/package/@emailjs/nodejs)

## Disclaimer

This is a Node.js platform, otherwise use

- [Browser SDK](https://www.npmjs.com/package/@emailjs/browser)
- [React Native](https://www.npmjs.com/package/@emailjs/react-native)
- [Flutter](https://pub.dev/packages/emailjs)
- [REST API](https://www.emailjs.com/docs/rest-api/send/)

## Links

[Official SDK Docs](https://www.emailjs.com/docs)

## Intro

EmailJS helps you send emails directly from code with one command.
No large knowledge is required – just connect EmailJS to one of the supported
email services, create an email template, and use our SDK
to trigger an email.

## Usage

Install EmailJS SDK using [npm](https://www.npmjs.com/package/@emailjs/nodejs):

```bash
$ npm install @emailjs/nodejs
```

**_Note_**: By default, API requests are disabled for non-browser applications.
You need to activate them through [Account:Security](https://dashboard.emailjs.com/admin/account/security).

## FAQ

#### API calls are disabled for non-browser applications

You need to activate API requests
through [Account:Security](https://dashboard.emailjs.com/admin/account/security).

## Examples

### ECMAScript modules

**Send the email using the customized send method**

```js
import emailjs from '@emailjs/nodejs';

const templateParams = {
  name: 'James',
  notes: 'Check this out!',
};

emailjs
  .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, {
    publicKey: 'YOUR_PUBLIC_KEY',
    privateKey: 'YOUR_PRIVATE_KEY', // optional, highly recommended for security reasons
  })
  .then(
    (response) => {
      console.log('SUCCESS!', response.status, response.text);
    },
    (err) => {
      console.log('FAILED...', err);
    },
  );
```

**init (optional)**

```js
import emailjs from '@emailjs/nodejs';

// set Public Key as global settings
emailjs.init({
  publicKey: 'YOUR_PUBLIC_KEY',
  privateKey: 'YOUR_PRIVATE_KEY', // optional, highly recommended for security reasons
});

emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID').then(
  (response) => {
    console.log('SUCCESS!', response.status, response.text);
  },
  (err) => {
    console.log('FAILED...', err);
  },
);
```

**await/async with EmailJS error handler**

```js
import emailjs, { EmailJSResponseStatus } from '@emailjs/nodejs';

try {
  await emailjs.send(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    {},
    {
      publicKey: 'YOUR_PUBLIC_KEY',
      privateKey: 'YOUR_PRIVATE_KEY', // optional, highly recommended for security reasons
    },
  );
  console.log('SUCCESS!');
} catch (err) {
  if (err instanceof EmailJSResponseStatus) {
    console.log('EMAILJS FAILED...', err);
    return;
  }

  console.log('ERROR', err);
}
```

## Configuration

**Options**

Options can be declared globally using the **init** method or locally as the fourth parameter of a function.
\
The local parameter will have higher priority than the global one.

| Name            | Type            | Default | Description                                      |
| --------------- | --------------- | ------- | ------------------------------------------------ |
| publicKey       | String          |         | The public key is required to invoke the method. |
| blockList       | BlockList       |         | Block list settings.                             |
| limitRate       | LimitRate       |         | Limit rate configuration.                        |
| storageProvider | StorageProvider |         | Provider for a custom key-value storage.         |

**BlockList**

Allows to ignore a method call if the watched variable contains a value from the block list.
\
The method will return the error 403 if the request is blocked.

| Name          | Type     | Description                                        |
| ------------- | -------- | -------------------------------------------------- |
| list          | String[] | The array of strings contains values for blocking. |
| watchVariable | String   | A name of the variable to be watched.              |

**LimitRate**

Allows to set the limit rate for calling a method.
\
If the request hits the limit rate, the method will return the error 429.

| Name     | Type   | Default   | Description                                                                                                                              |
| -------- | ------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| id       | String | page path | The limit rate is per page by default. To override the behavior, set the ID. It can be a custom ID for each page, group, or application. |
| throttle | Number |           | _(ms)_ After how many milliseconds a next request is allowed.                                                                            |

**StorageProvider**

Allows to provide a custom key value storage. By default, localStorage is used if available.
\
The custom provider must match the interface.

```ts
interface StorageProvider {
  get: (key: string) => Promise<string | null | undefined>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
}
```

**Declare global settings**

```js
import emailjs from '@emailjs/nodejs';

emailjs.init({
  publicKey: 'YOUR_PUBLIC_KEY',
  privateKey: 'YOUR_PRIVATE_KEY', // optional, highly recommended for security reasons
  blockList: {
    list: ['foo@emailjs.com', 'bar@emailjs.com'],
  },
  limitRate: {
    throttle: 10000, // 10s
  },
});
```

**Overwrite settings locally**

```js
import emailjs from '@emailjs/nodejs';

const templateParams = {
  name: 'James',
  notes: 'Check this out!',
};

emailjs
  .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, {
    publicKey: 'YOUR_PUBLIC_KEY',
    privateKey: 'YOUR_PRIVATE_KEY', // optional, highly recommended for security reasons
    blockList: {
      watchVariable: 'userEmail',
    },
    limitRate: {
      throttle: 0, // turn off the limit rate for these requests
    },
  })
  .then(
    (response) => {
      console.log('SUCCESS!', response.status, response.text);
    },
    (err) => {
      console.log('FAILED...', err);
    },
  );
```
