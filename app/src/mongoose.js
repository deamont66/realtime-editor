const mongoose = require('mongoose');
const debug = require('debug')('editor:mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_DB_URI, {
    useMongoClient: true
}).catch(err => debug(err));
