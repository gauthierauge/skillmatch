import { Request, Response, NextFunction } from "express";
import { ServiceDependencies } from "@/types/dependencies";
import { HttpStatus, ErrorMessage } from "@/enums";
import { ValidationUtil } from "@/utils";

export const createEntreprisesController = (dependencies: ServiceDependencies) => {
  const createEntreprise = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const entreprise = await dependencies.entreprisesService.createEntreprise(req.body);
      return res.jsonSuccess(entreprise, HttpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  };

  const getAllEntreprises = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const entreprises = await dependencies.entreprisesService.getAllEntreprises();
      return res.jsonSuccess(entreprises, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  const getOneEntrepriseById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const id = ValidationUtil.parseId(req.params.id);
      const entreprise = await dependencies.entreprisesService.getEntrepriseById({ id });

      if (!entreprise) {
        return res.jsonError(ErrorMessage.ENTREPRISE_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      return res.jsonSuccess(entreprise, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  const createProjet = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const entrepriseId = ValidationUtil.parseId(req.params.id);
      const projet = await dependencies.entreprisesService.createProjet({
        entrepriseId,
        data: req.body,
      });
      return res.jsonSuccess(projet, HttpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  };

  const getProjetsByEntreprise = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const entrepriseId = ValidationUtil.parseId(req.params.id);
      const projets = await dependencies.entreprisesService.getProjetsByEntreprise({ entrepriseId });
      return res.jsonSuccess(projets, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  const getCandidatsCompatibles = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const entrepriseId = ValidationUtil.parseId(req.params.id);
      const projetId = ValidationUtil.parseId(req.params.projetId);

      const candidats = await dependencies.entreprisesService.getCandidatsCompatibles({
        entrepriseId,
        projetId,
      });

      return res.jsonSuccess(candidats, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  const getProjetsOuverts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const projets = await dependencies.entreprisesService.getProjetsOuverts();
      return res.jsonSuccess(projets, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  return {
    createEntreprise,
    getAllEntreprises,
    getOneEntrepriseById,
    createProjet,
    getProjetsByEntreprise,
    getCandidatsCompatibles,
    getProjetsOuverts,
  };
};
