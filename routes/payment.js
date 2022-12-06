import express from 'express';
import PaymentController from '../controllers/Payment.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = new express.Router();

router.get('/robokassa', PaymentController.getRoboKassa);
router.get('/robokassa/check', PaymentController.checkPay);

export default router;
