var Tasks = require('./TaskModel');

function getTasks(req, res) {
    Tasks.find().exec(function (err, tasks) {
        if (err) {
            return res.send(err);
        } else {
            return res.send(tasks);
        }
    });
}

function getTask(req, res) {
    Tasks.findOne({ _id: req.params.id }, function (err, task) {
        if (err) {
            return res.send(err);
        }
        return res.send(task);
    });
};

function addTask(req, res) {
    var newTask = new Tasks(req.body.task)
    newTask.save(function (err) {
        if (err) {
            return res.send(err);
        }
        return res.send({ message: 'Successfully added task', task: newTask});
    });
}

function editTask(req, res) {
    Tasks.findOneAndUpdate({ _id: req.body.task._id }, req.body.task, function (err, task) {
        if (err) {
            return res.send(err);
        }
        return res.send(task);
    });
}

function removeTask(req, res) {
    Tasks.findOneAndRemove({ _id: req.params.id }, function (err) {
        if (err) {
            return res.send(err);
        }
        return res.send({ message: 'Task was removed' });
    });
}

module.exports = {
    add: addTask,
    remove: removeTask,
    edit: editTask,
    getTasks: getTasks,
    getTask: getTask
};