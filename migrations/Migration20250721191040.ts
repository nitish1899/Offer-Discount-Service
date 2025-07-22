import { Migration } from '@mikro-orm/migrations';

export class Migration20250721191040 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "offer" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "adjustment_id" varchar(255) not null, "title" varchar(255) not null, "summary" varchar(255) not null, "display_text" varchar(255) not null, "provider" varchar(255) not null, "adjustment_type" varchar(255) not null, "adjustment_sub_type" varchar(255) not null, "adjustment_status" varchar(255) not null, "discount_amount" int not null, "min_txn_value" int not null, "max_txn_value" int not null, "max_discount_per_txn" int not null, "max_discount_per_card" int null, "max_txns_for_offer" int null, "payment_instrument" varchar(255) null, "bank_name" varchar(255) null, "is_active" boolean not null default true, constraint "offer_pkey" primary key ("id"));`);
    this.addSql(`alter table "offer" add constraint "offer_adjustment_id_unique" unique ("adjustment_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "offer" cascade;`);
  }

}
