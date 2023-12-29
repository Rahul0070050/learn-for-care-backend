const { MailtrapClient } = require("mailtrap");

config();

export let mailTrapClient = null;
export function mailtrapConf() {
  return new Promise((resolve, reject) => {
    try {
      mailTrapClient = new MailtrapClient({
        endpoint: process.env.MAILTRAP_TOKEN,
        token: process.env.MAILTRAP_ENDPOINT,
      });
      resolve();
    } catch (error) {
      reject(error.message);
    }
  });
}
