require('chai').should();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const UserAccess = require('../../src/model/UserAccess');

const UserRepository = require('../../src/repositories/UserRepository');
const DocumentRepository = require('../../src/repositories/DocumentRepository');

describe('UserAccess model', function () {
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

    it('should not save without user and document', function () {
        return new UserAccess().save();
    });

    it('should save when everything is right', function () {
        return UserRepository.createUser({
            username: 'username',
            email: 'email',
            password: 'hash'
        }).then((user) => {
            return DocumentRepository.createDocument(user).then((document) => {
                return new UserAccess({
                    user: user,
                    document: document
                }).save();
            });
        });
    });

    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(done);
        });
    });
});