var Events = require('./EventModel');
var Users = require('../Users/UserModel');

function getEvents(req, res) {
    Users.findOne({_id: req.session.uid}).populate('events').exec(function(err, user){
        if(err){
            return res.send(err)
        }
        if(user){
            return res.send(user.events);
        }
        return res.send({error: 'Woops something broke please try again'});
    });
}

function getEvent(req, res) {
    Events.findOne({ _id: req.params.id })
        .populate('owner', 'firstName lastName email')
        .populate('projectId')
        .populate('taskId')
        .exec(function(err, event) {
        if (err) {
            return res.send(err);
        }
        if(event){
            for(var i = 0; i < event.subscribers.length; i++){
                if(req.session.uid == event.subscribers[i]._id){
                    return res.send(event);
                }
            }
            return res.send({error: 'insufficient privileges: You are not subscribed to this event'});
        } else {
            return res.send({error: 'No event was found'});
        }
    });
};

function addEvent(req, res) {
    Users.findOne({
        _id: req.session.uid
    }, function(err, user){
            if(err){
                return res.send(err);
            }
            if(user){
                var newEvent = new Events(req.body.event);
                newEvent.owner = req.session.uid;
                newEvent.creator = req.session.uid;
                newEvent.save(function (err) {
                    if (err) {
                        return res.send(err);
                    }
                    user.events.addToSet(newEvent._id);
                    user.save(function(err){
                        if(err){
                            return res.send(err);
                        }
                        return res.send({ message: 'Successfully added event', event: newEvent });
                    })
                });
            } else {
                return res.send({error: 'Unable to validate user please login and try again'});
            }
        });
}

function editEvent(req, res) {
   var newEvent = req.body.event;
   var canEdit = false;
   Events.findOne({ _id: newEvent._id },
    function(err, event) {
        if (err) {
            return res.send(err);
        }
        if(event){
            if(req.session.uid == event.owner || req.session.uid == event.creator){
                canEdit = true;
            }
            if(canEdit){
                Events.findOneAndUpdate({_id: event._id}, newEvent,
                    function(err, updatedEvent){
                        if(err){
                            return res.send(err);
                        }
                            return res.send({message: 'Event successfully updated', event: newEvent});
                        });
            } else {
                return res.send({error: 'insufficient privileges: Only the author can edit this event'});
            }
        } else {
            return res.send({error: 'No event was found'});
        }
    });
}

function removeEvent(req, res) {
    Events.findOneAndRemove({ _id: req.params.id }, function (err) {
        if (err) {
            return res.send(err);
        }
        return res.send({message: 'Event was removed'});
    });
}

module.exports = {
    add: addEvent,
    remove: removeEvent,
    edit: editEvent,
    getEvents: getEvents,
    getEvent: getEvent
};