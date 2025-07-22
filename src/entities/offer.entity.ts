import {
  Entity,
  Property,
  Unique,
  ManyToMany,
  Collection,
} from "@mikro-orm/core";
import { BaseEntity } from "../base.entity";
import { Bank } from "./bank.entity";

@Entity()
export class Offer extends BaseEntity {
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
  adjustment_sub_type!: string;

  @Property()
  adjustment_type!: string;

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

  @Property({ type: "text[]", nullable: true })
  payment_instrument?: string[];

  @Property({ type: "text[]", nullable: true })
  emi_months?: string[];

  @ManyToMany(() => Bank, (bank) => bank.offers, { owner: true })
  banks = new Collection<Bank>(this);

  @Property({ default: true })
  is_active!: boolean;

  constructor(data: Partial<Offer> = {}) {
    super();
    Object.assign(this, data);
  }
}
