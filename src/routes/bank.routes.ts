import { Router } from 'express';
import {
  createBank,
  getAllBanks,
  getBankById,
  updateBank,
  deleteBank,
} from '../controllers/bank.controller';

const router = Router();

router.post('/', createBank);
router.get('/', getAllBanks);
router.get('/:id', getBankById);
router.put('/:id', updateBank);
router.delete('/:id', deleteBank);

export default router;
