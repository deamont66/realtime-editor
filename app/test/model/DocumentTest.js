const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Document = require('../../src/model/Document');

describe('Document model', function () {
    before(function (done) {
        mongoose.connect('mongodb://localhost/testDB', {
            useMongoClient: true
        });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function () {
            console.log('We are connected to test database!');
            done();
        });
    });

    it('should not save without owner and documentSettings', function (done) {
        const doc = Document({});
        doc.save(err => {
            if (err) {
                return done();
            }
            throw new Error('Should generate error!');
        });
    });

    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(done);
        });
    });
});