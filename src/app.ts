import express from "express";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config";
import offerRoutes from "./routes/offer.routes";
import { errorHandler } from "./utils/errorHandler";
import compression from "compression";
import bankRoutes from "./routes/bank.routes";

export const startServer = async () => {
  const app = express();
  const orm = await MikroORM.init(mikroOrmConfig);

  app.use(
    compression({
      threshold: 0, // Compress everything
    })
  );

  app.use(express.json());

  app.use((req, res, next) => {
    req.orm = orm.em.fork(); // Now TypeScript won't complain
    next();
  });

  app.use("/api/offer", offerRoutes);
  app.use("/api/banks", bankRoutes);

  app.use(errorHandler);
  app.listen(process.env.PORT, () =>
    console.log("Server running on http://localhost:5000")
  );
};
