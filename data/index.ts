import { parse } from 'csv-parse';
import * as fs from 'fs';
import mongoose from 'mongoose';

interface JourneyData {
    departureDate: Date;
    returnDate: Date;
    departureStationId: number;
    departureStationName: string;
    returnStationId: number;
    returnStationName: string;
    distance: number;
    duration: number;
}

interface Journey extends JourneyData, mongoose.Document {}

const journeySchema = new mongoose.Schema({
    departureDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    departureStationId: { type: Number, required: true },
    departureStationName: { type: String, required: true },
    returnStationId: { type: Number, required: true },
    returnStationName: { type: String, required: true },
    distance: { type: Number, required: true },
    duration: { type: Number, required: true },
});

const JourneyModel = mongoose.model<Journey>('Journey', journeySchema);

const data: JourneyData[] = [];



fs.createReadStream('C:\\Users\\be_ha\\Downloads\\2021-07.csv')
.pipe(parse({from: 2}))
.on('data', (row: JourneyData) => {
    let newData = new JourneyModel({
        departureDate: new Date(row[0]),
        returnDate: new Date(row[1]),
        departureStationId: parseInt(row[2]),
        departureStationName: row[3],
        returnStationId: parseInt(row[4]),
        returnStationName: row[5],
        distance: parseInt(row[6]),
        duration: parseInt(row[7]),
    })
    if (new Date(row[0]) &&
        new Date(row[1] &&
        parseInt(row[2]) &&
        row[3] &&
        parseInt(row[4]) &&
        row[5] &&
        parseInt(row[6]) &&
        parseInt(row[7])))
        data.push(newData);
    // console.log(data.at(-1))
})
.on('end', async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:admin123@solitapreassignment.ps5jtov.mongodb.net/?retryWrites=true&w=majority', {});

        console.log(data.length)

        const filteredData = data.filter(data => data.distance >= 10 && data.duration >= 10);
        
        console.log(filteredData.length)

        // await JourneyModel.deleteMany({});

        await JourneyModel.insertMany(filteredData);

    } catch (error) {
        console.log(error);
    }
});