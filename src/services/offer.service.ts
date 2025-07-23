import { EntityManager } from "@mikro-orm/core";
import { Offer } from "../entities/offer.entity";
import _ from "lodash";
import { Bank } from "../entities/bank.entity";

export class OfferService {
  constructor(private readonly em: EntityManager) {}

  async processOffers(body: any) {
    const flipkartResponse = {
      offer_sections: body?.flipkartOfferApiResponse.offer_sections,
      options: body?.flipkartOfferApiResponse.options,
    };

    const pboOffers = _.get(flipkartResponse, "offer_sections.PBO.offers", {});

    // Get all adjustment_ids from PBO offers
    const incomingOffers: { adjustment_id: string; [key: string]: unknown }[] =
      Object.entries(pboOffers).map(([adjustment_id, offerObj]) => {
        return {
          adjustment_id,
          ...(typeof offerObj === "object" && offerObj !== null
            ? offerObj
            : {}),
        };
      });

    const mergedOffers = incomingOffers.map((offerObj) => {
      const adjustment_id = offerObj.adjustment_id;
      // Search through all adjustment_list entries inside options to find matching offer_details.adjustment_id
      const adjustmentList = _.flatMap(flipkartResponse.options, (option) =>
        _.get(option, "adjustments.adjustment_list", [])
      );

      const matchingAdjustment = _.find(
        adjustmentList,
        (adj) => _.get(adj, "offer_details.adjustment_id") === adjustment_id
      );

      // Merge PBO offer + offer_details (if found)
      const merged = {
        ...(offerObj ?? {}),
        ..._.get(matchingAdjustment, "offer_details", {}),
        adjustment_status: matchingAdjustment?.adjustment_status || null,
        amount_delta: matchingAdjustment?.amount_delta || null,
      };

      return merged;
    });

    const incomingAdjustmentIds = mergedOffers.map((o: any) => o.adjustment_id);

    // Fetch only the offers that already exist in DB
    const existingOffers = await this.em.find(Offer, {
      adjustment_id: {
        $in: incomingAdjustmentIds,
      },
    });

    const existingOffersMap = new Map(
      existingOffers.map((o) => [o.adjustment_id, o])
    );

    const banks = await this.em.find(Bank, {}); // Fetch all banks once
    const banksMap = new Map(banks.map((b) => [b.name.toLowerCase(), b]));

    const newOffers: Offer[] = [];
    const reactivatedOffers: Offer[] = [];
    const expiredOffers: Offer[] = [];

    for (const od of mergedOffers) {
      const existing = existingOffersMap.get(od.adjustment_id);

      // Attempt to match multiple banks
      const matchedBanks =
        od.contributors?.banks && od.contributors.banks.length > 0
          ? od.contributors.banks
              .map((bank: string) => banksMap.get(bank.toLowerCase()))
              .filter((b: string) => b !== undefined) // filter out unmatched ones
          : [];

      if (existing) {
        // Offer already exists: reactivate if needed
        if (!existing.is_active) {
          existing.is_active = true;
          reactivatedOffers.push(existing);
        }
      } else {
        // New offer
        const offer = new Offer({
          adjustment_id: od.adjustment_id,
          title: od.title,
          adjustment_sub_type: od.adjustment_type,
          summary: od.summary,
          display_text: od.display_tags,
          provider: od.provider,
          adjustment_type: od.adjustment_sub_type,
          adjustment_status: od.adjustment_status,
          discount_amount: od.offer_txn_limits?.max_discount_per_txn / 100,
          min_txn_value: od.offer_txn_limits?.min_txn_value / 100,
          max_txn_value: od.offer_txn_limits?.max_txn_value / 100,
          max_discount_per_txn: od.offer_txn_limits?.max_discount_per_txn / 100,
          max_discount_per_card:
            od.offer_aggregation_limits?.max_discount_per_card / 100,
          max_txns_for_offer: od.offer_aggregation_limits?.max_txns_for_offer,
          payment_instrument:
            od.contributors.payment_instrument &&
            od.contributors.payment_instrument.length > 0
              ? od.contributors.payment_instrument.map((pi: string) => pi)
              : [],
          emi_months:
            od.contributors.emi_months && od.contributors.emi_months.length > 0
              ? od.contributors.emi_months.map((em: string) => em)
              : [],
          is_active: true,
        });

        offer.banks.set(matchedBanks);

        newOffers.push(offer);
      }
    }

    if (Array.isArray(existingOffers)) {
      for (const existing of existingOffers) {
        if (
          existing.adjustment_id &&
          !incomingAdjustmentIds.includes(existing.adjustment_id) &&
          existing.is_active
        ) {
          existing.is_active = false;
          expiredOffers.push(existing);
        }
      }
    }

    // Persist all new offers
    if (newOffers.length) this.em.persist(newOffers);

    // All changes will be flushed at once
    await this.em.flush();

    return {
      noOfOffersIdentified: mergedOffers.length,
      noOfNewOffersCreated: newOffers.length,
      noOfOffersReactivated: reactivatedOffers.length,
      noOfOffersMarkedExpired: expiredOffers.length,
    };
  }

  async findBestDiscount(
    amount: number,
    bankName: string,
    paymentInstrument: string
  ): Promise<number> {
    const offer = await this.em.findOne(
      Offer,
      {
        banks: {
          name: { $ilike: bankName }, // Match bank by name (case-insensitive)
        },
        payment_instrument: { $in: [paymentInstrument] },
        max_txn_value: { $gte: amount },
        is_active: true,
      },
      {
        populate: ["banks"],
        orderBy: { discount_amount: "desc" },
      }
    );

    return offer?.discount_amount || 0;
  }
}
