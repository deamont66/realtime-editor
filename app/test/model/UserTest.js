require('chai').should();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('../../src/model/User');
const DocumentSettings = require('../../src/model/DocumentSettings');
const UserRepository = require('../../src/repositories/UserRepository');

describe('User model', function () {
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

    it('should not save without documentSettings', function (done) {
        const user = new User({});
        user.save(err => {
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
        });
    });

    describe('toJSON', function () {
        it('should remove all private data', function () {
            return UserRepository.createUser({
                username: 'username',
                email: 'email',
                password: 'hash'
            }).then((user) => {
                const jsonObject = user.toJSON();
                jsonObject.should.not.have.property('password');
                jsonObject.should.not.have.property('defaultSettings');
                jsonObject.should.not.have.property('recoverHash');
                jsonObject.should.not.have.property('recoverEnd');

                jsonObject.should.have.property('username');
                jsonObject.should.have.property('email');
                jsonObject.should.have.property('lastLogin');
            });
        });
    });

    describe('validatePassword/authenticate', function () {
       it('should validate with correct password', function () {
           return UserRepository.createUser({
               username: 'username',
               email: 'email',
               password: 'hash'
           }).then((user) => {
               return user.authenticate('hash').then((result) => {
                   result.should.equal(true);
               });
           });
       });

       it('should not validate with invalid password', function () {
           return UserRepository.createUser({
               username: 'username',
               email: 'email',
               password: 'hash'
           }).then((user) => {
               return user.authenticate('badHash').then((result) => {
                   result.should.equal(false);
               });
           });
       })
    });

    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(done);
        });
    });
});