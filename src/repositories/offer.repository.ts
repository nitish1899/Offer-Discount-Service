// repositories/offer.repository.ts
import { EntityRepository, EntityManager } from "@mikro-orm/postgresql";
import { RequiredEntityData } from "@mikro-orm/postgresql";
import { Offer } from "../entities/offer.entity";

export class OfferRepository extends EntityRepository<Offer> {
  constructor(em: EntityManager) {
    super(em, Offer);
  }

  async findBestDiscount(amount: number, bank: string, instrument: string) {
    return this.findOne(
      {
        bank_name: { $ilike: bank },
        payment_instrument: { $ilike: instrument },
        min_txn_value: { $lte: amount },
        max_txn_value: { $gte: amount },
        is_active: true,
      },
      { orderBy: { discount_amount: "desc" } }
    );
  }

  async existsByAdjustmentId(adjustment_id: string) {
    return this.findOne({ adjustment_id });
  }

  async createOffer(data: RequiredEntityData<Offer>) {
    const offer = this.create(data);
    this.em.persist(offer); // Use internal EntityManager
    return offer;
  }

  async markInactiveByMissingAdjustmentIds(knownAdjustmentIds: string[]) {
    const offers = await this.find({ is_active: true });
    const expiredOffers = offers.filter(
      (o) => !knownAdjustmentIds.includes(o.adjustment_id)
    );

    for (const offer of expiredOffers) {
      offer.is_active = false;
    }

    return expiredOffers;
  }
}
