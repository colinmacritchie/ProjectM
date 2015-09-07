API List

baseUrl = 'http://staging.useworkbox.com/api/';

Each endpoint is setup to look for an object on being passed with its type as the parent property

```javascript
{box: box}
{task: task}
{project: project} 
```

Exp.
```javascript
var task = {
    "name": "call terry"
  } 

$.ajax({
  method: 'POST',
  url: baseUrl + 'task',
  data: {task: task}
})
``` 

##Boxes
```javascript
api.get('/boxes', boxController.getBoxes);
api.get('/box', boxController.getBox);
api.post('/box', boxController.add);
api.put('/box', boxController.edit);
api.delete('/box', boxController.remove);
```

##Messages
```javascript
api.get('/messages', messageController.getMessages);
api.get('/message', messageController.getMessage);
api.post('/message', messageController.add);
api.put('/message', messageController.edit);
api.delete('/message', messageController.remove);
```
##Projects
```javascript
api.get('/projects', projectController.getProjects);
api.get('/project', projectController.getProject);
api.post('/project', projectController.add);
api.put('/project', projectController.edit);
api.delete('/project', projectController.remove);
```
##Tasks
```javascript
api.get('/tasks', taskController.getTasks);
api.get('/task', taskController.getTask);
api.post('/task', taskController.add);
api.put('/task', taskController.edit);
api.delete('/task', taskController.remove);
```

##Widgets
```javascript
api.get('/widgets', widgetController.getWidgets);
api.get('/widget', widgetController.getWidget);
api.post('/widget', widgetController.add);
api.put('/widget', widgetController.edit);
api.delete('/widget', widgetController.remove);
```
Each Model follows the spec that Terry outlined here

##BOX
_id
```javascript
name
description
owner - references User
creator - references User
dateCreated - timestamp
dateEdited - timestamp
active - Boolean
```
##Widgets
```javascript
_id
name
description
type - enum Box,Project,Task
active - Boolean
```

##Project
```javascript
_id
name
description
owner - references User
creator - references User
dateCreated - timestamp
dateEdited - timestamp? part of Activity Stream
active - Boolean
dateDue
dateStart
dateComplete
status 
priority
custom {
  any key value pair can be added here
}
```

##Tasks
```javascript
_id
projectId - References Project
name
description
owner- references User
creator - references User
dateCreated - timestamp
dateEdited - timestamp? part of Activity Stream
active - Boolean
dateDue
dateStart
dateComplete
status - References ProjectStatus
priority
hoursEstimate
hoursActual
hoursToDo
custom {
  any key value pair 
}
```