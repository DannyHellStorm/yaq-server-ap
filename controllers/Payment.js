import PaymentModel from '../models/Payment.js';
import AppError from '../errors/AppError.js';

class Payment {
  async getRoboKassa(req, res, next) {
    try {
      const payment = await PaymentModel.createRobokassa(req.body);
      res.redirect(payment);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async checkPay(req, res, next) {
    try {
      const { invoiceID, outSum, SignatureValue } = req.body;
      const payment = await PaymentModel.checkRobokassa(
        invoiceID,
        outSum,
        SignatureValue
      );

      if (payment) {
        res.send('OKAY');
      } else {
        res.status(400).send('NOT okay');
      }
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Payment();
