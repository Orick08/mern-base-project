import { Express, Request, Response } from "express";
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from "../controllers/product.controller";
import {
  createSenssionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "../controllers/session.controller";
import { createUserHandler } from "../controllers/user.controller";
import { requireUser } from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createProductSchema,
  deleteProductSchema,
  getProdcutSchema,
  updateProductSchema,
} from "../schema/product.schema";
import { createSessionSchema } from "../schema/session.schema";
import { createUserSchema } from "../schema/user.schema";
import { createProduct } from "../services/product.service";

function routes(app: Express) {
  app.get("/", (req: Request, res: Response) => {
    res.json("ok");
  });

  app.post("/api/users", validateResource(createUserSchema), createUserHandler);
  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createSenssionHandler
  );
  app.get("/api/sessions", requireUser, getUserSessionsHandler);
  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  // ---- Products routes ------
  app.post(
    "/api/products",
    [requireUser, validateResource(createProductSchema)],
    createProductHandler
  );
  app.put(
    "/api/products/:productId",
    [requireUser, validateResource(updateProductSchema)],
    updateProductHandler
  );
  app.get(
    "/api/products/:productId",
    validateResource(getProdcutSchema),
    getProductHandler
  );
  app.delete(
    "/api/products/:productId",
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler
  );
}

export default routes;
