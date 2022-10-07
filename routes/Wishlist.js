import express from 'express';
import WishlistController from '../controllers/Wishlist.js';

const router = new express.Router();

router.get('/getone', WishlistController.getOne);
router.put('/product/:productId([0-9]+)/append/', WishlistController.append);
router.put('/product/:productId([0-9]+)/remove', WishlistController.remove);
router.put('/clear', WishlistController.clear);

export default router;
