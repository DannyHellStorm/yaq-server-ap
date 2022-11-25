import express from 'express';
import VariationController from '../controllers/Variation.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = new express.Router();

router.get(
  '/getall/product/:productId([0-9]+)',
  VariationController.getAllVariation
);

// variation
router.post(
  '/create/variation',
  // authMiddleware,
  // adminMiddleware,
  VariationController.createVariation
);
router.put(
  '/update/variation/:id([0-9]+)',
  // authMiddleware,
  // adminMiddleware,
  VariationController.updateVariation
);
router.delete(
  'delete/variation/:id([0-9]+)',
  // authMiddleware,
  // adminMiddleware,
  VariationController.deleteVariation
);

// option
router.post(
  '/create/options',
  // authMiddleware,
  // adminMiddleware,
  VariationController.createOptions
);
router.put(
  '/update/options/:id([0-9]+)',
  // authMiddleware,
  // adminMiddleware,
  VariationController.updateOption
);
router.delete(
  '/delete/options/:id([0-9]+)',
  // authMiddleware,
  // adminMiddleware,
  VariationController.deleteOption
);

export default router;
