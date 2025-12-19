import { Router } from "express";
import { createEntreprisesController } from "@/controllers/entreprises.controller";
import { ServiceDependencies } from "@/types/dependencies";
import { ApiRoute } from "@/enums";

export function createProjetsRouter(dependencies: ServiceDependencies): Router {
  const router = Router();
  const controller = createEntreprisesController(dependencies);

  router.get(ApiRoute.PROJETS_OUVERTS, controller.getProjetsOuverts);

  return router;
}
