var Boxes = require('./BoxModel');
var Users = require('../Users/UserModel');

function _getUser(res, cb){
    Users.findOne({_id: req.session.uid}, function(err,user){
        if(err){
            console.log(err);
            return res.send(err)
        }
        if(user){
            return cb(user);
        }
        return res.send({error: 'Please Login to continue'});
    })
}

function getBoxes(req, res) {
    Users.findOne({_id: req.session.uid}).populate('boxes').exec(function(err, user){
        if(err){
            return res.send(err)
        }
        if(user){
            return res.send(user.boxes);
        }
        return res.send({error: 'Woops something broke please try again'});
    });
}

function getBox(req, res) {
    Boxes.findOne({ _id: req.params.id })
        .populate('owner', 'firstName lastName email')
        .populate('creator', 'firstName lastName email')
        .populate('subscribers', 'firstName lastName email')
        .exec(function(err, box) {
        if (err) {
            return res.send(err);
        }
        if(box){
            for(var i = 0; i < box.subscribers.length; i++){
                if(req.session.uid == box.subscribers[i]._id){
                    return res.send(box);
                }
            }
            return res.send({error: 'insufficient privileges: You are not subscribed to this box'});
        } else {
            return res.send({error: 'No box was found'});
        }
    });
};

function addBox(req, res) {
    Users.findOne({
        _id: req.session.uid
    }, function(err, user){
            if(err){
                return res.send(err);
            }
            if(user){
                var newBox = new Boxes(req.body.box);
                newBox.owner = req.session.uid;
                newBox.creator = req.session.uid;
                newBox.subscribers.addToSet(req.session.uid);
                newBox.save(function (err) {
                    if (err) {
                        return res.send(err);
                    }
                    user.boxes.addToSet(newBox._id);
                    user.save(function(err){
                        if(err){
                            return res.send(err);
                        }
                        return res.send({ message: 'Successfully added box', box: newBox });
                    })
                });
            } else {
                return res.send({error: 'Unable to validate user please login and try again'});
            }
        });
}

function editBox(req, res) {
   var newBox = req.body.box;
   var canEdit = false;
   Boxes.findOne({ _id: newBox._id },
    function(err, box) {
        if (err) {
            return res.send(err);
        }
        if(box){
            for(var i = 0; i < box.subscribers.length; i++){
                if(req.session.uid == box.subscribers[i]){
                    canEdit = true;
                    break;
                }
            }
            if(canEdit){
                Boxes.findOneAndUpdate({_id: box._id}, newBox,
                    function(err, updatedBox){
                        if(err){
                            return res.send(err);
                        }
                        newBox.stream = box.stream;
                        box.stream = [];
                        updatedBox.stream.push(box);
                        newBox.stream.push(box);
                        updatedBox.save(function(err){
                            if(err){
                                return res.send(err);
                            }
                            return res.send({message: 'Box successfully updated', box: newBox});
                        })
                    })
            } else {
                return res.send({error: 'insufficient privileges: You are not subscribed to this box'});
            }
        } else {
            return res.send({error: 'No box was found'});
        }
    });
}

function removeBox(req, res) {
    Boxes.findOneAndRemove({ _id: req.params.id }, function (err) {
        if (err) {
            return res.send(err);
        }
        return res.send({message: 'Box was removed'});
    });
}

function addSubscriber (req, res){
    Boxes.findOne({
        _id: req.body.box._id
    }, function(err, box){
        if(err){
            return res.send(err);
        }
        if(box){
            if(req.session.uid === box.owner || req.session.uid === box.creator){
                    Users.findOne({email: req.body.user.email}, function(err, user){
                        if(err){
                            return res.send(err);
                        }
                        if(user){
                            box.subscribers.addToSet(user._id);
                            box.save(function(err){
                                if(err){
                                    return res.send(err);
                                }
                                return res.send({message: 'Invite successfully sent', box: box});
                            })
                        } else {
                            //TODO: if inviting someone who is not already a WorkBox user
                            //send email inviting user to WorkBox and box
                            req.send({message: 'User invited to start using workbox'});
                        }
                    })
            } else {
                return req.send({error: 'Insufficient privileges: You do not have permission to send invites for this box'});
            }
        }
        return res.send({error: 'Box was not found'});
    });
}

module.exports = {
    add: addBox,
    remove: removeBox,
    edit: editBox,
    getBoxes: getBoxes,
    getBox: getBox,
    addSubscriber: addSubscriber
};