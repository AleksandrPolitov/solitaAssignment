import { Request, Response, NextFunction, response } from 'express';
const async = require('async');

import StationModel from "../models/station"
import JourneyModel from "../models/journey"

const getStations = async (req: Request, res: Response, next: NextFunction) => {
    let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
    let limit: number = req.query.limit ? Math.min(Math.max(parseInt(req.query.limit as string), 1), 100) : 50
    let sortBy: string = req.query.sortBy ? req.query.sortBy as string : "departureDate"
    let sortAsc: boolean = req.query.sortAsc ? ((req.query.sortAsc as string).toLowerCase() == 'true' ? true : false) : true

    res.send(await StationModel.paginate({}, { page: page, limit: limit, sort: { [sortBy]: sortAsc ? 1 : -1 } }));
}

const getStation = async (req: Request, res: Response, next: NextFunction) => {
    let id: string = req.params.id ? req.params.id as string : null;
    if (!id) return res.send(404);

    const start = performance.now();


    async.parallel([
        function(callback) {
            StationModel.findById(id, callback);
        },
        function(callback) {
            JourneyModel.find({ departureStationId: id }).limit(50).sort({departureDate: -1}).exec(callback);
        },
        function(callback) {
            JourneyModel.find({ returnStationId: id }).limit(50).sort({ departureDate: -1 }).exec(callback);
        },
        function(callback) {
            JourneyModel.count({ departureStationId: id }).exec(callback);
        },
        function(callback) {
            JourneyModel.count({ returnStationId: id }).exec(callback);
        },
        function(callback) {
            JourneyModel.aggregate([
                {
                    $match: {
                        departureStationId: parseInt(id)
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgDistance: { $avg: '$distance' }
                    }
                }
            ]).exec(callback);
        },
        function(callback) {
            JourneyModel.aggregate([
                {
                    $match: {
                        returnStationId: parseInt(id)
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgDistance: { $avg: '$distance' }
                    }
                }
            ]).exec(callback);
        },
        function(callback) {
            JourneyModel.aggregate([
                { $match: { returnStationId: parseInt(id) } },
                { $group: { _id: "$departureStationId", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]).exec(callback);
        },
        function(callback) {
            JourneyModel.aggregate([
                { $match: { departureStationId: parseInt(id) } },
                { $group: { _id: "$returnStationId", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]).exec(callback);
        }
    ],
        function (err, results) {
            if (err) {
                console.log(err);
                return;
            }
            const end = performance.now();
            console.log("Time taken: ", end - start);
            res.status(200).send({
                station: results[0],
                departures: results[1],
                returns: results[2],
                departuresCount: results[3],
                returnsCount: results[4],
                avgDistanceDeparture: results[5][0].avgDistance.toFixed(2),
                avgDistanceReturn: results[6][0].avgDistance.toFixed(2),

            })
        })
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