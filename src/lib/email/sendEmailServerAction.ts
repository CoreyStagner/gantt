'use server';

import { Log } from '@/src/lib/log/addLogServerAction';
import formData from 'form-data';
import Mailgun, { MessagesSendResult } from 'mailgun.js';
const mailgun = new Mailgun(formData);
if (!process.env.NEXT_PUBLIC_MAILGUN_API_KEY) {
  throw new Error('NEXT_PUBLIC_MAILGUN_API_KEY is not set');
}
const mg = mailgun.client({
  username: 'dev_test',
  key: process.env.NEXT_PUBLIC_MAILGUN_API_KEY,
});

const handleSendEmail = async () => {
  // Check if the environment variables are set
  if (!process.env.NEXT_PUBLIC_MAILGUN_EMAIL_SERVER) {
    throw new Error('NEXT_PUBLIC_MAILGUN_EMAIL_SERVER is not set');
  }
  if (!process.env.NEXT_PUBLIC_MAILGUN_EMAIL_FROM) {
    throw new Error('NEXT_PUBLIC_MAILGUN_EMAIL_FROM is not set');
  }
  // Build Email Config Object
  const emailConfig = {
    from: process.env.NEXT_PUBLIC_MAILGUN_EMAIL_FROM,
    to: ['coreystagnerllc@gmail.com'],
    // TODO: Add templates for the subject, text, and HTML
    subject: 'Hello',
    text: 'Testing some Mailgun awesomness!',
    html: '<h1>Testing some Mailgun awesomness!</h1>',
  };
  // Send Email
  mg.messages
    .create(process.env.NEXT_PUBLIC_MAILGUN_EMAIL_SERVER, emailConfig)
    .then((msg: MessagesSendResult) =>
      Log({
        level: 'VERBOSE',
        uuid: '2b52e0bb-9d13-4758-a243-466ec293346a',
        message: `Email successfully sent ${JSON.stringify(msg)}`,
        data: JSON.stringify(msg),
      })
    ) // logs response data
    .catch((err: unknown) =>
      Log({
        level: 'ERROR',
        uuid: 'd8bddd52-2751-48b2-aaae-20f7da1cf402',
        message: 'Email failed to send' + err,
      })
    ); // logs any error
};

export { handleSendEmail };
