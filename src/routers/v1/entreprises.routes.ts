import { Router } from "express";
import { createEntreprisesController } from "@/controllers/entreprises.controller";
import { ServiceDependencies } from "@/types/dependencies";
import { ApiRoute } from "@/enums";

export function createEntreprisesRouter(dependencies: ServiceDependencies): Router {
  const router = Router();
  const controller = createEntreprisesController(dependencies);

  router.post("/", controller.createEntreprise);
  router.get("/", controller.getAllEntreprises);
  router.get("/:id", controller.getOneEntrepriseById);
  router.post(`/:id${ApiRoute.PROJETS}`, controller.createProjet);
  router.get(`/:id${ApiRoute.PROJETS}`, controller.getProjetsByEntreprise);
  router.get(`/:id${ApiRoute.PROJETS}/:projetId${ApiRoute.CANDIDATS_COMPATIBLES}`, controller.getCandidatsCompatibles);

  return router;
}
