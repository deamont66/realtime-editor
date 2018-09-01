const Message = require('../model/Message');

/**
 * Gets number last messages for document before lastDate.
 *
 * @param {ObjectId|String|Document} document
 * @param {Date} lastDate
 * @param {Number} number
 * @return {Promise<Message[]>}
 */
const getLastMessages = (document, lastDate = null, number = 10) => {
    if(!lastDate) lastDate = new Date();
    return Message.find({document: document, date: {$lt: lastDate}})
        .sort('-date')
        .populate('user')
        .select('-document')
        .limit(number)
        .exec().then((messages) => messages.reverse());
};

/**
 * Creates new message in document chat by user.
 *
 * @param {ObjectId|String|Document} document
 * @param {ObjectId|String|User} user
 * @param {String} message
 * @return {*}
 */
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
