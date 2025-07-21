import {
  PrimaryKey,
  Property,
  Entity,
} from '@mikro-orm/core';

import { v4 as uuidv4 } from 'uuid';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ type: 'timestamptz', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'timestamptz', onUpdate: () => new Date(), nullable: true })
  updatedAt: Date = new Date();
}
