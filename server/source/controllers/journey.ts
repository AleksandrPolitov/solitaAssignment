import { Request, Response, NextFunction, response } from 'express';

import JourneyModel from "../models/journey"
import StationModel from "../models/station"

// GET REQUESTS
const getJourneys = async (req: Request, res: Response, next: NextFunction) => {
    let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
    let limit: number = req.query.limit ? Math.min(Math.max(parseInt(req.query.limit as string), 1), 100) : 50;
    let sortBy: string = req.query.sortBy ? req.query.sortBy as string : "departureDate";
    let sortAsc: boolean = req.query.sortAsc ? ((req.query.sortAsc as string).toLowerCase() == 'true' ? true : false) : false;

    res.send(await JourneyModel.paginate({}, { page: page, limit: limit, sort: { [sortBy]: sortAsc ? 1 : -1 } }));
}

const getJourney = async (req: Request, res: Response, next: NextFunction) => {
    let id: String = req.params.id ? req.params.id as string : null;
    if (!id) return res.send(404); 

    const journey = await JourneyModel.findById(id);

    console.log(journey)

    res.send({
        journey: journey,
        stations:
        {
            departure: await StationModel.findById(journey.departureStationId),
            return: await StationModel.findById(journey.returnStationId)
        }
    })
}

const getJourneyByStationId = async (req: Request, res: Response, next: NextFunction) => {
    let id: String = req.params.id ? req.params.id as string : null;
    if (!id) return res.send(404);

    res.send(await JourneyModel.findById(id));
}


const createJourney = async (req: Request, res: Response, next: NextFunction) => {
    let departureDate: Date = req.body.departureDate ? new Date(req.body.departureDate) : null;
    let returnDate: Date = req.body.returnDate ? new Date(req.body.returnDate) : null;
    let departureStationId: number = req.body.departureStationId;
    let returnStationId: number = req.body.departureStationId;
    let distance: number = req.body.distance;
    let duration: number = req.body.duration;

    if(!departureDate || !returnDate || !departureStationId || !returnStationId || !distance || !duration)
        return res.send(400);
    
    let newJourney = new JourneyModel({
        departureDate: departureDate,
        returnDate: returnDate,
        departureStationId: departureStationId,
        returnStationId: returnStationId,
        distance: distance,
        duration: duration
    });

    try {
        let newJourneyRes = await newJourney.save();
        return res.send({ journey: newJourneyRes });
    } catch (e) {
        switch (e.code) {
            case 11000:
                return res.status(400).send({ err: "Already exists!" });
        }
    }
}


export default { getJourneys, getJourney, getJourneyByStationId, createJourney };