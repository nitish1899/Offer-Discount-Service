import { Entity, Property, ManyToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../base.entity";
import { Offer } from "./offer.entity";

@Entity()
export class Bank extends BaseEntity {
  @Property()
  name!: string;

  @Property({ nullable: true })
  ifsc_code?: string;

  @Property({ nullable: true })
  logo_url?: string;

  @ManyToMany(() => Offer, (offer) => offer.banks)
  offers = new Collection<Offer>(this);

  constructor({
    name,
    ifsc_code,
    logo_url,
  }: {
    name: string;
    ifsc_code?: string;
    logo_url?: string;
  }) {
    super();
    this.name = name;
    this.ifsc_code = ifsc_code;
    this.logo_url = logo_url;
  }
}
