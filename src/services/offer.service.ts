// services/offer.service.ts
import { EntityManager } from '@mikro-orm/core';
import { Offer } from '../entities/Offer';
import { OfferRepository } from '../repositories/offer.repository';
import { extractBankName, extractPaymentInstrument } from '../utils/extractors';

export async function processOffers(em: EntityManager, body: any) {
  const offers = body?.flipkartOfferApiResponse?.offer_sections?.PBO?.offers || [];
  const repo = em.getRepository(Offer) as OfferRepository;

  let total = offers.length;
  let newOffers = 0;
  const adjustmentIds: string[] = [];

  for (const o of offers) {
    const od = o.offer_details;
    adjustmentIds.push(od.adjustment_id);

    const exists = await repo.existsByAdjustmentId(od.adjustment_id);
    if (exists) continue;

    await repo.createOffer({
      adjustment_id: od.adjustment_id,
      title: od.title,
      summary: od.summary,
      display_text: od.display_text,
      provider: od.provider,
      adjustment_type: od.adjustment_type,
      adjustment_sub_type: od.adjustment_sub_type,
      adjustment_status: o.adjustment_status,
      discount_amount: od.offer_txn_limits?.max_discount_per_txn / 100,
      min_txn_value: od.offer_txn_limits?.min_txn_value / 100,
      max_txn_value: od.offer_txn_limits?.max_txn_value / 100,
      max_discount_per_txn: od.offer_txn_limits?.max_discount_per_txn / 100,
      max_discount_per_card: od.offer_aggregation_limits?.max_discount_per_card / 100,
      max_txns_for_offer: od.offer_aggregation_limits?.max_txns_for_offer,
      bank_name: extractBankName(o.failure_description),
      payment_instrument: extractPaymentInstrument(o.failure_description),
      is_active: true,
    });

    newOffers++;
  }

  await repo.markInactiveByMissingAdjustmentIds(adjustmentIds);
  await em.flush();

  return {
    noOfOffersIdentified: total,
    noOfNewOffersCreated: newOffers,
  };
}

export async function findBestDiscount(
  em: EntityManager,
  amount: number,
  bankName: string,
  paymentInstrument: string
): Promise<number> {
  const repo = em.getRepository(Offer) as OfferRepository;
  const offer = await repo.findBestDiscount(amount, bankName, paymentInstrument);
  return offer?.discount_amount || 0;
}





// import { EntityManager } from "@mikro-orm/core";
// import { Offer } from "../entities/Offer";
// import { extractBankName, extractPaymentInstrument } from "../utils/parser";

// export async function processOffers(em: EntityManager, body: any) {
//   const offers =
//     body?.flipkartOfferApiResponse?.offer_sections?.PBO?.offers || [];
//   const total = offers.length;

//   const incomingAdjustmentIds = offers.map(
//     (o: any) => o.offer_details.adjustment_id
//   );
//   const existingOffers = await em.find(Offer, {});
//   const existingOffersMap = new Map(
//     existingOffers.map((o) => [o.adjustment_id, o])
//   );

//   const newOffers: Offer[] = [];
//   const reactivatedOffers: Offer[] = [];
//   const expiredOffers: Offer[] = [];

//   for (const o of offers) {
//     const od = o.offer_details;
//     const existing = existingOffersMap.get(od.adjustment_id);

//     if (existing) {
//       // Offer already exists: reactivate if needed
//       if (!existing.is_active) {
//         existing.is_active = true;
//         reactivatedOffers.push(existing);
//       }
//     } else {
//       // New offer
//       const offer = em.create(Offer, {
//         adjustment_id: od.adjustment_id,
//         title: od.title,
//         summary: od.summary,
//         display_text: od.display_text,
//         provider: od.provider,
//         adjustment_type: od.adjustment_type,
//         adjustment_sub_type: od.adjustment_sub_type,
//         adjustment_status: o.adjustment_status,
//         discount_amount: od.offer_txn_limits?.max_discount_per_txn / 100,
//         min_txn_value: od.offer_txn_limits?.min_txn_value / 100,
//         max_txn_value: od.offer_txn_limits?.max_txn_value / 100,
//         max_discount_per_txn: od.offer_txn_limits?.max_discount_per_txn / 100,
//         max_discount_per_card:
//           od.offer_aggregation_limits?.max_discount_per_card / 100,
//         max_txns_for_offer: od.offer_aggregation_limits?.max_txns_for_offer,
//         bank_name: extractBankName(o.failure_description),
//         payment_instrument: extractPaymentInstrument(o.failure_description),
//         is_active: true,
//       });
//       newOffers.push(offer);
//     }
//   }

//   // Expire missing offers
//   for (const existing of existingOffers) {
//     if (
//       !incomingAdjustmentIds.includes(existing.adjustment_id) &&
//       existing.is_active
//     ) {
//       existing.is_active = false;
//       expiredOffers.push(existing);
//     }
//   }

//   // Persist all new offers
//   if (newOffers.length) em.persist(newOffers);

//   // All changes will be flushed at once
//   await em.flush();

//   return {
//     noOfOffersIdentified: total,
//     noOfNewOffersCreated: newOffers.length,
//     noOfOffersReactivated: reactivatedOffers.length,
//     noOfOffersMarkedExpired: expiredOffers.length,
//   };
// }

// export async function findBestDiscount(
//   em: EntityManager,
//   amount: number,
//   bankName: string,
//   paymentInstrument: string
// ): Promise<number> {
//   const offer = await em.findOne(
//     Offer,
//     {
//       bank_name: { $ilike: bankName },
//       payment_instrument: { $ilike: paymentInstrument },
//       min_txn_value: { $lte: amount },
//       max_txn_value: { $gte: amount },
//       is_active: true,
//     },
//     {
//       orderBy: { discount_amount: 'desc' },
//     }
//   );

//   return offer?.discount_amount || 0;
// }
