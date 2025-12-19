import { NextFunction, Request, Response } from "express";
import { HttpStatus, ResponseField } from "@/enums";

export interface JsonApiResponse {
    [ResponseField.SUCCESS]: boolean;
    [ResponseField.DATA]: any;
    [ResponseField.ERROR]?: {
        [ResponseField.MESSAGE]: string;
        [ResponseField.CODE]: number;
    };
}

declare module 'express-serve-static-core' {
    interface Response {
        jsonSuccess(data: any, statusCode?: number): void;
        jsonError(error: any, statusCode?: number): void;
    }
}

export const jsonApiResponseMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.jsonSuccess = (data: any, statusCode: number = HttpStatus.OK) => {
        const response: JsonApiResponse = {
            [ResponseField.SUCCESS]: true,
            [ResponseField.DATA]: data
        };
        res.status(statusCode).json(response);
    }

    res.jsonError = (error: any, statusCode: number = HttpStatus.BAD_REQUEST) => {
        const response: JsonApiResponse = {
            [ResponseField.SUCCESS]: false,
            [ResponseField.DATA]: null,
            [ResponseField.ERROR]: {
                [ResponseField.MESSAGE]: error,
                [ResponseField.CODE]: statusCode
            }
        };
        res.status(statusCode).json(response);
    }

    next();
};
