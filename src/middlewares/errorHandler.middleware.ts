import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@/enums';

export const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    if (res.jsonError) {
        res.jsonError(err.message || 'Erreur interne du serveur', HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message || 'Erreur interne du serveur' });
    }
};
