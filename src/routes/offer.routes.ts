import { Router } from 'express';
import { postOffers, getHighestDiscount } from '../controllers/offer.controller';
const router = Router();

router.post('/', postOffers);
router.get('/highest-discount', getHighestDiscount);

export default router;