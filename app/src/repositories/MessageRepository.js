const Message = require('../model/Message');

const getLastMessages = (document, lastDate = new Date(), number = 10) => {
    return Message.find({document: document, date: {$lte: lastDate}})
        .sort('-date')
        .populate('user')
        .select('-document')
        .limit(number)
        .exec();
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
