import * as express from "express";
import * as dotenv from "dotenv"
import * as cors from "cors"

import JourneyController from "./controllers/journey";
import StationController from "./controllers/station";

dotenv.config({ path: __dirname + '/../../.env' })

const initConnection = require('./db/connection')

const app: express.Express = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log(process.env.DB_CONN_STRING)


initConnection(function () {
  app.get('/journeys', JourneyController.getJourneys)
  app.get('/journeys/:id', JourneyController.getJourney)
  app.post('/journeys', JourneyController.createJourney)

  app.get('/stations/', StationController.getStations)
  app.get('/stations/:id', StationController.getStation)
  app.post('/stations', StationController.createStation)

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
})

