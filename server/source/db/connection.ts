var mongoose = require('mongoose')
import * as dotenv from "dotenv"

dotenv.config({ path: __dirname + '/../../../.env' })

module.exports = function initConnection(callback) {
    mongoose.connect(process.env.DB_CONN_STRING, {});
    var db = mongoose.connection;
    db.on('error', function (err) {
      console.error(err);
      process.exit(1);
    });
  
    db.once('open', function () {
      console.info("Connected to database");
      callback();
    });
};