import { Request, Response, NextFunction } from 'express';
import { processOffers, findBestDiscount } from '../services/offer.service';

export async function postOffers(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await processOffers(req.orm, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getHighestDiscount(req: Request, res: Response, next: NextFunction) {
  try {
    const { amountToPay, bankName, paymentInstrument } = req.query;
    const result = await findBestDiscount(req.orm, Number(amountToPay), String(bankName), String(paymentInstrument));
    res.json({ highestDiscountAmount: result });
  } catch (err) {
    next(err);
  }
}
