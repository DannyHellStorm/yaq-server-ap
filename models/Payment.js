import config from 'dotenv/config';

import Robokaska from 'robokaska/src/robokaska.js';

const configure = {
  shopIdentifier: process.env.SHOP_ID,
  password1: process.env.SHOP_PASSWORD_ONE,
  password2: process.env.SHOP_PASSWORD_TWO,
  testMode: true, // Указываем true, если работаем в тестовом режиме
};

const roboKassa = new Robokaska(configure);

class Payment {
  async createRobokassa(data) {
    const { invoiceID, email, outSum, invoiceDescription } = data;
    // const invoiceID = 1;
    // const email = 'yerlanovb@mail.ru';
    // const outSum = 10;
    // const invoiceDescription = 'Order';
    const payUrl = roboKassa.generateUrl(
      invoiceID,
      email,
      outSum,
      invoiceDescription
    );

    return payUrl;
  }

  async checkRobokassa(invoiceID, outSum, SignatureValue) {
    const isPaymentValid = roboKassa.checkPay(
      invoiceID,
      outSum,
      SignatureValue
    );

    return isPaymentValid;
  }
}

export default new Payment();
