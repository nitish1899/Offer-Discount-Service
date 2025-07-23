import { Request, Response, NextFunction } from "express";
import { OfferService } from "../services/offer.service";

export async function postOffers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const service = new OfferService(req.orm);
  try {
    const result = await service.processOffers(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getHighestDiscount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const service = new OfferService(req.orm);

  try {
    const { amountToPay, bankName, paymentInstrument } = req.query;
    const result = await service.findBestDiscount(
      Number(amountToPay),
      String(bankName),
      String(paymentInstrument)
    );
    res.json({ highestDiscountAmount: result });
  } catch (err) {
    next(err);
  }
}
