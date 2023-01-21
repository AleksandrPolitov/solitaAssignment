import { Request, Response, NextFunction, response } from 'express';

import StationModel from "../models/station"
import JourneyModel from "../models/journey"

const getStations = async (req: Request, res: Response, next: NextFunction) => {
    let count = await StationModel.count({});

    let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
    let limit: number = req.query.limit ? Math.min(Math.max(parseInt(req.query.limit as string), 1), 100) : 50
    let sortBy: string = req.query.sortBy ? req.query.sortBy as string : "departureDate"
    let sortAsc: boolean = req.query.sortAsc ? ((req.query.sortAsc as string).toLowerCase() == 'true' ? true : false) : true

    let stations = await StationModel.paginate({}, { page: page, limit: limit, sort: { [sortBy]: sortAsc ? 1 : -1 } });
    res.send({ count: count, res: stations.docs })
}

const getStation = async (req: Request, res: Response, next: NextFunction) => {
    let id: String = req.params.id ? req.params.id as string : null;
    if (!id) return res.send(404);

    let station = await StationModel.findById(id);

    let departuresFromStation = await JourneyModel.find({ departureStationId: id });
    let returnsToStation = await JourneyModel.find({ returnStationId: id });

    res.status(200).send({ station: station, departures: departuresFromStation, returns: returnsToStation });
}

const createStation = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    let _id: number = req.body._id ? parseInt(req.body._id) : null;
    let nimi: string = req.body.nimi;
    let namn: string = req.body.name;
    let name: string = req.body.name;
    let osoite: string = req.body.osoite;
    let adress: string = req.body.adress;
    let kaupunki: string = req.body.kaupunki;
    let stad: string = req.body.stad;
    let operaattor: string = req.body.operaattor;
    let kapasiteet: string = req.body.kapasiteet;
    let xPos: number = req.body.xPos;
    let yPos: number = req.body.yPos;

    if (!_id || !nimi || !xPos || !yPos) 
        return res.send(400);

    const newStation = new StationModel({
        _id: _id,
        nimi: nimi,
        namn: namn,
        name: name,
        osoite: osoite,
        adress: adress,
        kaupunki: kaupunki,
        stad: stad,
        operaattor: operaattor,
        kapasiteet: kapasiteet,
        xPos: xPos,
        yPos: yPos
    });

    try {
        let newStationRes = await newStation.save();
        return res.send({ station: newStationRes });
    } catch (e) {
        switch (e.code) {
            case 11000:
                return res.status(400).send({err: "Already exists!"})
        }
    }
}



export default { getStations, getStation, createStation, };