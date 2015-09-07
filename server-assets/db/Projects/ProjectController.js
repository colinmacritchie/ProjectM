var Projects = require('./ProjectModel');
var Users = require('../Users/UserModel');

function _canEdit(req, project, cb){
    var currentUser = req.session.uid;
    if(currentUser == project.owner._id || currentUser == project.creator._id){
        return cb(true);
    }
    for(var i = 0; i < project.subscribers.length; i++){
        if(currentUser == project.subscribers[i]._id){
            return cb(true);
        }
    }
    return cb();
}

function getProjects(req, res) {
    Users.findOne({_id: req.session.uid}).populate('projects').exec(function(err, user){
        if(err){
            return res.send(err)
        }
        if(user){
            return res.send(user.projects);
        }
        return res.send({error: 'Woops something broke please try again'});
    });
}

function getProject(req, res) {
    Projects.findOne({ _id: req.params.id })
        .populate('owner', 'firstName lastName email')
        .populate('creator', 'firstName lastName email')
        .populate('subscribers', 'firstName lastName email')
        .populate('boxId')
        .populate('tasks')
        .exec(function(err, project) {
        if (err) {
            return res.send(err);
        }
        if(project){
            _canEdit(req, project, 
                function(yes){
                    if(yes){
                        return res.send(project);
                    } else {
                        return res.send({error: 'insufficient privileges: You are not subscribed to this project'});
                    }
                });
        } else {
            return res.send({error: 'No project was found'});
        }
    });
};

function addProject(req, res) {
    Users.findOne({
        _id: req.session.uid
    }, function(err, user){
            if(err){
                return res.send(err);
            }
            if(user){
                var newProject = new Projects(req.body.project);
                newProject.owner = req.session.uid;
                newProject.creator = req.session.uid;
                newProject.subscribers.addToSet(req.session.uid);
                newProject.dateCreated = Date.now();
                newProject.save(function (err) {
                    if (err) {
                        return res.send(err);
                    }
                    user.projects.addToSet(newProject._id);
                    user.save(function(err){
                        if(err){
                            return res.send(err);
                        }
                        return res.send({ message: 'Successfully added project', project: newProject });
                    });
                });
            } else {
                return res.send({error: 'Unable to validate user please login and try again'});
            }
        });
}

function editProject(req, res) {
   var newProject = req.body.project;
   Projects.findOne({ _id: newProject._id },
    function(err, project) {
        if (err) {
            return res.send(err);
        }
        if(project){
            _canEdit(req, project, 
                function(yes){
                    if(yes){
                        Projects.findOneAndUpdate({_id: project._id}, newProject,
                        function(err, updatedProject){
                            if(err){
                                return res.send(err);
                            }
                            newProject.stream = project.stream;
                            project.stream = [];
                            updatedProject.stream.push(project);
                            newProject.stream.push(project);
                            updatedProject.save(function(err){
                                if(err){
                                    return res.send(err);
                                }
                                return res.send({message: 'Project successfully updated', project: newProject});
                            });
                        });
                    } else {
                        return res.send({error: 'insufficient privileges: You are not subscribed to this project'});
                    }
                });
            } else {
            return res.send({error: 'No project was found'});
        }
    });
}

function removeProject(req, res) {
    Projects.findOne({ _id: req.params.id },
    function(err, project) {
        if (err) {
            return res.send(err);
        }
        if(project){
            _canEdit(req, project, 
                function(yes){
                    if(yes){
                        Projects.findOneAndRemove({ _id: req.params.id },
                          function (err) {
                            if (err) {
                                return res.send(err);
                            }
                            return res.send({message: 'Project was removed'});
                          });
                    } else {
                        return res.send({error: 'insufficient privileges: You are not allowed to remove this project'});
                    }
                });
            } else {
            return res.send({error: 'No project was found'});
        }
    });
}

function addSubscriber (req, res){
    Projects.findOne({
        _id: req.body.project._id
    }, function(err, project){
        if(err){
            return res.send(err);
        }
        if(project){
            if(req.session.uid === project.owner || req.session.uid === project.creator){
                    Users.findOne({email: req.body.user.email}, function(err, user){
                        if(err){
                            return res.send(err);
                        }
                        if(user){
                            project.subscribers.addToSet(user._id);
                            project.save(function(err){
                                if(err){
                                    return res.send(err);
                                }
                                return res.send({message: 'Invite successfully sent', project: project});
                            });
                        } else {
                            //TODO: if inviting someone who is not already a WorkBox user
                            //send email inviting user to WorkBox and project
                            req.send({message: 'User invited to start using workproject'});
                        }
                    })
            } else {
                return req.send({error: 'Insufficient privileges: You do not have permission to send invites for this project'});
            }
        }
        return res.send({error: 'Project was not found'});
    });
}

module.exports = {
    add: addProject,
    remove: removeProject,
    edit: editProject,
    getProjects: getProjects,
    getProject: getProject,
    addSubscriber: addSubscriber
};