const Message = require('../model/Message');

const getLastMessages = (document, lastDate, number = 10) => {
    if(!lastDate) lastDate = new Date();
    return Message.find({document: document, date: {$lte: lastDate}})
        .sort('-date')
        .populate('user')
        .select('-document')
        .limit(number)
        .exec().then((messages) => messages.reverse());
};

const createMessage = (document, user, message) => {
    return new Message({
        document: document,
        user: user,
        message: message
    }).save();
};

module.exports = {
    getLastMessages: getLastMessages,
    createMessage: createMessage
};
