import express from 'express';
import SizeController from '../controllers/Size.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = new express.Router();

router.get('/getall', SizeController.getAll);
router.get('/getone/:id([0-9]+)', SizeController.getOne);
router.post('/create', authMiddleware, adminMiddleware, SizeController.create);
router.put(
  '/update/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  SizeController.update
);
router.delete(
  '/delete/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  SizeController.delete
);

export default router;
