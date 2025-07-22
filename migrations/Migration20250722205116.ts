import { Migration } from "@mikro-orm/migrations";

export class Migration20250722205116 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "bank" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "ifsc_code" varchar(255) null, "logo_url" varchar(255) null, constraint "bank_pkey" primary key ("id"));`
    );

    this.addSql(
      `create table "offer_banks" ("offer_id" uuid not null, "bank_id" uuid not null, constraint "offer_banks_pkey" primary key ("offer_id", "bank_id"));`
    );

    this.addSql(
      `alter table "offer_banks" add constraint "offer_banks_offer_id_foreign" foreign key ("offer_id") references "offer" ("id") on update cascade on delete cascade;`
    );
    this.addSql(
      `alter table "offer_banks" add constraint "offer_banks_bank_id_foreign" foreign key ("bank_id") references "bank" ("id") on update cascade on delete cascade;`
    );

    this.addSql(`alter table "offer" drop column "bank_name";`);

    this.addSql(`alter table "offer" add column "emi_months" text[] null;`);
    this.addSql(
      `alter table "offer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`
    );
    this.addSql(`alter table "offer" alter column "updated_at" set not null;`);
    this.addSql(`ALTER TABLE "offer"
                 ALTER COLUMN "payment_instrument" TYPE text[]
                 USING (
                  CASE
                    WHEN "payment_instrument" = '' THEN NULL
                    ELSE string_to_array("payment_instrument", ',')
                  END
                );
`);
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "offer_banks" drop constraint "offer_banks_bank_id_foreign";`
    );

    this.addSql(`drop table if exists "bank" cascade;`);

    this.addSql(`drop table if exists "offer_banks" cascade;`);

    this.addSql(`alter table "offer" drop column "emi_months";`);

    this.addSql(
      `alter table "offer" add column "bank_name" varchar(255) null;`
    );
    this.addSql(
      `alter table "offer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`
    );
    this.addSql(`alter table "offer" alter column "updated_at" drop not null;`);
    this.addSql(
      `alter table "offer" alter column "payment_instrument" type varchar(255) using ("payment_instrument"::varchar(255));`
    );
  }
}
