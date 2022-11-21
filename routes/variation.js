import express from 'express';
import VariationController from '../controllers/Variation.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = new express.Router();

router.get(
  '/getall/product/:productId([0-9]+)',
  VariationController.getAllVariation
);
// router.get('/getone/:id([0-9]+)', VariationController.getOne);
router.post(
  '/create/variation',
  // authMiddleware,
  // adminMiddleware,
  VariationController.createVariation
);
router.post(
  '/create/variation/options',
  // authMiddleware,
  // adminMiddleware,
  VariationController.createOptions
);
// router.put(
//   '/update/:id([0-9]+)',
//   authMiddleware,
//   adminMiddleware,
//   VariationController.update
// );
// router.delete(
//   '/delete/:id([0-9]+)',
//   authMiddleware,
//   adminMiddleware,
//   VariationController.delete
// );

export default router;
