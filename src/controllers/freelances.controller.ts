import { Request, Response, NextFunction } from "express";
import { ServiceDependencies } from "@/types/dependencies";
import { HttpStatus, ErrorMessage } from "@/enums";
import { ValidationUtil } from "@/utils";

export const createFreelancesController = (dependencies: ServiceDependencies) => {
  const createFreelance = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const freelance = await dependencies.freelancesService.createFreelance(req.body);
      return res.jsonSuccess(freelance, HttpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  };

  const getAllFreelances = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const skillFilter = req.query.skill as string | undefined;
      const freelances = await dependencies.freelancesService.getAllFreelances({ skillFilter });
      return res.jsonSuccess(freelances, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  const getOneFreelanceById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const id = ValidationUtil.parseId(req.params.id);
      const freelance = await dependencies.freelancesService.getFreelanceById({ id });

      if (!freelance) {
        return res.jsonError(ErrorMessage.FREELANCE_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      return res.jsonSuccess(freelance, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  const getProjetsCompatibles = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const freelanceId = ValidationUtil.parseId(req.params.id);
      const projets = await dependencies.freelancesService.getProjetsCompatibles({ freelanceId });
      return res.jsonSuccess(projets, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  const postulerProjet = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const freelanceId = ValidationUtil.parseId(req.params.id);
      const projetId = ValidationUtil.parseId(req.body.projetId);

      const result = await dependencies.freelancesService.postulerProjet({ freelanceId, projetId });

      if (result.success) {
        return res.jsonSuccess(result, HttpStatus.OK);
      } else {
        return res.jsonError(result.message, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      next(error);
    }
  };

  return {
    createFreelance,
    getAllFreelances,
    getOneFreelanceById,
    getProjetsCompatibles,
    postulerProjet,
  };
};
