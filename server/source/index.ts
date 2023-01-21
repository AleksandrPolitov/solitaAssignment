import * as express from "express";
import * as mongoose from 'mongoose';
import * as dotenv from "dotenv"

import { JourneyModel, Journey } from "./models/journey"
import {getJourneys} from "./controllers/journey"

dotenv.config({ path: __dirname+'/../.env' })

const app: express.Express = express();
const port = process.env.PORT;


main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.DB_CONN_STRING);
}

// app.get('/', (req: express.Request, res: express.Response) => {
//     JourneyModel.count({}, function(err, count){
//         res.send({ amount: count })
//     })
// });

app.get('/', getJourneys)

app.get('/journeys', (req, res) => {
    res.json(200);
});

function paginatedResults(model) {
    // middleware function
    return (req, res, next) => {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
   
      // calculating the starting and ending index
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
   
      const results:any = {};
      if (endIndex < model.length) {
        results.next = {
          page: page + 1,
          limit: limit
        };
      }
   
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        };
      }
   
      results.results = model.slice(startIndex, endIndex);
   
      res.paginatedResults = results;
      next();
    };
}

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});