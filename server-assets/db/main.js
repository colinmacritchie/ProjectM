var Users = require('./Users/UserModel'),
    Boxes = require('./Boxes/BoxModel'),
    Messages = require('./Messages/MessageModel'),
    Projects = require('./Projects/ProjectModel'),
    Tasks = require('./Tasks/TaskModel'),
    Widgets = require('./Widgets/WidgetModel'),
    Notes = require('./Notes/NoteModel'),
    Events = require('./Events/EventModel'),
    authController = require('./Users/AuthController'),
    BoxController = require('./Boxes/BoxController'),
    MessageController = require('./Messages/MessageController'),
    ProjectController = require('./Projects/ProjectController'),
    TaskController = require('./Tasks/TaskController'),
    WidgetController = require('./Widgets/WidgetController'),
    NoteController = require('./Notes/NoteController'),
    EventController = require('./Events/EventController');

module.exports = {
    models: {
        users: Users,
        boxes: Boxes,
        messages: Messages,
        projects: Projects,
        tasks: Tasks,
        widgets: Widgets,
        notes: Notes,
        events: Events
    },
    controllers: {
        auth: authController,
        box: BoxController,
        message: MessageController,
        project: ProjectController,
        task: TaskController,
        widget: WidgetController,
        note: NoteController,
        event: EventController
    }
};
