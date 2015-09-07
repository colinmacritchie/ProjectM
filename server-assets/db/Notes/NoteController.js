var Notes = require('./NoteModel');
var Users = require('../Users/UserModel');

function getNotes(req, res) {
    Users.findOne({_id: req.session.uid}).populate('notes').exec(function(err, user){
        if(err){
            return res.send(err)
        }
        if(user){
            return res.send(user.notes);
        }
        return res.send({error: 'Woops something broke please try again'});
    });
}

function getNote(req, res) {
    Notes.findOne({ _id: req.params.id })
        .populate('owner', 'firstName lastName email')
        .populate('projectId')
        .populate('taskId')
        .exec(function(err, note) {
        if (err) {
            return res.send(err);
        }
        if(note){
            for(var i = 0; i < note.subscribers.length; i++){
                if(req.session.uid == note.subscribers[i]._id){
                    return res.send(note);
                }
            }
            return res.send({error: 'insufficient privileges: You are not subscribed to this note'});
        } else {
            return res.send({error: 'No note was found'});
        }
    });
};

function addNote(req, res) {
    Users.findOne({
        _id: req.session.uid
    }, function(err, user){
            if(err){
                return res.send(err);
            }
            if(user){
                var newNote = new Notes(req.body.note);
                newNote.owner = req.session.uid;
                newNote.creator = req.session.uid;
                newNote.save(function (err) {
                    if (err) {
                        return res.send(err);
                    }
                    user.notes.addToSet(newNote._id);
                    user.save(function(err){
                        if(err){
                            return res.send(err);
                        }
                        return res.send({ message: 'Successfully added note', note: newNote });
                    })
                });
            } else {
                return res.send({error: 'Unable to validate user please login and try again'});
            }
        });
}

function editNote(req, res) {
   var newNote = req.body.note;
   var canEdit = false;
   Notes.findOne({ _id: newNote._id },
    function(err, note) {
        if (err) {
            return res.send(err);
        }
        if(note){
            if(req.session.uid == note.owner || req.session.uid == note.creator){
                canEdit = true;
            }
            if(canEdit){
                Notes.findOneAndUpdate({_id: note._id}, newNote,
                    function(err, updatedNote){
                        if(err){
                            return res.send(err);
                        }
                            return res.send({message: 'Note successfully updated', note: newNote});
                        });
            } else {
                return res.send({error: 'insufficient privileges: Only the author can edit this note'});
            }
        } else {
            return res.send({error: 'No note was found'});
        }
    });
}

function removeNote(req, res) {
    Notes.findOneAndRemove({ _id: req.params.id }, function (err) {
        if (err) {
            return res.send(err);
        }
        return res.send({message: 'Note was removed'});
    });
}

module.exports = {
    add: addNote,
    remove: removeNote,
    edit: editNote,
    getNotes: getNotes,
    getNote: getNote
};