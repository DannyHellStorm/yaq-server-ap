import express from 'express';
import ColorController from '../controllers/Color.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = new express.Router();

router.get('/getall', ColorController.getAll);
router.get('/getone/:id([0-9]+)', ColorController.getOne);
router.post('/create', authMiddleware, adminMiddleware, ColorController.create);
router.put(
  '/update/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  ColorController.update
);
router.delete(
  '/delete/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  ColorController.delete
);

export default router;
