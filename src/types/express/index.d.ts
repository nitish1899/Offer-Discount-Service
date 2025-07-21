// src/types/express/index.d.ts

import { EntityManager } from '@mikro-orm/core';

declare global {
  namespace Express {
    interface Request {
      orm: EntityManager;
    }
  }
}
