var Messages = require('./MessageModel');

function getMessages(req, res) {
    Messages.find().exec(function (err, messages) {
        if (err) {
            return res.send(err);
        } else {
            return res.send(messages);
        }
    });
}

function getMessage(req, res) {
    Messages.findOne({ _id: req.params.id }, function (err, message) {
        if (err) {
            return res.send(err);
        }
        return res.send(message);
    });
};

function addMessage(req, res) {
    var newMessage = new Messages(req.body.message)
    newMessage.save(function (err) {
        if (err) {
            return res.send(err);
        }
        return res.send({ message: 'Successfully added message', message: newMessage });
    });
}

function editMessage(req, res) {
    Messages.findOneAndUpdate({ _id: req.body.message._id }, req.body.message, function (err, message) {
        if (err) {
            return res.send(err);
        }
        return res.send(message);
    });
}

function removeMessage(req, res) {
    Messages.findOneAndRemove({ _id: req.params.id }, function (err) {
        if (err) {
            return res.send(err);
        }
        return res.send({ message: 'Message was removed' });
    });
}

module.exports = {
    add: addMessage,
    remove: removeMessage,
    edit: editMessage,
    getMessages: getMessages,
    getMessage: getMessage
};