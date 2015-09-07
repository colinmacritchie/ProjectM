var db = require('../config/namespace').dbConnect.db,
    authController = db.controllers.auth,
    boxController = db.controllers.box,
    messageController = db.controllers.message,
    projectController = db.controllers.project,
    taskController = db.controllers.task,
    widgetController = db.controllers.widget,
    noteController = db.controllers.note,
    eventController = db.controllers.event,
    api = require('express')();

api.use(function(req, res, next){
  if(req.session.uid){
    console.log(req.session, 'The Session Obj')
    next();
  } else {
    return res.send({error: 'Protected API: Please Login to continue'});
  }
});

//users
api.get('/users/me', authController.authenticate);
api.put('/users/me', authController.update);
api.get('/users/:id', authController.getUser);
api.get('/users/', authController.getUsers);
//api.get('/users/:teamName', authController.getUsersByTeam);

//Boxes
api.get('/boxes', boxController.getBoxes);
api.get('/box/:id', boxController.getBox);
api.post('/box', boxController.add);
api.post('/box/invite', boxController.addSubscriber);
api.put('/box', boxController.edit);
api.delete('/box/:id', boxController.remove);

//Messages
api.get('/messages', messageController.getMessages);
api.get('/message/:id', messageController.getMessage);
api.post('/message', messageController.add);
api.put('/message', messageController.edit);
api.delete('/message/:id', messageController.remove);

//Projects
api.get('/projects', projectController.getProjects);
api.get('/project/:id', projectController.getProject);
api.post('/project', projectController.add);
api.put('/project', projectController.edit);
api.delete('/project/:id', projectController.remove);

//Tasks
api.get('/tasks', taskController.getTasks);
api.get('/task/:id', taskController.getTask);
api.post('/task', taskController.add);
api.put('/task', taskController.edit);
api.delete('/task/:id', taskController.remove);

//Widgets
api.get('/widgets', widgetController.getWidgets);
api.get('/widget/:id', widgetController.getWidget);
api.post('/widget', widgetController.add);
api.put('/widget', widgetController.edit);
api.delete('/widget/:id', widgetController.remove);

//Notes
api.get('/notes', noteController.getNotes);
api.get('/note/:id', noteController.getNote);
api.post('/note', noteController.add);
api.put('/note', noteController.edit);
api.delete('/note/:id', noteController.remove);


//Notes
api.get('/events', eventController.getEvents);
api.get('/event/:id', eventController.getEvent);
api.post('/event', eventController.add);
api.put('/event', eventController.edit);
api.delete('/event/:id', eventController.remove);

module.exports = api;
