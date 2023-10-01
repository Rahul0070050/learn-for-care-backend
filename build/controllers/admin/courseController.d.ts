import { Request, Response } from "express";
export declare const courseController: {
    createCourse: (req: Request, res: Response) => Promise<unknown>;
    getCourseById: (req: Request, res: Response) => void;
};
