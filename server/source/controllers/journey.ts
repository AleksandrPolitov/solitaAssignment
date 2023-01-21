import { Request, Response, NextFunction, response } from 'express';

import { JourneyModel, Journey } from "../models/journey"

export const getJourneys = async (req: Request, res: Response, next: NextFunction) => {
    let count=-1;
    JourneyModel.count({}, function (err, res) {
        if (res == -1 || err) res.send(404);
        count = res;
    })

    let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
    let limit: number = req.query.limit ? Math.min(Math.max(parseInt(req.query.limit as string), 1), 100) : 50
    let sortBy: string = req.query.sortBy ? req.query.sortBy as string : "departureDate"
    let sortAsc: boolean = req.query.sortAsc ? ((req.query.sortAsc as string).toLowerCase() == 'true' ? true : false) : true

    console.log("page", page)

    JourneyModel.paginate({}, { page: page, limit: limit, sort: { [sortBy]: sortAsc ? 1 : -1 } }).then(function (result) {
        res.send({ count: count, res: result.docs })
    });
}

export const getJourney = async (req: Request, res: Response, next: NextFunction) => {
    let id: number = req.params.id ? parseInt(req.query.page as string) : 1;

    JourneyModel.find({})
}