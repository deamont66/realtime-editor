require('chai').should();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Operation = require('../../src/model/Operation');

const UserRepository = require('../../src/repositories/UserRepository');
const DocumentRepository = require('../../src/repositories/DocumentRepository');

describe('Operation model', function () {
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

    it('should not save without user and document', function (done) {
        const operation = new Operation({});
        operation.save(err => {
            if (err) {
                return done();
            }
            throw new Error('Should generate error!');
        });
    });

    it('should save when everything is right', function () {
        return UserRepository.createUser({
            username: 'username',
            email: 'email',
            password: 'hash'
        }).then((user) => {
            return DocumentRepository.createDocument(user).then((document) => {
                return new Operation({
                    author: user,
                    document: document,
                    revision: 11,
                    operations: 'jsonString'
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