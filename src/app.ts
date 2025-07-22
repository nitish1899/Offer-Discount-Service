import express from "express";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config";
import offerRoutes from "./routes/offer.routes";
import { errorHandler } from "./utils/errorHandler";
import compression from "compression";

export const startServer = async () => {
  const app = express();
  const orm = await MikroORM.init(mikroOrmConfig);

  app.use(
    compression({
      threshold: 0, // Compress everything
    })
  );

  app.use(express.json());

  app.use(async (req, res, next) => {
    req.orm = await orm.em.fork(); // Now TypeScript won't complain
    next();
  });

  app.use("/offer", offerRoutes);

  app.use(errorHandler);
  app.listen(process.env.PORT, () =>
    console.log("Server running on http://localhost:5000")
  );
};
