import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity()
export class Offer {
  @Property()
  @Unique()
  adjustment_id!: string;

  @Property()
  title!: string;

  @Property()
  summary!: string;

  @Property()
  display_text!: string;

  @Property()
  provider!: string;

  @Property()
  adjustment_type!: string;

  @Property()
  adjustment_sub_type!: string;

  @Property()
  adjustment_status!: string;

  @Property()
  discount_amount!: number;

  @Property()
  min_txn_value!: number;

  @Property()
  max_txn_value!: number;

  @Property()
  max_discount_per_txn!: number;

  @Property({ nullable: true })
  max_discount_per_card?: number;

  @Property({ nullable: true })
  max_txns_for_offer?: number;

  @Property({ nullable: true })
  payment_instrument?: string;

  @Property({ nullable: true })
  bank_name?: string;

  @Property({ default: true })
  is_active!: boolean;
}
