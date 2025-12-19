import { Router } from "express";
import { ServiceDependencies } from "@/types/dependencies";
import { createFreelancesRouter } from "./freelances.routes";
import { createEntreprisesRouter } from "./entreprises.routes";
import { createProjetsRouter } from "./projets.routes";
import { ApiRoute } from "@/enums";

export function createV1Router(dependencies: ServiceDependencies): Router {
  const router = Router();

  router.use(ApiRoute.FREELANCES, createFreelancesRouter(dependencies));
  router.use(ApiRoute.ENTREPRISES, createEntreprisesRouter(dependencies));
  router.use(ApiRoute.PROJETS, createProjetsRouter(dependencies));

  return router;
}

export { createV1Router as V1Router };
