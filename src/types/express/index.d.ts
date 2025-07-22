// src/types/express.d.ts
import { EntityManager } from "@mikro-orm/core";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    orm: EntityManager;
  }
}
