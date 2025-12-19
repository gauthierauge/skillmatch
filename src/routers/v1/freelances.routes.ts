import { Router } from "express";
import { createFreelancesController } from "@/controllers/freelances.controller";
import { ServiceDependencies } from "@/types/dependencies";
import { ApiRoute } from "@/enums";

export function createFreelancesRouter(dependencies: ServiceDependencies): Router {
    const router = Router();
    const controller = createFreelancesController(dependencies);

    router.post("/", controller.createFreelance);
    router.get("/", controller.getAllFreelances);
    router.get("/:id", controller.getOneFreelanceById);
    router.get(`/:id${ApiRoute.PROJETS_COMPATIBLES}`, controller.getProjetsCompatibles);
    router.post(`/:id${ApiRoute.POSTULER}`, controller.postulerProjet);

    return router;
}
