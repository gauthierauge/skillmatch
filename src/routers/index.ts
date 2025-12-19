import { Router } from "express";
import { AppDependencies } from "@/types/dependencies";
import { createV1Router } from "./v1";
import { ApiRoute } from "@/enums";

export function createAppRouter(dependencies: AppDependencies): Router {
  const router = Router();

  router.use(ApiRoute.V1, createV1Router(dependencies.services));

  return router;
}
