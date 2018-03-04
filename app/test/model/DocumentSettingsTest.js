require('chai').should();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const DocumentSettings = require('../../src/model/DocumentSettings');

describe('DocumentSettings model', function () {
    before(function (done) {
        mongoose.connect('mongodb://localhost/testDB', {
            useMongoClient: true
        });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function () {
            done();
        });
    });


    it('should save when everything is right', function () {
        return new DocumentSettings().save();
    });

    describe('toJSON', function () {
        it('should remove all private data', function () {
            return new DocumentSettings().save().then((settings) => {
                const jsonObject = settings.toJSON();
                jsonObject.should.not.have.property('_id');
                jsonObject.should.not.have.property('__v');

                jsonObject.should.have.property('theme');
                jsonObject.should.have.property('mode');
                jsonObject.should.have.property('tabSize');
                jsonObject.should.have.property('indentUnit');
                jsonObject.should.have.property('indentWithTabs');
                jsonObject.should.have.property('fontSize');
                jsonObject.should.have.property('keyMap');
                jsonObject.should.have.property('styleActiveLine');
                jsonObject.should.have.property('lineWrapping');
                jsonObject.should.have.property('lineNumbers');
            });
        });
    });

    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(done);
        });
    });
});